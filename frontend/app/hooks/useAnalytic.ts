import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import { getAnalytics } from "~/api/analyticApi";

export function useAnalytic<T>() {
    const [analytics, setAnalytics] = useState<Record<string, any>>({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
    });

    const fetchAnalytics = async () => {
        const response = await getAnalytics();
        setAnalytics(response.data);
    };

    fetchAnalytics();

    return {
        analytics,
        isOpen,
        onOpen,
        onClose,
        fetchAnalytics
    }
}