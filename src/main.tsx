import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { ScrollToTop } from "./components/layout/scroll-top.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ScrollToTop />

        <SidebarProvider>
            <App />
        </SidebarProvider>
    </BrowserRouter>
);

console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);