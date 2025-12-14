import type { Summary } from "~/types/analytic";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Card, Skeleton } from "@heroui/react";

interface DashboardStatsProps {
    summary: Summary | null;
    isLoading: boolean;
}

export default function DashboardStats({ summary, isLoading }: DashboardStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="rounded-full w-12 h-12" />
                            <Skeleton className="rounded-full w-20 h-6" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-24 h-4 rounded-lg" />
                            <Skeleton className="w-16 h-8 rounded-lg" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!summary) return null;

    const stats = [
        {
            label: "Total Transactions",
            value: summary.total_transactions,
            subValue: `${summary.avg_transactions_per_day} units average per day`,
            color: "text-primary-500",
            bg: "bg-primary-50",
            icon: ArrowUpDown,
        },
        {
            label: "Total Inbound",
            value: summary.total_inbound,
            subValue: `${summary.avg_inbound_per_day} units average per day`,
            color: "text-success-500",
            bg: "bg-success-50",
            icon: ArrowDown,
        },
        {
            label: "Total Outbound",
            value: summary.total_outbound,
            subValue: `${summary.avg_outbound_per_day} units average per day`,
            color: "text-danger-500",
            bg: "bg-danger-50",
            icon: ArrowUp,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className={`text-sm font-medium ${stat.color} bg-opacity-10 px-2 py-1 rounded-full`}>
                            {stat.subValue}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-default-500 text-sm font-medium uppercase tracking-wider mb-1">{stat.label}</h3>
                        <span className="text-3xl font-bold text-default-900">{stat.value}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
