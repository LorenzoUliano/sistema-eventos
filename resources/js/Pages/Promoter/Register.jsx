import React from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Register() {
    const { data, setData, post, errors } = useForm({
        company_id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("promoter.register"));
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Cadastro de Promoter</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label>ID da Empresa</Label>
                            <Input
                                type="text"
                                placeholder="Digite o ID da empresa"
                                value={data.company_id}
                                onChange={(e) => setData("company_id", e.target.value)}
                            />
                            {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id}</p>}
                        </div>
                        <div>
                            <Label>Nome</Label>
                            <Input
                                type="text"
                                placeholder="Digite seu nome"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
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
                            <Label>Telefone</Label>
                            <Input
                                type="text"
                                placeholder="Digite seu telefone"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
                        <div>
                            <Label>Confirmar Senha</Label>
                            <Input
                                type="password"
                                placeholder="Confirme sua senha"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Cadastrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
