import type { Route } from "./+types/index";
import React from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard - Inventariku" }
    ];
}


export default function Index() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to your dashboard!</p>
        </div>
    );
}