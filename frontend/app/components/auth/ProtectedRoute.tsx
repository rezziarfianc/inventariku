import React from "react";
import { useAuth } from "~/context/authContext";
import { Spinner } from "@heroui/react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}
