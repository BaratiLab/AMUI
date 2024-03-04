/**
 * index.tsx
 * Main entryfile for react bundle.
 */

// Node Modules
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Components
import App from 'App';

// Store
import store from 'store';

// Theme
import { theme } from './theme';

const root = createRoot(document.getElementById('app-root') as Element);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ThemeProvider>
);
