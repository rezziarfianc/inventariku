import { Button, ButtonGroup } from "@heroui/react";
import moment from "moment";
import { useState, useEffect } from "react";

interface DateFilterProps {
    onPress: (date: object) => void
}

export default function DateFilter({ onPress }: DateFilterProps) {
    const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month' | null>('week');

    useEffect(() => {
        handleFilter('week');
    }, []);

    const handleFilter = (type: 'today' | 'week' | 'month') => {
        setActiveFilter(type);
        let startDate, endDate;

        if (type === 'today') {
            startDate = moment().startOf('day').utc().format();
            endDate = moment().endOf('day').utc().format();
        } else if (type === 'week') {
            startDate = moment().startOf('week').utc().format();
            endDate = moment().endOf('week').utc().format();
        } else {
            startDate = moment().startOf('month').utc().format();
            endDate = moment().endOf('month').utc().format();
        }

        onPress({ startDate, endDate });
    }

    const getButtonProps = (type: 'today' | 'week' | 'month') => {
        const isActive = activeFilter === type;
        return {
            color: isActive ? "primary" : "default" as "primary" | "default",
            variant: isActive ? "solid" : "flat" as "solid" | "flat"
        };
    };

    return (
        <div className="bg-white h-fit p-1 rounded-lg border border-slate-200 flex shadow-sm gap-1" key='date-filter'>
            <Button onPress={() => handleFilter('today')} size="sm" {...getButtonProps('today')} key='today'>Today</Button>
            <Button onPress={() => handleFilter('week')} size="sm" {...getButtonProps('week')} key='week'>Week</Button>
            <Button onPress={() => handleFilter('month')} size="sm" {...getButtonProps('month')} key='month'>Month</Button>
        </div>
    );
}