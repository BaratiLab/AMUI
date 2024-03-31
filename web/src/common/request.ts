/**
 * request.ts
 * Small wrapper for fetch function.
 */

/**
 * @description Wraps fetch request with Auth0 token.
 * @param route
 * @param method
 * @param body
 * @returns
 */
export const request = (
  route: string,
  method?: string,
  body?: object,
): Promise<Response> => {
  const headers = {
    "Content-Type": "application/json",
  };

  return fetch(`${process.env.API_DOMAIN}/${route}`, {
    headers,
    method: method || "GET",
    body: body ? JSON.stringify(body) : undefined,
  });
};
