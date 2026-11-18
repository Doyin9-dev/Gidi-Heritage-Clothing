import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bodoni-moda/wght.css';
import '@fontsource-variable/bodoni-moda/wght-italic.css';
import '@fontsource-variable/dm-sans/wght.css';
import { App } from './App.jsx';
import { uploadedMedia } from './media.js';
import './styles.css';

const logo = uploadedMedia('logo');
if (logo) {
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = logo;
  document.head.append(icon);
}

createRoot(document.getElementById('root')).render(<App />);
