export function stringifyQuery(query: any): string {
  if (!query)
    return ''

  const searchParams = Object.keys(query)
    .map(key => {
      // Here we simply add a check for array of values
      let stringified = query[key]
      if (Array.isArray(query[key])) {
        stringified = query[key].join(',')
      }

      return [key, stringified].map(encodeURIComponent).join('=')
    })
    .join('&')
  return searchParams ? `?${searchParams}` : ''
}

export function isObject(val: any) {
  return typeof val === 'function' || typeof val === 'object' && !!val
}