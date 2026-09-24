const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const srcPath = path.join(__dirname, '../public/images/subway-logo.png');
  const buffer = fs.readFileSync(srcPath);

  // 1. First, make transparent version by keying out white (RGB > 245)
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const transparentData = Buffer.from(data);
  for (let i = 0; i < transparentData.length; i += 4) {
    const r = transparentData[i];
    const g = transparentData[i + 1];
    const b = transparentData[i + 2];
    // If it's near white background, make transparent
    if (r > 240 && g > 240 && b > 240) {
      transparentData[i + 3] = 0;
    }
  }

  const transparentEmblem = await sharp(transparentData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();

  // 2. High-res branded 512x512 icon with clean white circular background badge
  // to ensure 100% visibility on both dark and light browser tab bars
  const size = 512;
  const padding = 48;
  const innerSize = size - padding * 2; // 416x416

  const resizedEmblem = await sharp(buffer)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  // Create crisp white circular badge svg mask
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/>
    </svg>`
  );

  // Generate 512x512 PNG with circular badge
  const icon512 = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([
      { input: circleMask, top: 0, left: 0 },
      { input: resizedEmblem, top: padding, left: padding },
    ])
    .png()
    .toBuffer();

  // Generate 180x180 Apple Touch Icon (square with white bg)
  const appleIcon = await sharp(buffer)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  // Generate 192x192 PNG
  const icon192 = await sharp(icon512).resize(192, 192).png().toBuffer();
  // Generate 32x32 PNG
  const icon32 = await sharp(icon512).resize(32, 32).png().toBuffer();
  // Generate 16x16 PNG
  const icon16 = await sharp(icon512).resize(16, 16).png().toBuffer();
  // Generate 48x48 PNG
  const icon48 = await sharp(icon512).resize(48, 48).png().toBuffer();

  // Create standard multi-resolution ICO file (16, 32, 48)
  const icoImages = [
    { size: 16, buffer: icon16 },
    { size: 32, buffer: icon32 },
    { size: 48, buffer: icon48 },
  ];

  // ICO header: 6 bytes
  // 0-1: reserved (0)
  // 2-3: type (1 for ico)
  // 4-5: count (3)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoImages.length, 4);

  // Each directory entry is 16 bytes
  const dirSize = 16 * icoImages.length;
  let currentOffset = 6 + dirSize;

  const dirEntries = [];
  for (const img of icoImages) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...icoImages.map((img) => img.buffer),
  ]);

  // Destination paths
  const targets = [
    { path: path.join(__dirname, '../app/favicon.ico'), data: icoBuffer },
    { path: path.join(__dirname, '../public/favicon.ico'), data: icoBuffer },
    { path: path.join(__dirname, '../app/icon.png'), data: icon512 },
    { path: path.join(__dirname, '../public/icon.png'), data: icon512 },
    { path: path.join(__dirname, '../app/apple-icon.png'), data: appleIcon },
    { path: path.join(__dirname, '../public/apple-icon.png'), data: appleIcon },
  ];

  for (const t of targets) {
    fs.writeFileSync(t.path, t.data);
    console.log(`Wrote: ${t.path} (${t.data.length} bytes)`);
  }
}

generate().catch(console.error);
