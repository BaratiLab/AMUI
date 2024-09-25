/**
 * _hooks.ts
 * Component hooks for Auth0 related behaviors.
 */

// Node Modules
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

/**
 * @description Retrieves access token for Auth0 and sets to redux state.
 * @param scope 
 */
export const useToken = (scope: string = "read:build_profile") => {

  // Hooks
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.AUTH0_API_IDENTIFIER,
            scope,
          }
        });

        // Sets Auth0 token to session storage to reference without redux.
        sessionStorage.setItem('token', token);
      } catch (error) {
        console.log(error);
      }
    }

    if (isAuthenticated) {
      // Only attempts to retrieve authentication token if autheticated.
      getAccessToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);
};
