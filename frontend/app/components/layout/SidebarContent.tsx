import {
    Listbox,
    ListboxItem,
} from "@heroui/react";
import {
    LayoutDashboard,
    Users,
    Box,
    ArrowUpDown,
    Package,
    Boxes
} from "lucide-react";
import { useLocation } from "react-router";
import { useAuth } from "~/context/authContext";


const activeStyle = "rounded-xl bg-primary/10 text-primary font-semibold";
const inactiveStyle = "text-default-500 hover:text-primary hover:bg-primary/5 rounded-medium transition-colors";

export default function SidebarContent() {
    const location = useLocation();
    const { user } = useAuth();

    const navigationItems = [
        {
            key: "/dashboard",
            title: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            isVisible: user?.can?.dashboard?.includes('view'),
        },
        {
            key: "/users",
            title: "Users",
            icon: <Users size={20} />,
            isVisible: user?.can?.users?.includes('view'),
        },
        {
            key: "/categories",
            title: "Categories",
            icon: <Boxes size={20} />,
            isVisible: user?.can?.categories?.includes('view'),
        },
        {
            key: "/products",
            title: "Products",
            icon: <Package size={20} />,
            isVisible: user?.can?.products?.includes('view'),
        },
        {
            key: "/stock",
            title: "Stock Flow",
            icon: <ArrowUpDown size={20} />,
            isVisible: user?.can?.supplies?.includes('view'),
        },
    ];

    const visibleItems = navigationItems.filter(item => item.isVisible);

    return (
        <div className="h-full flex flex-col justify-between bg-background">
            <div className="flex-1">
                {/* Logo */}
                <div className="flex items-center text-center gap-3 px-6 py-3 border-b border-default-200">
                    <div className="bg-primary/10 p-1 rounded-small"><Box size={32} className="text-primary" /></div>
                    <span className="text-center text-xl font-bold tracking-tight text-primary">Inventariku</span>
                </div>

                {/* Navigation Menu */}
                <div className="px-3">
                    <Listbox
                        aria-label="Navigation"
                        variant="flat"
                        classNames={{
                            list: "gap-2" // Adds spacing between items
                        }}
                        selectionMode="single"
                        selectedKeys={[location.pathname]}
                    >
                        {visibleItems.map((item) => (
                            <ListboxItem
                                href={item.key}
                                key={item.key}
                                startContent={item.icon}
                                className={location.pathname === item.key ? activeStyle : inactiveStyle}
                                textValue={item.title}
                                hideSelectedIcon
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