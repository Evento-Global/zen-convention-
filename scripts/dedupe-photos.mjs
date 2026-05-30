#!/usr/bin/env node
/**
 * Deduplicate images across /photos and the staged "Duplicates Evento" folder.
 *
 * Strategy:
 *  1. SHA-256 every JPEG/PNG/WebP under both roots.
 *  2. Group by hash; for groups with 2+ files, keep the FIRST kept file
 *     (preferring an existing /photos copy, then shortest path).
 *  3. Delete every other duplicate, plus any file inside "Duplicates Evento"
 *     whose hash is already represented under /photos (so the staging folder
 *     gets cleaned even if there's only one copy in /photos).
 *  4. If the staging folder ends up empty, remove it.
 *
 * Pass --dry to preview without deleting.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat, unlink, rmdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PHOTOS_DIR = path.join(ROOT, 'photos');
const STAGING_DIR = path.join(ROOT, 'Duplicates Evento ');

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const DRY = process.argv.includes('--dry');

async function walkImages(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...(await walkImages(full)));
    } else if (ent.isFile() && IMAGE_EXT.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

async function sha256(filePath) {
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

function inPhotos(p) {
  return p.startsWith(PHOTOS_DIR + path.sep);
}

function inStaging(p) {
  return p.startsWith(STAGING_DIR + path.sep) || p === STAGING_DIR;
}

function chooseKeeper(paths) {
  const sorted = [...paths].sort((a, b) => {
    const ap = inPhotos(a) ? 0 : 1;
    const bp = inPhotos(b) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  });
  return sorted[0];
}

async function safeUnlink(file) {
  if (DRY) return;
  await unlink(file);
}

async function main() {
  const targets = [
    ...(await walkImages(PHOTOS_DIR)),
    ...(await walkImages(STAGING_DIR)),
  ];

  console.log(`[dedupe] scanning ${targets.length} images (dry=${DRY})`);

  /** @type {Map<string, string[]>} */
  const byHash = new Map();
  for (const file of targets) {
    try {
      const h = await sha256(file);
      const arr = byHash.get(h) ?? [];
      arr.push(file);
      byHash.set(h, arr);
    } catch (err) {
      console.warn(`[dedupe] skip ${file}: ${err.message}`);
    }
  }

  let removedDups = 0;
  let removedStagingClones = 0;

  for (const [hash, files] of byHash.entries()) {
    if (files.length === 1) {
      const only = files[0];
      if (inStaging(only)) {
        await safeUnlink(only);
        removedStagingClones += 1;
        console.log(`[stage-only] - ${path.relative(ROOT, only)}  (hash ${hash.slice(0, 10)}…)`);
      }
      continue;
    }

    const keeper = chooseKeeper(files);
    for (const f of files) {
      if (f === keeper) continue;
      await safeUnlink(f);
      if (inStaging(f)) removedStagingClones += 1;
      else removedDups += 1;
      console.log(`[dup] - ${path.relative(ROOT, f)}  (keeping ${path.relative(ROOT, keeper)})`);
    }
  }

  if (!DRY) {
    try {
      const left = await readdir(STAGING_DIR);
      const onlyJunk = left.filter((n) => !/^\.DS_Store$/i.test(n));
      if (onlyJunk.length === 0) {
        for (const n of left) {
          await unlink(path.join(STAGING_DIR, n)).catch(() => {});
        }
        await rmdir(STAGING_DIR).catch(() => {});
        console.log(`[dedupe] removed empty staging folder`);
      } else {
        console.log(`[dedupe] kept staging (${onlyJunk.length} unique files remain)`);
      }
    } catch {
      // Folder may not exist; ignore.
    }
  }

  console.log(
    `[dedupe] done. removed ${removedDups} duplicates from /photos, ${removedStagingClones} clones from staging.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
