import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const promoter = auth?.promoter;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const logout = () => {
        if (promoter) {
            router.post(route("promoter.logout"));
        } else {
            router.post(route("logout"));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md fixed w-full z-10">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <span className="text-xl font-bold text-gray-800">Painel</span>
                            </Link>
                        </div>

                        {/* Menu Desktop */}
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

                        {/* Menu Desktop - Usuário ou Promoter */}
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

                        {/* Botão do menu mobile */}
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
                {showingNavigationDropdown && (
                    <div className="md:hidden bg-white shadow-md absolute w-full">
                        <div className="p-4 space-y-2">
                            {promoter ? (
                                <>
                                    <Link href={route("promoter.dashboard")} className="block text-gray-700 hover:text-blue-600 font-medium">
                                        Dashboard Promoter
                                    </Link>
                                    <Link href={route("promoter.register")} className="block text-gray-700 hover:text-blue-600 font-medium">
                                        Criar Promoter
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/" className="block text-gray-700 hover:text-blue-600 font-medium">
                                        Home
                                    </Link>
                                    <Link href="/events" className="block text-gray-700 hover:text-blue-600 font-medium">
                                        Eventos
                                    </Link>
                                </>
                            )}

                            <div className="border-t my-2"></div>

                            {promoter ? (
                                <>
                                    <span className="block text-gray-700 font-medium">Olá, {promoter.name}!</span>
                                    <button onClick={logout} className="block text-red-600 hover:text-red-800 font-medium w-full text-left">
                                        Sair
                                    </button>
                                </>
                            ) : user ? (
                                <>
                                    <span className="block text-gray-700 font-medium">Olá, {user.name}!</span>
                                    <button onClick={logout} className="block text-red-600 hover:text-red-800 font-medium w-full text-left">
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <Link href={route("login")} className="block bg-blue-600 text-white py-2 px-4 rounded text-center">
                                    Entrar
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Conteúdo principal */}
            <div className="pt-20">{children}</div>
        </div>
    );
}
