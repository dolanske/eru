export function stringifyQuery(query: any): string {
  if (!query)
    return ''

  const searchParams = Object.keys(query)
    .map(k => [k, query[k]].map(encodeURIComponent).join('='))
    .join('&')
  return searchParams ? `?${searchParams}` : ''
}

export function isObject(val: any) {
  return typeof val === 'function' || typeof val === 'object' && !!val
}