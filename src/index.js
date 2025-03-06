import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { bootstrapCustomTheme, addGoogleFonts } from "./bootstrap-theme";

// Adicionar o tema personalizado do Bootstrap
const style = document.createElement("style");
style.innerHTML = bootstrapCustomTheme;
document.head.appendChild(style);

// Adicionar a fonte Poppins
addGoogleFonts();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
