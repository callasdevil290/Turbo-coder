/**
 * Path utilities for POSIX-compliant file operations
 * Used across file explorer, terminal, and editor
 */

export function join(...parts: string[]): string {
  return parts
    .filter((p) => p && p !== '.')
    .join('/')
    .replace(/\/+/g, '/');
}

export function dirname(path: string): string {
  const trimmed = path.replace(/\/$/, '');
  const lastSlash = trimmed.lastIndexOf('/');
  if (lastSlash === -1) return '.';
  if (lastSlash === 0) return '/';
  return trimmed.substring(0, lastSlash);
}

export function basename(path: string, ext?: string): string {
  const trimmed = path.replace(/\/$/, '');
  const lastSlash = trimmed.lastIndexOf('/');
  let name = lastSlash === -1 ? trimmed : trimmed.substring(lastSlash + 1);
  
  if (ext && name.endsWith(ext)) {
    name = name.substring(0, name.length - ext.length);
  }
  return name;
}

export function extname(path: string): string {
  const base = basename(path);
  const lastDot = base.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) return '';
  return base.substring(lastDot);
}

export function resolve(...parts: string[]): string {
  let path = '';
  
  for (const part of parts) {
    if (part.startsWith('/')) {
      path = part;
    } else {
      path = path ? join(path, part) : part;
    }
  }
  
  // Remove trailing slashes except for root
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  return path || '/';
}

export function relative(from: string, to: string): string {
  const fromParts = normalize(from).split('/').filter(Boolean);
  const toParts = normalize(to).split('/').filter(Boolean);
  
  let common = 0;
  for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
    if (fromParts[i] === toParts[i]) common++;
    else break;
  }
  
  const up = fromParts.length - common;
  const down = toParts.slice(common);
  
  return [...Array(up).fill('..'), ...down].join('/') || '.';
}

export function normalize(path: string): string {
  const isAbsolutePath = path.startsWith('/');
  const parts = path.split('/').filter(Boolean);
  const result: string[] = [];
  
  for (const part of parts) {
    if (part === '.' || part === '') {
      continue;
    } else if (part === '..') {
      result.pop();
    } else {
      result.push(part);
    }
  }
  
  return (isAbsolutePath ? '/' : '') + result.join('/');
}

export function isAbsolute(path: string): boolean {
  return path.startsWith('/');
}

export function splitPath(path: string): string[] {
  return normalize(path).split('/').filter(Boolean);
}

export function getParentPath(path: string): string {
  return dirname(path);
}

export function getFileNameWithoutExt(path: string): string {
  const base = basename(path);
  return base.substring(0, base.lastIndexOf('.')) || base;
}

export function changeExtension(path: string, newExt: string): string {
  const dir = dirname(path);
  const nameWithoutExt = getFileNameWithoutExt(path);
  const ext = newExt.startsWith('.') ? newExt : `.${newExt}`;
  return join(dir, nameWithoutExt + ext);
}

export function isChildPath(parent: string, child: string): boolean {
  const normalizedParent = normalize(parent);
  const normalizedChild = normalize(child);
  
  if (normalizedParent === normalizedChild) return false;
  
  const parentWithSlash = normalizedParent.endsWith('/')
    ? normalizedParent
    : normalizedParent + '/';
  
  return normalizedChild.startsWith(parentWithSlash);
}
