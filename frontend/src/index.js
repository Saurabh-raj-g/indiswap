import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store.js";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import "font-awesome/css/font-awesome.css";
import "bootstrap-social/bootstrap-social.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
  transition: transitions.SCALE,
};
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>
);
//npm i prettier eslint-config-prettier eslint-plugin-prettier axios react-alert react-alert-template-basic react-helmet react-icons react-redux react-router-dom reactstrap redux redux-devtools-extension redux-thunk webfontloader -D --force
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//  with react 17.0.2

// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";
// import { Provider } from "react-redux";
// import store from "./store.js";
// import { positions, transitions, Provider as AlertProvider } from "react-alert";
// import AlertTemplate from "react-alert-template-basic";

// import "font-awesome/css/font-awesome.css";
// import "bootstrap-social/bootstrap-social.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.css";

// const options = {
//   timeout: 5000,
//   position: positions.TOP_RIGHT,
//   transition: transitions.SCALE,
// };
// // "material-ui": "^0.20.2",
// //"@material-ui/icons": "^4.11.3",
// //const root = ReactDOM.createRoot(document.getElementById("root"));
// //const root = ReactDOM.render(document.getElementById("root"));
// ReactDOM.render(
//   <Provider store={store}>
//     <AlertProvider template={AlertTemplate} {...options}>
//       <App />
//     </AlertProvider>
//   </Provider>,
//   document.getElementById("root")
//   // <React.StrictMode>
//   //   <App />
//   // </React.StrictMode>
// );
// //npm i prettier eslint-config-prettier eslint-plugin-prettier axios react-alert react-alert-template-basic react-helmet react-icons react-redux react-router-dom reactstrap redux redux-devtools-extension redux-thunk webfontloader -D --force
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
