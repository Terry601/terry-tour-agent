import { API_BASE } from '../api/http'

export function buildSseUrl(path, params) {
  const url = new URL(API_BASE.replace(/\/$/, '') + path)
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    url.searchParams.set(k, String(v))
  })
  return url.toString()
}

export function createEventSource(url) {
  // withCredentials 默认 false；如果后端需要 cookie 再改为 true
  return new EventSource(url)
}

