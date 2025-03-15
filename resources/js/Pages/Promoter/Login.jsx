import React from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
    const { data, setData, post, errors } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("promoter.login"));
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Login de Promoter</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="Digite seu email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <Label>Senha</Label>
                            <Input
                                type="password"
                                placeholder="Digite sua senha"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
