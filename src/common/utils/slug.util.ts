/**
 * Sanitizes a string into a valid slug for subdomains.
 * - Lowercases the string
 * - Replaces dots with hyphens
 * - Removes non-alphanumeric characters (except hyphens)
 * - Replaces multiple hyphens with a single one
 * - Trims hyphens from start and end
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\./g, '-') // Replace dots with hyphens
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}
