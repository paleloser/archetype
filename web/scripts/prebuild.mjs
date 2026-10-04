// Copies every .mdx file under content/ to public/raw/, so the raw markdown of any page is served as-is
// (e.g. /raw/blog/en/<slug>.mdx). Agents and skills read pages from there instead of scraping HTML.
import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const RAW_DIR = path.join(process.cwd(), 'public', 'raw')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return entry.name.endsWith('.mdx') ? [ fullPath ] : []
  })
}

fs.rmSync(RAW_DIR, { recursive: true, force: true })

const files = walk(CONTENT_DIR)
for (const file of files) {
  const destination = path.join(RAW_DIR, path.relative(CONTENT_DIR, file))
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(file, destination)
}

console.log(`Copied ${files.length} .mdx files to public/raw/`)
