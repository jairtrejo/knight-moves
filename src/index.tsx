import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

 // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
 // Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
 if (import.meta.hot) {
   import.meta.hot.accept();
 }
