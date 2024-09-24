/**
 * index.tsx
 * Main entryfile for react bundle.
 */

// Node Modules
import { Auth0Provider } from "@auth0/auth0-react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// Components
import App from "App";

// Store
import store from "store";

const root = createRoot(document.getElementById("app-root") as Element);

root.render(
  <Auth0Provider
    domain={process.env.AUTH0_DOMAIN as string}
    clientId={process.env.AUTH0_CLIENT_ID as string}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: process.env.AUTH0_API_IDENTIFIER,
      scope: "read:projects"
    }}
  >
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Auth0Provider>
);
