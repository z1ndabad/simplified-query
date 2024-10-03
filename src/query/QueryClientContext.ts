import { createContext } from "react";
import { QueryClient } from "./QueryClient";

export const QueryClientContext = createContext<QueryClient | null>(null);
