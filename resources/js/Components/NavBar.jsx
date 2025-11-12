import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/Hooks/useDarkMode";
import { route } from 'ziggy-js';
import {
    Sun,
    Moon,
    User,
    LayoutDashboard,
    Ticket,
    Home,
    CalendarDays,
    Menu,
    X
} from "lucide-react";

export default function Navbar({ layoutType = 'default', auth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useDarkMode();

    const user = auth?.user;
    const promoter = auth?.promoter;
    const isPromoterLayout = layoutType === 'promoter';

    const ThemeIcon = isDark ? Sun : Moon;
    const MenuIcon = isMenuOpen ? X : Menu;

    const logout = () => {
        const routeName = isPromoterLayout ? "promoter.logout" : "logout";
        router.post(route(routeName)); // Corrigido aqui
    };

    const navigationLinks = [
        {
            href: isPromoterLayout ? route("promoter.dashboard") : "/",
            label: isPromoterLayout ? "Dashboard" : "Home",
            icon: isPromoterLayout ? LayoutDashboard : Home
        },
        {
            href: isPromoterLayout ? route("promoter.register") : "/events",
            label: isPromoterLayout ? "Criar Promoter" : "Eventos",
            icon: isPromoterLayout ? User : CalendarDays
        }
    ];


    return (
        <nav className="bg-card/50 backdrop-blur-lg border-b border-border/50 fixed w-full z-50 shadow-theme">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="p-2 bg-primary rounded-lg">
                            <Ticket className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            {isPromoterLayout ? "Promoter Portal" : "EventFlow"}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 text-primary/80 hover:text-primary transition-colors group"
                            >
                                <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDark(!isDark)}
                            className="rounded-full hover:bg-primary/10"
                        >
                            <ThemeIcon className="w-5 h-5 text-primary" />
                        </Button>

                        {(promoter || user) ? (
                            <div className="flex items-center gap-4">
                                <Link href={user && !isPromoterLayout ? "/profile" : "#"} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{(promoter || user).name}</span>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={logout}
                                    className="border-destructive text-destructive hover:bg-destructive/10"
                                >
                                    Sair
                                </Button>
                            </div>
                        ) : (
                            <Link href={isPromoterLayout ? route("promoter.login") : route("login")}>
                                <Button className="gap-2 bg-primary hover:bg-primary/90">
                                    <User className="w-4 h-4" />
                                    Entrar
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-primary"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute w-full bg-card/95 backdrop-blur-lg border-b border-border">
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            <div className="flex flex-col gap-2">
                                {navigationLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <link.icon className="w-5 h-5 text-primary" />
                                        <span className="text-primary font-medium">{link.label}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t border-border/50 pt-4">
                                {(promoter || user) ? (
                                    <div className="space-y-4">
                                        {user && !isPromoterLayout ? (
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-primary">{user.name}</p>
                                                    <p className="text-sm text-primary/60">Perfil Usuário</p>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-3 px-4">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-primary">{(promoter || user).name}</p>
                                                    <p className="text-sm text-primary/60">Perfil {isPromoterLayout ? 'Promoter' : 'Usuário'}</p>
                                                </div>
                                            </div>
                                        )}
                                        <Button
                                            onClick={logout}
                                            variant="destructive"
                                            className="w-full gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Sair
                                        </Button>
                                    </div>
                                ) : (
                                    <Link
                                        href={isPromoterLayout ? route("promoter.login") : route("login")}
                                        className="block"
                                    >
                                        <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                                            <User className="w-4 h-4" />
                                            Entrar
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}