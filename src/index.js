import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Riterdream from './Riterdream'; // ✅ Updated import
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Riterdream />
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();
reportWebVitals();
