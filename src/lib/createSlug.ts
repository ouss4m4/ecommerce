export const createSlug = (str: string) => {
  return str
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize the string
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
};
