import { fallbackProducts, fallbackSettings, fallbackStats } from "./fallbackData";
import { hasSupabase, supabase } from "./supabaseClient";

export async function getSettings() {
  if (!hasSupabase) return fallbackSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return fallbackSettings;
  return { ...fallbackSettings, ...data };
}

export async function getStats() {
  if (!hasSupabase) return fallbackStats;

  const { data, error } = await supabase
    .from("home_stats")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackStats;

  return data.map((item) => ({
    id: item.id,
    value: item.value,
    label: item.label,
    sort_order: item.sort_order,
    is_active: item.is_active,
  }));
}

export async function getProducts({ includeInactive = false } = {}) {
  if (!hasSupabase) return fallbackProducts;

  let query = supabase.from("products").select("*").order("sort_order", { ascending: true });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) return fallbackProducts;
  return data;
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}
