const sep = '/'

function normalize(path) {
  if (!path) return '.'

  const isAbsolute = path.startsWith(sep)
  const parts = path.split(sep)

  const stack = []

  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') {
      if (stack.length && stack[stack.length - 1] !== '..') {
        stack.pop()
      } else if (!isAbsolute) {
        stack.push('..')
      }
    } else {
      stack.push(part)
    }
  }

  const result = stack.join(sep)
  return (isAbsolute ? sep : '') + result || (isAbsolute ? sep : '.')
}

function join(...paths) {
  return normalize(paths.filter(Boolean).join(sep))
}

function resolve(...paths) {
  let resolved = ''

  for (let i = paths.length - 1; i >= 0; i--) {
    const path = paths[i]
    if (!path) continue
    resolved = path + sep + resolved
    if (path.startsWith(sep)) break
  }

  return normalize(resolved)
}

function dirname(path) {
  if (!path) return '.'
  const normalized = normalize(path)
  const parts = normalized.split(sep)
  parts.pop()
  return parts.length ? parts.join(sep) : sep
}

function basename(path, ext = '') {
  const parts = normalize(path).split(sep)
  let base = parts.pop()
  if (ext && base.endsWith(ext)) {
    base = base.slice(0, -ext.length)
  }
  return base
}

function extname(path) {
  const base = basename(path)
  const index = base.lastIndexOf('.')
  return index <= 0 ? '' : base.slice(index)
}

export default {
  sep,
  normalize,
  join,
  resolve,
  dirname,
  basename,
  extname
}