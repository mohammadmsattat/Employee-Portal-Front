import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import RTLWrapper from "./providers/RTLWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <RTLWrapper>
    <App />
  </RTLWrapper>,
);
