import React from "react";
import {
    Drawer,
    DrawerContent,
    DrawerBody,
} from "@heroui/react";
import SidebarContent from "./sidebarContent";

interface SidebarProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
    return (
        <>
            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="left"
                classNames={{
                    base: "w-[280px]",
                    body: "p-0"
                }}
            >
                <DrawerContent>
                    <DrawerBody>
                        <SidebarContent />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Changed from 'fixed' to 'sticky' so it sits in the flex flow */}
            <div className="hidden md:flex flex-col w-[280px] h-screen border-r border-default-200 sticky top-0 z-40">
                <SidebarContent />
            </div>
        </>
    );
}