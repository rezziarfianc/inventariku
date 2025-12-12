import {
    Button,
    Listbox,
    ListboxItem,
    User,
} from "@heroui/react";
import {
    LayoutDashboard,
    Settings,
    Users,
    LogOut,
    CreditCard,
    Box
} from "lucide-react";

const navigationItems = [
    {
        key: "dashboard",
        title: "Dashboard",
        icon: <LayoutDashboard size={20} className="text-primary" />,
        active: true,
    },
    {
        key: "team",
        title: "Team Members",
        icon: <Users size={20} className="text-default-500" />,
    },
    {
        key: "billing",
        title: "Billing & Invoices",
        icon: <CreditCard size={20} className="text-default-500" />,
    },
    {
        key: "settings",
        title: "Settings",
        icon: <Settings size={20} className="text-default-500" />,
    },
];

export default function SidebarContent() {
    return (
        <div className="h-full flex flex-col justify-between bg-background">
            <div className="flex-1">
                {/* Logo */}
                <div className="flex items-center text-center gap-3 px-6 py-3 border-b border-default-200">
                    <div className="bg-primary/10 p-1 rounded-small"><Box size={32} className="text-primary" /></div>
                    <span className="text-center text-xl font-bold tracking-tight text-primary/100">Inventariku</span>
                </div>

                {/* Navigation Menu */}
                <div className="px-3">
                    <Listbox
                        aria-label="Navigation"
                        variant="flat"
                        classNames={{
                            list: "gap-2" // Adds spacing between items
                        }}
                    >
                        {navigationItems.map((item) => (
                            <ListboxItem
                                key={item.key}
                                startContent={item.icon}
                                className={item.active ?  "rounded-lg bg-primary/5 text-primary font-semibold" : "rounded-lg"}
                            >
                                {item.title}
                            </ListboxItem>
                        ))}
                    </Listbox>
                </div>
            </div>
            
        </div>
    )
}