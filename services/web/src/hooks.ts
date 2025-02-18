/**
 * hooks.ts
 * Commonly used hooks throughout the application or parent <App /> component.
 * https://redux.js.org/usage/usage-with-typescript#define-typed-hooks
 */

// Node Modules
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Types
import type { RootState, AppDispatch } from "store";

/**
 * React-Redux
 */

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Auth0
 */

/**
 * @description Retrieves access token for Auth0 and sets to redux state.
 * @param scope 
 */
export const useToken = (scope: string = "read:build_profile") => {

  // Hooks
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.AUTH0_API_IDENTIFIER,
            scope,
          }
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    }

    if (isAuthenticated) {
      // Only attempts to retrieve authentication token if autheticated.
      getAccessToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return [token, setToken];
};

/**
 * Django CSRF
 */

export const useCsrf = () => {
  const getCsrfToken = async () => {
    const response = await fetch('/api/csrf-token/', {
        credentials: 'include',
    });
    const data = await response.json();

    // Setup axios to use CSRF token for future requests
    axios.defaults.headers.common["X-CSRFToken"] = data.csrfToken;
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = "/";

    return data.csrfToken;
  };

  if (typeof window !== 'undefined') {
    // Only run once per app load
    // https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
    getCsrfToken();
  }
};
