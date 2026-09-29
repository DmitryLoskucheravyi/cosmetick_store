// Product images come from two sources: files uploaded through the admin
// panel (stored as a local /uploads/... path that the dev/prod proxy serves
// under /api) and seeded stock photos (already-absolute URLs). Route each
// through the right prefix instead of assuming one or the other.
export const resolveImageUrl = (path, fallback = null) => {
    if (!path) return fallback;
    return /^https?:\/\//i.test(path) ? path : `/api${path}`;
};
