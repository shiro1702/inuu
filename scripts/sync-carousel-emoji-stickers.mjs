#!/usr/bin/env node
/**
 * Sync carousel emoji stickers — Fluent Emoji 3D PNG (MIT).
 * Source: https://github.com/microsoft/fluentui-emoji
 *
 * Usage: npm run sync:carousel-emoji-stickers
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const catalogPath = path.join(__dirname, 'carousel-emoji-catalog.json')
const outDir = path.join(root, 'public/carousel-stickers/emoji')
const CDN = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets'

function folderToFileName(folder) {
  return `${folder.toLowerCase().replace(/\s+/g, '_')}_3d.png`
}

function assetUrl(folder) {
  const file = folderToFileName(folder)
  return `${CDN}/${encodeURIComponent(folder).replace(/%20/g, '%20')}/3D/${file}`
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  fs.mkdirSync(outDir, { recursive: true })

  let ok = 0
  for (const item of catalog) {
    const url = assetUrl(item.fluent_folder)
    const dest = path.join(outDir, `${item.slug}.png`)
    try {
      await download(url, dest)
      ok++
      console.log(`  ✓ ${item.slug}`)
    } catch (err) {
      console.error(`  ✗ ${item.slug}: ${err.message}`)
      console.error(`    ${url}`)
      process.exit(1)
    }
  }

  console.log(`Synced ${ok} emoji PNGs to public/carousel-stickers/emoji/ (Fluent Emoji MIT)`)
}

main()
