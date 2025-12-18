"use client";
import { useEffect, useState } from "react";
import type { Route } from "./+types/Dashboard";
import { useAnalytic } from "~/hooks/useAnalytic";
import LineChart from "~/components/feature/dashboard/LineChart";
import DateFilter from "~/components/feature/dashboard/DateFilter";
import DashboardStats from "~/components/feature/dashboard/DashboardStats";
import TopProducts from "~/components/feature/dashboard/TopProducts";
import TransactionTable from "~/components/feature/dashboard/TransactionTable";

import { Card, Spinner } from "@heroui/react";

import moment from "moment";
import { useAuth } from "~/contexts/authContext";
import { useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard - Inventariku" }
    ];
}

export default function Dashboard() {

    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user && !user.can?.dashboard?.includes('view')) {
            navigate("/");
        }
    }, [user, navigate, authLoading]);

    if (authLoading || (user && !user.can?.dashboard?.includes('view'))) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    const { isLoading, error, analytics, setFilter, fetchAnalytics, trendData } = useAnalytic();
    const [currentFilter, setCurrentFilter] = useState<Record<string, any> | null>(null);

    // Sync filters
    const handleFilterChange = (date: any) => {
        const newFilter: Record<string, any> = {
            start_date: date?.startDate ? moment(date.startDate).toISOString() : null,
            end_date: date?.endDate ? moment(date.endDate).toISOString() : null
        };

        setFilter(newFilter);
        setCurrentFilter(newFilter);
    };



    return (
        <div className="p-4 flex flex-col gap-6 h-full overflow-y-auto">
            <div className="row flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <div className="flex flex-col w-auto mb-4 md:mb-0">
                    <h1 className="text-2xl font-bold">Overview</h1>
                </div>
                <div className="flex flex-row gap-4">
                    <DateFilter onPress={handleFilterChange} />
                </div>
            </div>

            {error ? (
                <div className="p-4 text-red-500">Error: {error}</div>
            ) : (
                <>
                    <DashboardStats summary={analytics?.summary || null} isLoading={isLoading} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <h2 className="text-xl font-bold px-2">Transactions Trend</h2>
                            <Card className="p-4 min-h-100">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <LineChart data={trendData} />
                                )}
                            </Card>
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            <h2 className="text-xl font-bold px-2">Top 5 Products</h2>
                            <Card className="p-4 h-full">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <TopProducts products={analytics?.top_products} />
                                )}
                            </Card>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <h2 className="text-xl font-bold px-2">Transactions</h2>
                        <Card className="p-4">
                            <TransactionTable filter={currentFilter} />
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}