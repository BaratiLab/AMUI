/**
 * index.tsx
 * Main entryfile for react bundle.
 */

// Node Modules
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('app-root') as Element);

root.render(
  <div>
    Hello World
  </div>
);
