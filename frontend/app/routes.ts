import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    route("/", "routes/Dashboard.tsx", [
        index("routes/dashboard/Index.tsx"),
        route("dashboard", "routes/dashboard/Dashboard.tsx"),
        route("users", "routes/dashboard/Users.tsx"),
        route("products", "routes/dashboard/Products.tsx"),
        route("categories", "routes/dashboard/Categories.tsx"),
        route("stock", "routes/dashboard/Stock.tsx"),
        route("usersv2", "routes/dashboard/Usersv2.tsx"),
    ]),
    route("login", "routes/Login.tsx"),
] satisfies RouteConfig;
