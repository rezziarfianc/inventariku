import { useEffect, useState } from "react";
import { getAnalytics } from "~/api/analyticApi";
import type { Analytics, TrendData } from "~/types/analytic";

export function useAnalytic<T>() {

    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>('');
    const [filter, setFilter] = useState<Record<string, string> | null>(null);
    const [trendData, setTrendData] = useState<TrendData[] | null>(null);


    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getAnalytics(filter);
            setAnalytics(response.data);
            setTrendData(response.data.trends || null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!filter) return;
        fetchAnalytics();
    }, [filter]);

    return {
        isLoading,
        error,
        trendData,
        analytics,
        setFilter,
        fetchAnalytics
    }
}