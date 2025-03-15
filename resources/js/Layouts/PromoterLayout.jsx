import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function PromoterLayout({ children }) {
    const { auth } = usePage().props;
    const promoter = auth?.promoter; // Pegando os dados corretamente

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const logout = () => {
        router.post(route("promoter.logout"));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md fixed w-full z-10">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <span className="text-xl font-bold text-gray-800">Painel Promoter</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex space-x-6">
                            <Link href={route("promoter.dashboard")} className="text-gray-700 hover:text-blue-600 font-medium">
                                Dashboard
                            </Link>
                            <Link href={route("promoter.register")} className="text-gray-700 hover:text-blue-600 font-medium">
                                Criar Promoter
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center">
                            {promoter ? (
                                <>
                                    <span className="text-gray-700 font-medium">Olá, {promoter.name}!</span>
                                    <Button variant="outline" className="ml-4" onClick={logout}>
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <Link href={route("promoter.login")}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
                                </Link>
                            )}
                        </div>

                        {/* Menu Mobile */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dropdown Mobile */}
                {showingNavigationDropdown && promoter && (
                    <div className="md:hidden bg-white shadow-md absolute w-full">
                        <div className="p-4 space-y-2">
                            <Link href={route("promoter.dashboard")} className="block text-gray-700 hover:text-blue-600 font-medium">
                                Dashboard
                            </Link>
                            <Link href={route("promoter.register")} className="block text-gray-700 hover:text-blue-600 font-medium">
                                Criar Promoter
                            </Link>
                            <div className="border-t my-2"></div>
                            <span className="block text-gray-700 font-medium">Olá, {promoter.name}!</span>
                            <button onClick={logout} className="block text-red-600 hover:text-red-800 font-medium w-full text-left">
                                Sair
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Conteúdo principal */}
            <div className="pt-20 px-6">{children}</div>
        </div>
    );
}
