import React from "react";
import { Button } from "@/components/ui/button";
import { usePage, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;

    const logout = () => {
        router.post(route("promoter.logout"));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Bem-vindo, {auth.user.name}!</h1>
            <p className="text-gray-500">Você está logado como promoter.</p>

            {/* Apenas promoters podem cadastrar outros promoters */}
            <Link href={route("promoter.register")}>
                <Button className="mt-4">Cadastrar Novo Promoter</Button>
            </Link>

            <Button className="mt-4" onClick={logout}>
                Sair
            </Button>
        </div>
    );
}
