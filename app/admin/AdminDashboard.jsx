"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Check, Edit3, Eye, EyeOff, LogOut, Plus, Save, Trash2, RefreshCw, Mail, Phone, Building2, MessageSquare, Image as ImageIcon, UploadCloud } from "lucide-react";

const emptyProduct = {
  slug: "",
  name: "",
  category: "",
  description: "",
  detail: "",
  image_url: "",
  features: [],
  mrp: "",
  is_active: true,
  sort_order: 99,
};

const emptyStat = { value: "", label: "", sort_order: 99, is_active: true };

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function toFeatureText(features) {
  return Array.isArray(features) ? features.join(", ") : "";
}
function fromFeatureText(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function toLines(value) {
  return Array.isArray(value) ? value.join("\n") : value || "";
}
function fromLines(value) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

const TABS = ["Settings", "Content", "Products", "Stats", "Enquiries"];
const PRODUCT_IMAGE_BUCKET = "product-images";
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PRODUCT_IMAGE_SIZE = 2 * 1024 * 1024;
const PRODUCT_IMAGE_HELP = "Recommended image: 1200 x 1200 px square, under 2 MB. Supported formats: JPG, PNG, WEBP.";

function RichTextEditor({ label, value, onChange }) {
  const format = (command, valueArg = null) => {
    document.execCommand(command, false, valueArg);
  };

  return (
    <div className="mt-4 block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
          <button type="button" onClick={() => format('bold')} className="rounded bg-white px-3 py-1 text-sm font-bold">Bold</button>
          <button type="button" onClick={() => format('underline')} className="rounded bg-white px-3 py-1 text-sm font-bold">Underline</button>
          <button type="button" onClick={() => format('insertUnorderedList')} className="rounded bg-white px-3 py-1 text-sm font-bold">List</button>
          <select onChange={(e) => format('fontSize', e.target.value)} className="rounded border px-2 py-1 text-sm">
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">Heading</option>
          </select>
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          className="min-h-[160px] p-4 outline-none"
          dangerouslySetInnerHTML={{ __html: value || '' }}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}


export default function AdminDashboard() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  const [session, setSession] = useState(null);
  const [login, setLogin] = useState({ email: adminEmail, password: "" });
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [originalProductImageUrl, setOriginalProductImageUrl] = useState("");
  const [editingStat, setEditingStat] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Settings");

  const isConfigured = Boolean(supabase);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99)),
    [products]
  );

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) loadAdminData(); }, [session]);

  async function loadAdminData() {
    setLoading(true);
    const [s, p, st, inq] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("products").select("*").order("sort_order", { ascending: true }),
      supabase.from("home_stats").select("*").order("sort_order", { ascending: true }),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (s.data) setSettings(s.data);
    if (p.data) setProducts(p.data);
    if (st.data) setStats(st.data);
    if (inq.data) setInquiries(inq.data);
    setLoading(false);
  }

  function showMsg(text, type = "success") {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3500);
  }


  function getPublicAssetPath(value) {
    if (!value) return "";
    return value.startsWith("http") || value.startsWith("/") ? value : `/${value}`;
  }

  function getProductImageStoragePath(value) {
    if (!value) return "";
    const imageValue = String(value).trim();

    if (!imageValue || imageValue.startsWith("data:") || imageValue.startsWith("blob:")) return "";

    const bucketPrefix = `/${PRODUCT_IMAGE_BUCKET}/`;
    const publicStorageMarker = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;

    if (imageValue.startsWith(publicStorageMarker)) {
      return decodeURIComponent(imageValue.slice(publicStorageMarker.length).split("?")[0]);
    }

    if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
      try {
        const url = new URL(imageValue);
        const markerIndex = url.pathname.indexOf(publicStorageMarker);
        if (markerIndex === -1) return "";
        return decodeURIComponent(url.pathname.slice(markerIndex + publicStorageMarker.length));
      } catch (_error) {
        return "";
      }
    }

    if (imageValue.startsWith(bucketPrefix)) {
      return decodeURIComponent(imageValue.slice(bucketPrefix.length).split("?")[0]);
    }

    if (!imageValue.startsWith("/") && !imageValue.includes("://")) {
      return decodeURIComponent(imageValue.split("?")[0]);
    }

    return "";
  }

  async function isProductImageUsedElsewhere(imageUrl, currentProductId) {
    if (!imageUrl) return false;

    const storagePath = getProductImageStoragePath(imageUrl);
    const { data, error } = await supabase.from("products").select("id, image_url");
    if (error) {
      console.warn("Could not verify product image usage before cleanup:", error.message);
      return true;
    }

    return Boolean((data || []).some((product) => {
      if (currentProductId && product.id === currentProductId) return false;
      if (product.image_url === imageUrl) return true;
      return storagePath && getProductImageStoragePath(product.image_url) === storagePath;
    }));
  }

  async function deleteProductImageFromStorageIfUnused(imageUrl, currentProductId) {
    const storagePath = getProductImageStoragePath(imageUrl);
    if (!storagePath) return;

    const isUsedElsewhere = await isProductImageUsedElsewhere(imageUrl, currentProductId);
    if (isUsedElsewhere) return;

    const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([storagePath]);
    if (error) {
      console.warn("Old product image cleanup failed:", error.message);
    }
  }

  function beginProductEdit(product) {
    setOriginalProductImageUrl(product?.image_url || "");
    setEditingProduct({ ...product });
  }

  function closeProductEditor() {
    setOriginalProductImageUrl("");
    setEditingProduct(null);
  }

  async function uploadProductImage(file) {
    if (!file || !editingProduct) return;
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      showMsg("Please upload only JPG, PNG or WEBP images.", "error");
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
      showMsg("Image is too large. Please upload an image under 2 MB.", "error");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeSlug = editingProduct.slug || slugify(editingProduct.name || "product");
    const filePath = `${safeSlug}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      showMsg(`Image upload failed: ${error.message}. Please confirm the product-images bucket exists in Supabase.`, "error");
      return;
    }

    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(filePath);
    setEditingProduct({ ...editingProduct, image_url: data.publicUrl });
    showMsg("Image uploaded and selected. Save the product to keep this image.");
  }


  async function uploadGalleryImages(files) {
    if (!files?.length || !editingProduct) return;

    const uploadedUrls = [];
    for (const file of Array.from(files)) {
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        showMsg("Please upload only JPG, PNG or WEBP images.", "error");
        return;
      }
      if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
        showMsg(`${file.name} is too large. Please upload images under 2 MB.`, "error");
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeSlug = editingProduct.slug || slugify(editingProduct.name || "product");
      const filePath = `${safeSlug}-gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        showMsg(`Gallery image upload failed: ${error.message}. Please confirm the product-images bucket exists in Supabase.`, "error");
        return;
      }

      const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    setEditingProduct({
      ...editingProduct,
      gallery_images: [...(editingProduct.gallery_images || []), ...uploadedUrls],
    });
    showMsg(`${uploadedUrls.length} gallery image${uploadedUrls.length > 1 ? "s" : ""} uploaded. Save the product to keep changes.`);
  }

  function removeGalleryImage(indexToRemove) {
    setEditingProduct({
      ...editingProduct,
      gallery_images: (editingProduct.gallery_images || []).filter((_, index) => index !== indexToRemove),
    });
  }

  async function signIn(e) {
    e.preventDefault();
    setMessage({ text: "", type: "success" });
    const { error } = await supabase.auth.signInWithPassword(login);
    if (error) setMessage({ text: error.message, type: "error" });
  }

  async function saveSettings(e) {
    e.preventDefault();
    const payload = {
      ...settings,
      id: 1,
      about_benefits: Array.isArray(settings.about_benefits) ? settings.about_benefits : fromLines(settings.about_benefits || ""),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("site_settings").upsert(payload);
    showMsg(error ? error.message : "Settings saved successfully.", error ? "error" : "success");
    if (!error) setSettings(payload);
  }

  async function saveProduct(e) {
    e.preventDefault();
    const product = {
      ...editingProduct,
      slug: editingProduct.slug || slugify(editingProduct.name),
      features: Array.isArray(editingProduct.features) ? editingProduct.features : fromFeatureText(editingProduct.features),
      updated_at: new Date().toISOString(),
    };
    const { error } = product.id
      ? await supabase.from("products").update(product).eq("id", product.id)
      : await supabase.from("products").insert(product);
    if (error) { showMsg(error.message, "error"); return; }

    if (product.id && originalProductImageUrl && originalProductImageUrl !== product.image_url) {
      await deleteProductImageFromStorageIfUnused(originalProductImageUrl, product.id);
    }

    closeProductEditor();
    showMsg("Product saved successfully.");
    loadAdminData();
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product permanently?")) return;
    const productToDelete = products.find((product) => product.id === id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      await deleteProductImageFromStorageIfUnused(productToDelete?.image_url, id);
      closeProductEditor();
    }
    showMsg(error ? error.message : "Product deleted.", error ? "error" : "success");
    loadAdminData();
  }

  async function saveStat(e) {
    e.preventDefault();
    const stat = { ...editingStat, updated_at: new Date().toISOString() };
    const { error } = stat.id
      ? await supabase.from("home_stats").update(stat).eq("id", stat.id)
      : await supabase.from("home_stats").insert(stat);
    if (error) { showMsg(error.message, "error"); return; }
    setEditingStat(null);
    showMsg("Stat saved successfully.");
    loadAdminData();
  }

  async function deleteStat(id) {
    if (!window.confirm("Delete this stat?")) return;
    const { error } = await supabase.from("home_stats").delete().eq("id", id);
    showMsg(error ? error.message : "Stat deleted.", error ? "error" : "success");
    loadAdminData();
  }

  if (!isConfigured) {
    return (
      <AdminShell>
        <div className="rounded-3xl bg-white p-10 shadow-xl ring-1 ring-yellow-100 text-center max-w-lg mx-auto mt-20">
          <h1 className="text-2xl font-black text-slate-950">Supabase not configured</h1>
          <p className="mt-3 text-slate-500">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel environment variables, then redeploy.</p>
        </div>
      </AdminShell>
    );
  }

  if (loading && !session) {
    return <AdminShell><div className="flex items-center justify-center min-h-[60vh]"><p className="font-bold text-slate-400 animate-pulse">Loading...</p></div></AdminShell>;
  }

  if (!session) {
    return (
      <AdminShell>
        <div className="flex min-h-[80vh] items-center justify-center">
          <form onSubmit={signIn} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-yellow-100">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-xl font-black text-slate-950 shadow-lg">SR</div>
              <h1 className="text-2xl font-black">Admin Login</h1>
              <p className="mt-1 text-sm text-slate-500">Shree Radha Enterprises</p>
            </div>
            <input type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} placeholder="Email address" className="w-full rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            <input type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} placeholder="Password" className="mt-3 w-full rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            <button className="mt-5 w-full rounded-2xl bg-slate-950 py-4 font-black text-white hover:bg-amber-600 transition-colors">Login</button>
            {message.text && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700 text-center">{message.text}</p>}
          </form>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-base font-black text-slate-950 shadow">SR</div>
          <div>
            <h1 className="text-xl font-black leading-none">Website Admin</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage frontend content directly from backend dashboard. Latest tabbed admin v3.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAdminData} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Toast message */}
      {message.text && (
        <div className={`mb-5 rounded-2xl p-4 font-bold text-sm ${message.type === "error" ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-green-50 text-green-700 ring-1 ring-green-200"}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-2xl bg-slate-100 p-1.5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-5 py-2.5 text-sm font-black transition-all ${activeTab === tab ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            {tab}
            {tab === "Enquiries" && inquiries.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs text-white">{inquiries.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── SETTINGS TAB ── */}
      {activeTab === "Settings" && settings && (
        <form onSubmit={saveSettings} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-yellow-100 max-w-2xl">
          <h2 className="mb-6 text-xl font-black">Company Settings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "company_name", label: "Company Name" },
              { key: "tagline", label: "Hero Title" },
              { key: "phone", label: "Phone" },
              { key: "email", label: "Email" },
              { key: "address", label: "Address" },
              { key: "whatsapp", label: "WhatsApp Number" },
              { key: "instagram", label: "Instagram URL" },
              { key: "facebook", label: "Facebook URL" },
              { key: "youtube", label: "YouTube URL" },
              { key: "linkedin", label: "LinkedIn URL" },
            ].map(({ key, label }) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
                <input
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 block sm:col-span-2">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Hero Subtitle</span>
            <textarea
              value={settings.hero_subtitle || ""}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </label>
          <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-500 transition-colors">
            <Save size={17} /> Save Settings
          </button>
        </form>
      )}

      {/* ── CONTENT TAB ── */}
      {activeTab === "Content" && settings && (
        <form onSubmit={saveSettings} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-yellow-100 max-w-4xl">
          <h2 className="mb-2 text-xl font-black">Homepage Content</h2>
          <p className="mb-6 text-sm text-slate-500">Edit text used on the homepage hero, about, product catalog and contact sections.</p>

          <div className="grid gap-5">
            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <h3 className="mb-4 font-black text-slate-800">Hero Section</h3>
              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Hero Badge</span>
                <input value={settings.hero_badge || ""} onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </label>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <h3 className="mb-4 font-black text-slate-800">About Section</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Small Heading</span>
                  <input value={settings.about_eyebrow || ""} onChange={(e) => setSettings({ ...settings, about_eyebrow: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Main Heading</span>
                  <input value={settings.about_title || ""} onChange={(e) => setSettings({ ...settings, about_title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">About Paragraph</span>
                <textarea value={settings.about_body || ""} onChange={(e) => setSettings({ ...settings, about_body: e.target.value })} rows={3} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </label>
              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Benefit Points - one per line</span>
                <textarea value={toLines(settings.about_benefits)} onChange={(e) => setSettings({ ...settings, about_benefits: fromLines(e.target.value) })} rows={5} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </label>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <h3 className="mb-4 font-black text-slate-800">Three Feature Cards</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <label className="block">
                      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Card {n} Title</span>
                      <input value={settings[`feature${n}_title`] || ""} onChange={(e) => setSettings({ ...settings, [`feature${n}_title`]: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400" />
                    </label>
                    <label className="mt-3 block">
                      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Card {n} Text</span>
                      <textarea value={settings[`feature${n}_text`] || ""} onChange={(e) => setSettings({ ...settings, [`feature${n}_text`]: e.target.value })} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400" />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <h3 className="mb-4 font-black text-slate-800">Catalog and Contact Section Text</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["catalog_eyebrow", "Catalog Small Heading"], ["catalog_title", "Catalog Main Heading"], ["catalog_subtitle", "Catalog Subtitle"],
                  ["contact_eyebrow", "Contact Small Heading"], ["contact_title", "Contact Main Heading"], ["contact_subtitle", "Contact Subtitle"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
                    <input value={settings[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </label>
                ))}
              </div>
            </section>
          </div>

          <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-500 transition-colors">
            <Save size={17} /> Save Homepage Content
          </button>
        </form>
      )}


      {/* ── PRODUCTS TAB ── */}
      {activeTab === "Products" && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Product list */}
          <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-yellow-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black">Products</h2>
              <button onClick={() => beginProductEdit({ ...emptyProduct })} className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white hover:bg-amber-600 transition-colors">
                <Plus size={17} />
              </button>
            </div>
            <div className="grid gap-2">
              {sortedProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => beginProductEdit(p)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors ${editingProduct?.id === p.id ? "bg-amber-400 text-slate-950" : "bg-slate-50 text-slate-700 hover:bg-yellow-50"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    {p.name}
                    {!p.is_active && <EyeOff size={13} className="shrink-0 opacity-50" />}
                  </span>
                  <span className="text-xs font-normal opacity-60">{p.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Edit form */}
          {editingProduct ? (
            <form onSubmit={saveProduct} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-yellow-100">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black">{editingProduct.id ? "Edit Product" : "Add New Product"}</h2>
                {editingProduct.id && (
                  <button type="button" onClick={() => deleteProduct(editingProduct.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 size={15} /> Delete
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Product Name</span>
                  <input required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value, slug: editingProduct.slug || slugify(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Slug</span>
                  <input required value={editingProduct.slug} onChange={(e) => setEditingProduct({ ...editingProduct, slug: slugify(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Category</span>
                  <input value={editingProduct.category || ""} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">MRP (optional)</span>
                  <input value={editingProduct.mrp || ""} onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })} placeholder="Leave blank to hide MRP" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                </label>
              </div>
              <div className="mt-5 rounded-3xl border border-amber-100 bg-amber-50/40 p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="block text-xs font-black uppercase tracking-wide text-slate-400">Product Image</span>
                    <p className="mt-1 text-sm font-semibold text-slate-600">Existing selected image is shown below. Upload a new image only if you want to change it.</p>
                    <p className="mt-1 text-xs font-bold text-amber-700">{PRODUCT_IMAGE_HELP}</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-amber-600 transition-colors">
                    <UploadCloud size={17} /> Choose Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => uploadProductImage(e.target.files?.[0])}
                    />
                  </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                  <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-white p-3">
                    {editingProduct.image_url ? (
                      <img
                        src={getPublicAssetPath(editingProduct.image_url)}
                        alt={editingProduct.name || "Selected product"}
                        className="max-h-44 w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="mx-auto mb-2" size={34} />
                        <p className="text-sm font-bold">No image selected</p>
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Selected Image URL</span>
                    <input value={editingProduct.image_url || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} placeholder="Upload from dialog box or paste /product-flynfit.jpg or https://..." className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                    <p className="mt-2 text-xs text-slate-500">Use the button to select an image from your computer. You may also paste an existing public image path/URL manually.</p>
                  </label>
                </div>
              </div>
              <RichTextEditor
                label="Short Description"
                value={editingProduct.description || ""}
                onChange={(value) => setEditingProduct({ ...editingProduct, description: value })}
              />

              <RichTextEditor
                label="Product Detail Page Content"
                value={editingProduct.detail || ""}
                onChange={(value) => setEditingProduct({ ...editingProduct, detail: value })}
              />

              <RichTextEditor
                label="Features"
                value={Array.isArray(editingProduct.features) ? editingProduct.features.join("<br>") : editingProduct.features || ""}
                onChange={(value) => setEditingProduct({ ...editingProduct, features: value.split(/<br>|<div>|<\/div>|\n/).map(v => v.replace(/<[^>]*>/g, '').trim()).filter(Boolean) })}
              />

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Multiple Product Images</span>
                    <p className="text-sm font-semibold text-slate-600">Upload extra product photos using the dialog box. They will appear in the product gallery.</p>
                    <p className="mt-1 text-xs font-bold text-amber-700">Recommended size: 1200 x 1200 px square, under 2 MB each. Supported: JPG, PNG, WEBP.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-amber-600 transition-colors">
                    <UploadCloud size={17} /> Add Gallery Images
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => uploadGalleryImages(e.target.files)}
                    />
                  </label>
                </div>

                {(editingProduct.gallery_images || []).length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {(editingProduct.gallery_images || []).map((imageUrl, index) => (
                      <div key={`${imageUrl}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50 p-2">
                          <img src={getPublicAssetPath(imageUrl)} alt={`Gallery image ${index + 1}`} className="max-h-28 w-full object-contain" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="mt-3 w-full rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100"
                        >
                          Remove Image
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-bold text-slate-400">
                    No gallery images added yet. Click “Add Gallery Images” to upload multiple images.
                  </div>
                )}
              </div>

              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Multiple Sections JSON</span>
                <textarea
                  value={JSON.stringify(editingProduct.detail_sections || [], null, 2)}
                  onChange={(e) => {
                    try {
                      setEditingProduct({ ...editingProduct, detail_sections: JSON.parse(e.target.value) });
                    } catch {}
                  }}
                  rows={8}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </label>
              <div className="mt-4 flex items-center gap-6">
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Sort Order</span>
                  <input type="number" value={editingProduct.sort_order || 99} onChange={(e) => setEditingProduct({ ...editingProduct, sort_order: Number(e.target.value) })} className="w-28 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400" />
                </label>
                <label className="mt-5 inline-flex cursor-pointer items-center gap-2 font-bold text-sm">
                  <input type="checkbox" checked={editingProduct.is_active} onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} className="h-4 w-4 rounded" />
                  Show product on website
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-500 transition-colors">
                  <Save size={17} /> {editingProduct.id ? "Save Product" : "Add Product"}
                </button>
                <button type="button" onClick={closeProductEditor} className="rounded-2xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                {editingProduct.id && (
                  <button type="button" onClick={() => deleteProduct(editingProduct.id)} className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-6 py-3 font-black text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 size={17} /> Delete Product
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-center rounded-3xl bg-white ring-1 ring-yellow-100 min-h-[300px]">
              <div className="text-center">
                <p className="font-bold text-slate-400">Select a product to edit</p>
                <p className="mt-1 text-sm text-slate-300">or click + to add a new one</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STATS TAB ── */}
      {activeTab === "Stats" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-yellow-100">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black">Homepage Stats</h2>
              <button onClick={() => setEditingStat({ ...emptyStat })} className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white hover:bg-amber-600 transition-colors">
                <Plus size={17} />
              </button>
            </div>
            <div className="grid gap-3">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between rounded-2xl border border-yellow-100 bg-yellow-50/30 p-4">
                  <div>
                    <p className="text-2xl font-black text-amber-700">{stat.value}</p>
                    <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingStat(stat)} className="rounded-xl bg-yellow-100 p-2.5 text-amber-800 hover:bg-yellow-200 transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => deleteStat(stat.id)} className="rounded-xl bg-red-50 p-2.5 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {stats.length === 0 && <p className="text-slate-400 text-sm">No stats yet. Click + to add one.</p>}
            </div>
          </div>

          {editingStat && (
            <form onSubmit={saveStat} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-yellow-100 h-fit">
              <h2 className="mb-5 text-xl font-black">{editingStat.id ? "Edit Stat" : "Add New Stat"}</h2>
              <label className="mb-4 block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Value (e.g. 5000+)</span>
                <input required value={editingStat.value} onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })} placeholder="5000+" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </label>
              <label className="mb-4 block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Label</span>
                <input required value={editingStat.label} onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })} placeholder="Daily Pair Capacity" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </label>
              <label className="mb-5 block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">Sort Order</span>
                <input type="number" value={editingStat.sort_order || 99} onChange={(e) => setEditingStat({ ...editingStat, sort_order: Number(e.target.value) })} className="w-28 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-amber-400" />
              </label>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-500 transition-colors">
                  <Check size={17} /> Save Stat
                </button>
                <button type="button" onClick={() => setEditingStat(null)} className="rounded-2xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── ENQUIRIES TAB ── */}
      {activeTab === "Enquiries" && (
        <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-yellow-100">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black">Latest Enquiries</h2>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-800">{inquiries.length} total</span>
          </div>
          {inquiries.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="mx-auto mb-3 text-slate-200" size={40} />
              <p className="font-bold text-slate-400">No enquiries yet.</p>
              <p className="mt-1 text-sm text-slate-300">Submissions from the contact form will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {inquiries.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-slate-950">{item.name}</h3>
                      {item.company && <p className="mt-0.5 text-sm font-bold text-slate-500 flex items-center gap-1"><Building2 size={13} /> {item.company}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{item.interest}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Mail size={13} /> {item.email}</span>
                    <span className="flex items-center gap-1.5"><Phone size={13} /> {item.phone}</span>
                  </div>
                  <p className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-700 ring-1 ring-slate-100">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function AdminShell({ children }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}
