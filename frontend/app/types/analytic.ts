export interface Summary {
    total_inbound: number;
    total_outbound: number;
    total_transactions: number;
    avg_inbound_per_day: number;
    avg_outbound_per_day: number;
    avg_transactions_per_day: number;
}

export interface TrendData {
    date: string;
    inbound: number;
    outbound: number;
    transactions: number;
}

export interface TopProduct {
    product_name: string;
    total_moved: string; // API returns string from SUM
    total_moved_outbound: string;
    total_moved_inbound: string;
    avg_outbound: string;
    avg_inbound: string;
    transaction_count: number;
}

export interface Period {
    start: string;
    end: string;
    days: number;
}

export interface Analytics {
    summary: Summary;
    trends: TrendData[];
    top_products: TopProduct[];
    period: Period;
}

export interface AnalyticsParams {
    start_date: string | null;
    end_date: string | null;
}