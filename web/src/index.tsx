/**
 * index.tsx
 * Main entryfile for react bundle.
 */

// Node Modules
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Components
import App from 'App';

// Store
import store from 'store';

const root = createRoot(document.getElementById('app-root') as Element);

root.render(
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
);
