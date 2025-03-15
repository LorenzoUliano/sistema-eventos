import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md fixed w-full z-10">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="h-10 w-auto text-gray-800" />
                            </Link>
                        </div>

                        <div className="hidden md:flex space-x-6">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                Home
                            </Link>
                            <Link href="/events" className="text-gray-700 hover:text-blue-600 font-medium">
                                Eventos
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                                Contato
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700 font-medium">Olá, {auth.user.name}!</span>
                                    <Link href="/profile">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Perfil</Button>
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button">
                                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                            Sair
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Link href={route('login')}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
                                </Link>
                            )}
                        </div>

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
                            <Link href="/" className="block text-gray-700 hover:text-blue-600 font-medium">
                                Home
                            </Link>
                            <Link href="/events" className="block text-gray-700 hover:text-blue-600 font-medium">
                                Eventos
                            </Link>
                            <Link href="/contact" className="block text-gray-700 hover:text-blue-600 font-medium">
                                Contato
                            </Link>
                            <div className="border-t my-2"></div>
                            {auth.user ? (
                                <>
                                    <span className="block text-gray-700 font-medium">Olá, {auth.user.name}!</span>
                                    <Link href="/profile" className="block text-blue-600 hover:text-blue-800 font-medium">
                                        Perfil
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="block text-red-600 hover:text-red-800 font-medium">
                                        Sair
                                    </Link>
                                </>
                            ) : (
                                <Link href="/login" className="block bg-blue-600 text-white py-2 px-4 rounded text-center">
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
