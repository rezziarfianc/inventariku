import { Outlet } from "react-router";
import type { Route } from "./+types/Dashboard";
import React from "react";
import { useDisclosure } from "@heroui/react";
import Navbar from "~/components/layout/Navbar";
import Sidebar from "~/components/layout/Sidebar";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard - Inventariku" }
    ];
}

import ProtectedRoute from "~/components/auth/ProtectedRoute";

export default function Dashboard() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-background max-h-screen">
                <Sidebar isOpen={isOpen} onOpenChange={onOpenChange} />
                <div className="flex flex-col flex-1 w-full">
                    <Navbar onOpen={onOpen} />

                    <main className="flex-1 p-6 bg-default/15 overflow-hidden">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}