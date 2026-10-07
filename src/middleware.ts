import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const lowerPath = url.pathname.toLowerCase();

  if (url.pathname !== lowerPath) {
    url.pathname = lowerPath;
    url.protocol = 'https:';
    url.host = 'www.splashnewswire.com';
    return context.redirect(url.toString(), 301);
  }

  return next();
});
