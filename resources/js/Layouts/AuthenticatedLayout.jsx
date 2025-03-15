import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const promoter = auth?.promoter;

    const logout = () => {
        if (promoter) {
            router.post(route("promoter.logout"));
        } else {
            router.post(route("logout"));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md fixed w-full z-10">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <span className="text-xl font-bold text-gray-800">Painel</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex space-x-6">
                            {promoter ? (
                                <>
                                    <Link href={route("promoter.dashboard")} className="text-gray-700 hover:text-blue-600 font-medium">
                                        Dashboard Promoter
                                    </Link>
                                    <Link href={route("promoter.register")} className="text-gray-700 hover:text-blue-600 font-medium">
                                        Criar Promoter
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                        Home
                                    </Link>
                                    <Link href="/events" className="text-gray-700 hover:text-blue-600 font-medium">
                                        Eventos
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="hidden md:flex items-center">
                            {promoter ? (
                                <>
                                    <span className="text-gray-700 font-medium">Olá, {promoter.name}!</span>
                                    <Button variant="outline" className="ml-4" onClick={logout}>
                                        Sair
                                    </Button>
                                </>
                            ) : user ? (
                                <>
                                    <span className="text-gray-700 font-medium">Olá, {user.name}!</span>
                                    <Button variant="outline" className="ml-4" onClick={logout}>
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <Link href={route("login")}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-20">{children}</div>
        </div>
    );
}
