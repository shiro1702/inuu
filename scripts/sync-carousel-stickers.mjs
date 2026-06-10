#!/usr/bin/env node
/**
 * Sync carousel sticker SVGs from Lucide (ISC) — lucide-static package.
 * Icons: transparent background, white stroke, no extra shapes.
 *
 * Usage: npm run sync:carousel-stickers
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const catalogPath = path.join(__dirname, 'carousel-sticker-catalog.json')
const lucideDir = path.join(root, 'node_modules/lucide-static/icons')
const outDir = path.join(root, 'public/carousel-stickers')

const STROKE = '#FFFFFF'
const STROKE_WIDTH = '2.25'

function transformLucideSvg(raw) {
  return raw
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/stroke="currentColor"/g, `stroke="${STROKE}"`)
    .replace(/stroke-width="2"/g, `stroke-width="${STROKE_WIDTH}"`)
    .replace(/width="24"/g, 'width="64"')
    .replace(/height="24"/g, 'height="64"')
}

function main() {
  if (!fs.existsSync(lucideDir)) {
    console.error('Missing lucide-static. Run: npm install')
    process.exit(1)
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  fs.mkdirSync(outDir, { recursive: true })

  let ok = 0
  for (const item of catalog) {
    const srcPath = path.join(lucideDir, `${item.lucide}.svg`)
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing Lucide icon: ${item.lucide}`)
      process.exit(1)
    }
    const raw = fs.readFileSync(srcPath, 'utf8')
    const svg = transformLucideSvg(raw)
    fs.writeFileSync(path.join(outDir, `${item.slug}.svg`), svg)
    ok++
  }

  console.log(`Synced ${ok} stickers to public/carousel-stickers/ (Lucide ISC)`)
}

main()
