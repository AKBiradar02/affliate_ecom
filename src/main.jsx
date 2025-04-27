import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error handler for React 18
const rootElement = document.getElementById('root');

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('Rendering error:', error);
  rootElement.innerHTML = `
    <div style="color: red; padding: 20px;">
      <h1>Application Error</h1>
      <pre>${error.message}</pre>
      <pre>${error.stack}</pre>
    </div>
  `;
}
