import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    route("/", "routes/dashboard.tsx", [
        index("routes/dashboard/index.tsx")
    ]),
    route("login", "routes/login.tsx"),
] satisfies RouteConfig;
