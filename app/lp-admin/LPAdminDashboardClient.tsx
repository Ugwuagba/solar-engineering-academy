"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Plus,
  Copy,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Layers,
  Search,
  ArrowLeft,
  LogOut,
  Sparkles,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  X,
  Share2,
} from "lucide-react";
import { SerializedLandingPage } from "@/lib/landing-page-types";
import {
  createLandingPage,
  duplicateLandingPage,
  bulkDuplicateLandingPages,
  togglePublishLandingPage,
  deleteLandingPage,
} from "./actions/lp-actions";

interface LPAdminDashboardClientProps {
  initialPages: SerializedLandingPage[];
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function LPAdminDashboardClient({
  initialPages,
  user,
}: LPAdminDashboardClientProps) {
  const [pages, setPages] = useState<SerializedLandingPage[]>(initialPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [singleDupModalOpen, setSingleDupModalOpen] = useState(false);
  const [bulkDupModalOpen, setBulkDupModalOpen] = useState(false);

  // Create form state
  const [createTitle, setCreateTitle] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createWhatsapp, setCreateWhatsapp] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Single Duplicate form state
  const [dupSourceId, setDupSourceId] = useState("");
  const [dupTitle, setDupTitle] = useState("");
  const [dupSlug, setDupSlug] = useState("");
  const [dupPlaceholders, setDupPlaceholders] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupError, setDupError] = useState<string | null>(null);

  // Bulk Duplicate form state
  const [bulkSourceId, setBulkSourceId] = useState(pages[0]?.id || "");
  const [bulkPlaceholders, setBulkPlaceholders] = useState(false);
  const [bulkRows, setBulkRows] = useState([
    { title: "Solar Ad Campaign 1", slug: "solar-ad-1" },
    { title: "Solar Ad Campaign 2", slug: "solar-ad-2" },
    { title: "Solar Ad Campaign 3", slug: "solar-ad-3" },
    { title: "Solar Ad Campaign 4", slug: "solar-ad-4" },
    { title: "Solar Ad Campaign 5", slug: "solar-ad-5" },
    { title: "Solar Ad Campaign 6", slug: "solar-ad-6" },
    { title: "Solar Ad Campaign 7", slug: "solar-ad-7" },
  ]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Action status feedback
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Helper to live-sanitize slug input
  const cleanInputSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  };

  // Filtered pages
  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "PUBLISHED"
        ? p.isPublished
        : !p.isPublished;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);

    try {
      const res = await createLandingPage({
        title: createTitle,
        slug: createSlug,
        whatsappUrl: createWhatsapp,
      });

      if (res.success) {
        showNotice(`Created new landing page: /lp/${res.slug}`);
        setCreateModalOpen(false);
        setCreateTitle("");
        setCreateSlug("");
        setCreateWhatsapp("");
        // Reload page to refresh RSC state
        window.location.reload();
      }
    } catch (err: any) {
      setCreateError(err.message || "Failed to create landing page.");
    } finally {
      setCreateLoading(false);
    }
  };

  const openDuplicateModal = (page: SerializedLandingPage) => {
    setDupSourceId(page.id);
    setDupTitle(`${page.title} (Copy)`);
    setDupSlug(cleanInputSlug(`${page.slug}-copy`));
    setDupPlaceholders(false);
    setDupError(null);
    setSingleDupModalOpen(true);
  };

  const handleDuplicate = async (e: React.FormEvent) => {
    e.preventDefault();
    setDupError(null);
    setDupLoading(true);

    try {
      const res = await duplicateLandingPage(
        dupSourceId,
        dupSlug,
        dupTitle,
        dupPlaceholders
      );

      if (res.success) {
        showNotice(`Duplicated landing page: /lp/${res.slug}`);
        setSingleDupModalOpen(false);
        window.location.reload();
      }
    } catch (err: any) {
      setDupError(err.message || "Failed to duplicate landing page.");
    } finally {
      setDupLoading(false);
    }
  };

  const handleBulkDuplicate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError(null);
    setBulkLoading(true);

    try {
      const res = await bulkDuplicateLandingPages(
        bulkSourceId || pages[0]?.id,
        bulkRows,
        bulkPlaceholders
      );

      if (res.success) {
        showNotice(`Successfully generated ${res.count} campaign landing pages!`);
        setBulkDupModalOpen(false);
        window.location.reload();
      }
    } catch (err: any) {
      setBulkError(err.message || "Failed to create batch duplicates.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentTitle: string) => {
    try {
      const res = await togglePublishLandingPage(id);
      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: res.isPublished } : p))
      );
      showNotice(
        `'${currentTitle}' is now ${res.isPublished ? "PUBLISHED (Live)" : "DRAFT (Hidden)"}.`
      );
    } catch (err: any) {
      alert(err.message || "Failed to toggle status.");
    }
  };

  const handleDelete = async (page: SerializedLandingPage) => {
    if (page.slug === "solar") {
      alert("The master 'solar' landing page cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the landing page '${page.title}' (/lp/${page.slug})? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deleteLandingPage(page.id);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
      showNotice(`Deleted landing page '/lp/${page.slug}'.`);
    } catch (err: any) {
      alert(err.message || "Failed to delete landing page.");
    }
  };

  const isSuperOrProgramAdmin =
    user.role === "SUPER_ADMIN" ||
    user.role === "PROGRAM_ADMIN" ||
    user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col antialiased">
      
      {/* ─── Top Studio Navbar ─── */}
      <header className="sticky top-0 z-40 bg-[#0b1528]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-700 flex items-center justify-center shrink-0 shadow-md">
              <Image
                src="/images/subway-logo.png"
                alt="Subway Schools Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wide">
                  Landing Page Studio
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Campaign Funnel CMS &amp; URL Slug Manager
              </p>
            </div>
          </div>

          {/* User & Actions Right */}
          <div className="flex items-center gap-3">
            {isSuperOrProgramAdmin && (
              <Link
                href={user.role === "SUPER_ADMIN" ? "/super-admin/users" : "/program-admin"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/lp-admin/login" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Toast Notice */}
        {actionNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between shadow-xl animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── Header Hero & Quick Metrics ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campaign Landing Pages
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, duplicate, and customize high-converting webinar funnels with unique URL slugs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setCreateError(null);
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>

            <button
              onClick={() => {
                setBulkError(null);
                setBulkDupModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95 transition"
            >
              <Layers className="w-4 h-4" />
              <span>Bulk Duplicate (7 Pages)</span>
            </button>
          </div>
        </div>

        {/* ─── Quick KPI Cards ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1528] border border-slate-800 shadow-md">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Funnel Pages
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {pages.length}
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1528] border border-slate-800 shadow-md">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Live &amp; Published
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
              {pages.filter((p) => p.isPublished).length}
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1528] border border-slate-800 shadow-md">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Draft / Hidden
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-400 mt-1 block">
              {pages.filter((p) => !p.isPublished).length}
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1528] border border-slate-800 shadow-md">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Auto-Reflow Engine
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
              Active
            </span>
          </div>
        </div>

        {/* ─── Search & Filters Bar ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b1528] p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or /lp/ slug..."
              className="w-full pl-10 pr-4 py-2 bg-[#070e1b] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {(["ALL", "PUBLISHED", "DRAFT"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === filter
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Landing Pages Inventory Table ─── */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Page Title &amp; Live Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Media Mode</th>
                  <th className="px-6 py-4">Funnel WhatsApp</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                {filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No landing pages match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr
                      key={page.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Title & Slug */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {page.title}
                            </span>
                            {page.slug === "solar" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                                <Lock className="w-3 h-3" /> Master
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/lp/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-sky-400 hover:text-sky-300 transition"
                          >
                            <span>/lp/{page.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTogglePublish(page.id, page.title)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                            page.isPublished
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/80"
                          }`}
                          title="Click to toggle status"
                        >
                          {page.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Media Mode */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Auto-Reflow
                        </span>
                      </td>

                      {/* WhatsApp Indicator */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                          <Share2 className="w-3 h-3" />
                          <span>Connected</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                        {new Date(page.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Live Preview */}
                          <Link
                            href={`/lp/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition"
                            title="Open Live Landing Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit Full Page */}
                          <Link
                            href={`/lp-admin/${page.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => openDuplicateModal(page)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition"
                            title="Duplicate as new campaign URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            disabled={page.slug === "solar"}
                            onClick={() => handleDelete(page)}
                            className={`p-2 rounded-xl transition ${
                              page.slug === "solar"
                                ? "text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed"
                                : "text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20"
                            }`}
                            title={
                              page.slug === "solar"
                                ? "Master page is protected"
                                : "Delete Landing Page"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 1: CREATE NEW LANDING PAGE
         ═════════════════════════════════════════════ */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0b1528] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Create New Landing Page</h3>
                <p className="text-xs text-slate-400">
                  Initializes a new funnel cloning the master solar template structure.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Internal Page Title
                </label>
                <input
                  type="text"
                  required
                  value={createTitle}
                  onChange={(e) => {
                    setCreateTitle(e.target.value);
                    if (!createSlug) {
                      setCreateSlug(cleanInputSlug(e.target.value));
                    }
                  }}
                  placeholder="e.g. Lagos Facebook Ad Campaign"
                  className="w-full px-4 py-2.5 bg-[#070e1b] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Locked Prefix URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Locked Target URL Slug
                </label>
                <div className="flex items-center rounded-xl bg-[#070e1b] border border-slate-800 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/40 overflow-hidden">
                  <span className="px-3.5 py-2.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border-r border-slate-800 shrink-0 select-none">
                    subwayschools.com/lp/
                  </span>
                  <input
                    type="text"
                    required
                    value={createSlug}
                    onChange={(e) => setCreateSlug(cleanInputSlug(e.target.value))}
                    placeholder="solar-lagos-ads"
                    className="w-full px-3 py-2.5 bg-transparent text-sm text-white placeholder-slate-600 font-mono focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Live URL will be: /lp/{createSlug || "[slug]"}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  WhatsApp Group Invite Link (Optional override)
                </label>
                <input
                  type="url"
                  value={createWhatsapp}
                  onChange={(e) => setCreateWhatsapp(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-4 py-2.5 bg-[#070e1b] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Create Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 2: SINGLE DUPLICATE
         ═════════════════════════════════════════════ */}
      {singleDupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0b1528] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Duplicate Landing Page</h3>
                <p className="text-xs text-slate-400">
                  Clones content into a dedicated new campaign URL slug.
                </p>
              </div>
              <button
                onClick={() => setSingleDupModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {dupError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dupError}</span>
              </div>
            )}

            <form onSubmit={handleDuplicate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  New Internal Title
                </label>
                <input
                  type="text"
                  required
                  value={dupTitle}
                  onChange={(e) => setDupTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#070e1b] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Locked Prefix URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  New Unique URL Slug
                </label>
                <div className="flex items-center rounded-xl bg-[#070e1b] border border-slate-800 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/40 overflow-hidden">
                  <span className="px-3.5 py-2.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border-r border-slate-800 shrink-0 select-none">
                    subwayschools.com/lp/
                  </span>
                  <input
                    type="text"
                    required
                    value={dupSlug}
                    onChange={(e) => setDupSlug(cleanInputSlug(e.target.value))}
                    className="w-full px-3 py-2.5 bg-transparent text-sm text-white font-mono focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Live URL will be: /lp/{dupSlug || "[slug]"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Clear Media URLs on Duplicate
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Start with empty media slots (the live page reflows cleanly without placeholders).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={dupPlaceholders}
                  onChange={(e) => setDupPlaceholders(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSingleDupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dupLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {dupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                  <span>Duplicate Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 3: BULK DUPLICATE (7 PAGES)
         ═════════════════════════════════════════════ */}
      {bulkDupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl my-8 bg-[#0b1528] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <span>Bulk Duplicate — Create 7 Campaign Funnels</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Generate multiple campaign landing pages simultaneously with customized locked URL paths.
                </p>
              </div>
              <button
                onClick={() => setBulkDupModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bulkError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bulkError}</span>
              </div>
            )}

            <form onSubmit={handleBulkDuplicate} className="space-y-6">
              {/* Source Page Selection & Option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Source Template Page
                  </label>
                  <select
                    value={bulkSourceId}
                    onChange={(e) => setBulkSourceId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#070e1b] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (/lp/{p.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 self-end">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Clear Media URLs
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Start fresh with clean empty slots (auto-reflows cleanly)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={bulkPlaceholders}
                    onChange={(e) => setBulkPlaceholders(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 7 Rows */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Target 7 Pages Configuration:
                </label>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {bulkRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#070e1b] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-3"
                    >
                      <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-500/20">
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Title */}
                      <input
                        type="text"
                        required
                        value={row.title}
                        onChange={(e) => {
                          const updated = [...bulkRows];
                          updated[idx].title = e.target.value;
                          setBulkRows(updated);
                        }}
                        placeholder={`Page ${idx + 1} Title`}
                        className="w-full sm:w-1/2 px-3 py-2 bg-[#0b1528] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      {/* Locked Prefix Slug */}
                      <div className="w-full sm:w-1/2 flex items-center rounded-xl bg-[#0b1528] border border-slate-700/80 overflow-hidden">
                        <span className="px-2 py-2 text-[10px] font-mono text-blue-400 bg-blue-500/10 border-r border-slate-700 shrink-0 select-none">
                          /lp/
                        </span>
                        <input
                          type="text"
                          required
                          value={row.slug}
                          onChange={(e) => {
                            const updated = [...bulkRows];
                            updated[idx].slug = cleanInputSlug(e.target.value);
                            setBulkRows(updated);
                          }}
                          placeholder={`slug-${idx + 1}`}
                          className="w-full px-2.5 py-2 bg-transparent text-xs text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBulkDupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkLoading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-blue-600/30"
                >
                  {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                  <span>Generate All 7 Pages</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

