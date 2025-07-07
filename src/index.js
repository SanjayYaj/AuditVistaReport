import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { AuthProvider } from "store/context/AuthContext";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
          // console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
          console.error('Service Worker registration failed:', error);
      });
}

// if (window.location.protocol !== 'https:') {
//   window.location.href = 'https://' + window.location.host + window.location.pathname;
// }


root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter>
        {/* <AuthProvider> */}
          <App />
          {/* </AuthProvider> */}
        </BrowserRouter>
      </React.Fragment>
    </Provider>
);

serviceWorker.unregister()
