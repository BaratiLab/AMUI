/**
 * request.ts
 * Small wrapper for fetch function.
 */

const csrfToken = localStorage.getItem('csrfToken');

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
    "X-CSRFToken": String(csrfToken),
  };

  return fetch(`${process.env.API_DOMAIN}/${route}`, {
    headers,
    method: method || "GET",
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });
};
