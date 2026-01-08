import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    route("/", "routes/Dashboard.tsx", [
        index("routes/dashboard/Index.tsx"),
        route("dashboard", "routes/dashboard/Dashboard.tsx"),
        route("users", "routes/dashboard/Users.tsx"),
        route("items", "routes/dashboard/Products.tsx"),
        route("categories", "routes/dashboard/Categories.tsx"),
        route("stock", "routes/dashboard/Stocks.tsx"),
        // route("usersv2", "routes/dashboard/Usersv2.tsx"),
        // route("categoriesv2", "routes/dashboard/Categoriesv2.tsx"),
        // route("productsv2", "routes/dashboard/Productsv2.tsx"),
        // route("stocksv2", "routes/dashboard/Stocksv2.tsx")
    ]),
    route("login", "routes/Login.tsx"),
] satisfies RouteConfig;
