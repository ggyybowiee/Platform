platform.hooks.registerHook('request', (url, options) => {
  const newOptions = options ? { ...options } : {};
  if (!newOptions.headers) {
    newOptions.headers = {}
  }

  newOptions.headers.Authorization = platform.services.services.platform.store.get('auth.jwt');
  // 'nizb2D6zB/wPA9xJGciDShsTMX7s662MBZ+6ACo41H9ZZBRfEP58VTMJ/tVPT3Ma';
  return [url, options];
});
