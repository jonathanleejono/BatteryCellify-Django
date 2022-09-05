import App from 'App';
import AppProviders from 'app-context/AppProviders';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AppProviders>
    <App />
  </AppProviders>
);
