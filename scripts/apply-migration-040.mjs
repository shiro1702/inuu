#!/usr/bin/env node
/**
 * Migration 040: city_web_sources.display_name
 * Paste output into Supabase Dashboard → SQL Editor → Run.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sql = readFileSync(join(root, 'supabase/migrations/040_city_web_sources_display_name.sql'), 'utf8')

console.log('Migration 040 — run in Supabase SQL Editor:\n')
console.log(sql.trim())
console.log('\nAfter apply: saved display names persist; until then the API works with displayName always null.')
