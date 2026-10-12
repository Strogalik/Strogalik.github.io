// Defense in depth; the review launcher also binds only to the loopback interface.
export function allowDesignReview(flag: string | undefined, host: string | null, forwardedHost: string | null) {
  const loopback = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i;
  return flag === '1' && !!host && loopback.test(host) && (!forwardedHost || loopback.test(forwardedHost));
}
