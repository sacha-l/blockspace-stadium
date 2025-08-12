import crypto from 'crypto';

// Slugify arbitrary text to lowercase kebab-case
export const generateSlug = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Create a short hex string; default ~6 chars (3 bytes)
export const generateShortRandom = (numBytes = 3) => crypto.randomBytes(numBytes).toString('hex');

// General-purpose ID generator for projects, team members, etc.
// Usage: generateId('Project Name'), generateId('Alice', { randomBytes: 4 })
export const generateId = (text, options = {}) => {
  const { randomBytes = 3, slugify = true } = options;
  const base = slugify ? (generateSlug(text) || generateShortRandom(6)) : (text || generateShortRandom(6));
  return `${base}-${generateShortRandom(randomBytes)}`;
};