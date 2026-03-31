export async function onRequest(context) {
  const url = new URL(context.request.url)
  const targetUrl = `https://jjrlrufcsbgikxgdktcj.supabase.co${url.pathname}${url.search}`

  const headers = new Headers(context.request.headers)
  headers.delete('cf-connecting-ip')
  headers.delete('cf-ipcountry')
  headers.delete('cf-ray')
  headers.delete('cf-visitor')
  headers.set('origin', 'https://jjrlrufcsbgikxgdktcj.supabase.co')
  headers.set('referer', 'https://jjrlrufcsbgikxgdktcj.supabase.co/')

  let response
  try {
    response = await fetch(targetUrl, {
      method: context.request.method,
      headers: headers,
      body: context.request.body,
      redirect: 'manual',
    })
  } catch (err) {
    return new Response('Backend error', { status: 502 })
  }

  const newHeaders = new Headers(response.headers)
  const location = response.headers.get('location')
  if (location && location.includes('jjrlrufcsbgikxgdktcj.supabase.co')) {
    newHeaders.set('location', location.replace(
      'jjrlrufcsbgikxgdktcj.supabase.co',
      'auth.mt5autotest.com'
    ))
  }

  if (context.request.method === 'OPTIONS') {
    newHeaders.set('access-control-allow-origin', context.request.headers.get('origin') || '*')
    newHeaders.set('access-control-allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    newHeaders.set('access-control-allow-headers', 'Content-Type, Authorization, apikey, X-Client-Info')
    newHeaders.set('access-control-allow-credentials', 'true')
    newHeaders.set('access-control-max-age', '86400')
    return new Response(null, { status: 204, headers: newHeaders })
  }

  newHeaders.set('access-control-allow-origin', context.request.headers.get('origin') || '*')
  newHeaders.set('access-control-allow-credentials', 'true')

  if ([301, 302, 303, 307, 308].includes(response.status)) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    })
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}
