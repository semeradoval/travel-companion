const BASE = 'http://localhost:3000'

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

export const api = {
  topic: {
    list: (category) => req('GET', category ? `/topic/list?category=${category}` : '/topic/list'),
    get: (id) => req('GET', `/topic/get?id=${id}`),
    create: (body) => req('POST', '/topic/create', body),
    update: (body) => req('POST', '/topic/update', body),
    delete: (id) => req('POST', '/topic/delete', { id }),
  },
  entry: {
    list: (topicId) => req('GET', topicId ? `/entry/list?topicId=${topicId}` : '/entry/list'),
    get: (id) => req('GET', `/entry/get?id=${id}`),
    create: (body) => req('POST', '/entry/create', body),
    update: (body) => req('POST', '/entry/update', body),
    delete: (id) => req('POST', '/entry/delete', { id }),
  },
}
