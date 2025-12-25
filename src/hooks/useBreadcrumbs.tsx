import { useLocation, useParams, useSearchParams } from "react-router-dom";

export type Breadcrumb = {
    label: string;
    href?: string;
};

export function useBreadcrumbs(): Breadcrumb[] {
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();

    const path = location.pathname;

    // HOME
    if (path === "/") {
        return [{ label: "Clients" }];
    }

    if (path.startsWith("/client/") && params.id) {
        const name = searchParams.get("name") ?? "Client";

        return [
            { label: "Clients", href: "/" },
            { label: name },
        ];
    }

    return [];
}
