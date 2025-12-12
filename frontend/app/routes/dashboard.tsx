import { Outlet } from "react-router";
import type { Route } from "./+types/dashboard";
import React from "react";
import { useDisclosure } from "@heroui/react";
import Navbar from "~/components/layout/navbar";
import Sidebar from "~/components/layout/sidebar";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard - Inventariku" }
    ];
}

export default function Dashboard() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isOpen={isOpen} onOpenChange={onOpenChange} />

            <div className="flex flex-col flex-1 w-full">
                <Navbar onOpen={onOpen} />
                
                <main className="flex-1 p-6  bg-default overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}