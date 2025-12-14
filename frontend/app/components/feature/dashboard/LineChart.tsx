import { Card, CardBody, CardHeader } from "@heroui/react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendData } from "~/types/analytic";
import colors from 'tailwindcss/colors';

interface LineChartProps {
    data: TrendData[] | null
}

interface LineData {
    name: string;
    inbound: number;
    outbound: number;
    amt: number;
}

export default function LineChart({ data }: LineChartProps) {

    let chartData: LineData[] = [];
    data?.forEach((item) => {
        chartData.push({
            name: item.date,
            inbound: item.inbound,
            outbound: item.outbound,
            amt: item.transactions
        });
    });

    return (
        <ResponsiveContainer width="100%" height="90%">
            <ReLineChart
                data={chartData}
                responsive
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="inbound" stroke="#4ade80" />
                <Line type="monotone" dataKey="outbound" stroke="#f87171" />
            </ReLineChart>
        </ResponsiveContainer>
    );
} 