import React from "react";
import { Form, Input, Button, Card, CardBody, CardHeader, Alert } from "@heroui/react";
import type { Route } from "./+types/Login";
import type { FormEvent } from "react";
import { Box } from 'lucide-react';
import { loginUser } from "~/api/authApi";
import type { LoginCredentials } from "~/types/api";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login - Inventariku" },
        { name: "description", content: "Login to access your account." },
    ];
}

import { useAuth } from "~/context/authContext";

export default function Login() {
    const [alert, setAlert] = React.useState<string | null>(null);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const { login } = useAuth();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        const creds: LoginCredentials = {
            email: data.email as string,
            password: data.password as string
        }

        try {
            setAlert(null);
            setLoading(true);
            // await new Promise(r => setTimeout(r, 2000));
            await login(creds);

        } catch (error: unknown) {
            let message = "Failed, unknown error";
            if (error instanceof Error) {
                message = error.message;
            }

            setLoading(false);
            setAlert(message)
            console.error(e)
        }
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
                        {alert && (
                            <div className="flex items-center justify-center w-full">
                                <Alert hideIcon color="danger" description={alert} title="failed to login" variant="faded" />
                            </div>
                        )}
                        <Input
                            isRequired
                            errorMessage="Please enter a valid email"
                            label="Email"
                            isDisabled={isLoading}
                            labelPlacement="outside"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            fullWidth
                        />
                        <Input
                            isRequired
                            errorMessage="Please enter your password"
                            isDisabled={isLoading}
                            label="Password"
                            labelPlacement="outside"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                        />
                        <Button color="primary" type="submit" variant="solid" fullWidth className="mt-4" isLoading={isLoading}>
                            Login
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}