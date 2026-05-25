function defaultCityHomePath(defaultCitySlug) {
  const slug = defaultCitySlug.trim() || "ulan-ude";
  return `/${slug}`;
}
function sanitizeAuthRedirectPath(path, defaultCitySlug) {
  const fallback = defaultCityHomePath(defaultCitySlug);
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  if (path.includes("/cart") || path.includes("/checkout") || path.includes("/bonuses")) {
    return fallback;
  }
  return path;
}

export { sanitizeAuthRedirectPath as s };
