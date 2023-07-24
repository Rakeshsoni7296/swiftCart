import React from "react";
import ReactDOM from "react-dom/client";
import store from "./Redux/store.js";
import axios from "axios";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";

axios.defaults.baseURL = "http://localhost:4000/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
