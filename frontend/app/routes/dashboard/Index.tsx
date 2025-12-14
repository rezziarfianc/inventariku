import { Card, Button } from "@heroui/react";
import { useAuth } from "~/context/authContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Index() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col h-full p-6 items-center justify-center ">
            <Card className="p-8 max-w-md w-full text-center space-y-4 bg-transparent shadow-none">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
                    <p className="text-xl text-primary font-semibold">{user?.name}</p>
                </div>

                <p className="text-gray-500">
                    You are logged in to Inventariku System.
                </p>


            </Card>
        </div>
    );
}
