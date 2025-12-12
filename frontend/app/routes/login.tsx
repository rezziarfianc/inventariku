import React from "react";
import { Form, Input, Button, Card, CardBody, CardHeader } from "@heroui/react";
import type { Route } from "./+types/login";
import type { FormEvent } from "react";
import { Box } from 'lucide-react';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login - Inventariku" },
        { name: "description", content: "Login to access your account." },
    ];
}

export default function Login() {
    const [action, setAction] = React.useState<string | null>(null);

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));
        setAction(`submit ${JSON.stringify(data)}`);
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-default-100">
            <Card className="max-w-md shadow-lg items-center p-1 w-full">
                <CardHeader className="w-full flex flex-col items-center px-5" >
                    <Box size={48} className="text-primary mb-2" />
                    <h2 className="text-2xl font-semibold text-center mb-5">Login to Your Account</h2>
                </CardHeader>
                <CardBody className="w-full flex flex-col items-center">
                    <Form
                        className="w-full max-w-xs flex flex-col gap-4 pb-5"
                        onSubmit={submitHandler}
                    >
                        <Input
                            isRequired
                            errorMessage="Please enter a valid email"
                            label="Email"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            fullWidth
                        />
                        <Input
                            isRequired
                            errorMessage="Please enter your password"
                            label="Password"
                            labelPlacement="outside"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                        />
                        <Button color="primary" type="submit" variant="solid" fullWidth className="mt-4">
                            Login
                        </Button>
                        {action && (
                            <div className="text-small text-default-500">
                                Action: <code>{action}</code>
                            </div>
                        )}
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}