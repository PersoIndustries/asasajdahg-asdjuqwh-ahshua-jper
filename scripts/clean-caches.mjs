#!/usr/bin/env node
// Limpia cachés y artefactos de build (Vite, TanStack Start, Nitro)
// para evitar que un build de producción reutilice salidas obsoletas.
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()

const targets = [
  'node_modules/.vite',
  'node_modules/.cache',
  'node_modules/.tanstack',
  'node_modules/.nitro',
  '.nitro',
  '.output',
  '.tanstack',
  '.vite',
  'dist',
]

const removed = []

await Promise.all(
  targets.map(async (target) => {
    const path = resolve(root, target)
    try {
      await rm(path, { recursive: true, force: true })
      removed.push(target)
    } catch (error) {
      console.warn(`[clean] no se pudo borrar ${target}:`, error.message)
    }
  }),
)

console.log(`[clean] cachés limpiadas: ${removed.join(', ')}`)
