import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient } from "./query/QueryClient.ts";
import { QueryClientContext } from "./query/QueryClientContext.ts";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientContext.Provider value={client}>
      <App />
    </QueryClientContext.Provider>
  </StrictMode>,
);
