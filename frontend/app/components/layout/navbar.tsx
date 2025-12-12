import React from "react";
import {
    Navbar as HeroNavbar,
    NavbarContent,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User,
    Button,
    NavbarItem,
} from "@heroui/react";
import { Menu } from "lucide-react";

interface NavbarProps {
    onOpen: () => void;
}

export default function Navbar({ onOpen }: NavbarProps) {
    return (
        <HeroNavbar
            isBordered
            maxWidth="full"
            className="bg-background/70 backdrop-blur-md"
            classNames={{
                wrapper: "px-4 sm:px-6",
            }}
        >
            <NavbarContent justify="start" className="md:hidden">
                <NavbarItem>
                    <Button isIconOnly variant="light" onPress={onOpen}>
                        <Menu size={24} />
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <User
                            name="admin"
                            description="Admin"
                            avatarProps={{
                                isBordered: true,
                                size: "sm",
                                name: "admin",
                                className: "bg-primary/10 text-primary"
                            }}
                            classNames={{
                                base: "cursor-pointer flex",
                                name: "text-sm font-semibold hidden md:flex",
                                description: "text-xs hidden md:flex"
                            }}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2 md:hidden">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">Admin@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </HeroNavbar>
    );
}