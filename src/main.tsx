import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { GridPattern } from "./components/ui/shadcn-io/grid-pattern/index.tsx";
import { cn } from "./lib/utils.ts";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <div className="relative overflow-hidden">
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "opacity-40 fixed h-screen",
                    "[mask-image:radial-gradient(800px_circle_at_center,white,transparent) ]"
                )}
            />
            <App />
        </div>
    </BrowserRouter>
);
