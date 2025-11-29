import React from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function Register() {
    const { data, setData, post, errors } = useForm({
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
        <PromoterLayout>
            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Promoter</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Nome</Label>
                        <Input type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <Label>Telefone</Label>
                        <Input type="text" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                    </div>
                    <div>
                        <Label>Senha</Label>
                        <Input type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} />
                    </div>
                    <div>
                        <Label>Confirmar Senha</Label>
                        <Input type="password" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">
                        Cadastrar
                    </Button>
                </form>
            </div>
        </PromoterLayout>
    );
}
