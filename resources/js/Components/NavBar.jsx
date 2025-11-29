import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useDarkMode } from "@/Hooks/useDarkMode";
import { route } from 'ziggy-js';
import {
    Sun,
    Moon,
    User,
    LayoutDashboard,
    Ticket,
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
        router.post(route(routeName));
    };

    const navigationLinks = isPromoterLayout ? [
        {
            href: route("promoter.dashboard"),
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            href: route("promoter.register"),
            label: "Criar Promoter",
            icon: User
        }
    ] : [];


    return (
        <nav className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 w-full z-50 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link
                        href={isPromoterLayout ? route("promoter.dashboard") : "/"}
                        className="flex items-center gap-3 group"
                    >
                        <div className="relative">
                            <div className="p-2.5 bg-gradient-to-br from-primary to-purple-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                                <Ticket className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                {isPromoterLayout ? "Promoter Portal" : "EventFlow"}
                            </span>
                            {isPromoterLayout && (
                                <span className="text-xs text-muted-foreground">Gestão de Eventos</span>
                            )}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
                            >
                                <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium text-sm">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDark(!isDark)}
                            className="rounded-full hover:bg-primary/10 hover:scale-105 transition-all"
                            aria-label="Alternar tema"
                        >
                            <ThemeIcon className="w-5 h-5 text-primary" />
                        </Button>

                        {(promoter || user) ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={user && !isPromoterLayout ? route('profile.index') : "#"}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all group cursor-pointer"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center ring-2 ring-background group-hover:ring-primary/20 transition-all">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                            {(promoter || user).name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {isPromoterLayout ? 'Promoter' : 'Minha Conta'}
                                        </span>
                                    </div>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                    className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                                >
                                    Sair
                                </Button>
                            </div>
                        ) : (
                            <Link href={isPromoterLayout ? route("promoter.login") : route("login")}>
                                <Button className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg hover:shadow-xl transition-all">
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
                    <div className="md:hidden fixed left-0 right-0 top-16 bg-card backdrop-blur-xl border-b border-border shadow-2xl z-40 animate-in slide-in-from-top-2 duration-200">
                        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
                            {/* Navigation Links */}
                            {navigationLinks.length > 0 && (
                                <div className="space-y-1">
                                    {navigationLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all group"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                <link.icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                                                {link.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* User Section */}
                            <div className="space-y-4">
                                {(promoter || user) ? (
                                    <>
                                        {/* User Profile */}
                                        {user && !isPromoterLayout ? (
                                            <Link
                                                href={route('profile.index')}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center ring-2 ring-background shadow-lg">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-foreground">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">Ver perfil</p>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center ring-2 ring-background shadow-lg">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-foreground">{(promoter || user).name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isPromoterLayout ? 'Promoter' : 'Usuário'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Logout Button */}
                                        <Button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            variant="outline"
                                            className="w-full h-12 gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <X className="w-4 h-4" />
                                            Sair
                                        </Button>
                                    </>
                                ) : (
                                    <Link
                                        href={isPromoterLayout ? route("promoter.login") : route("login")}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Button className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg">
                                            <User className="w-4 h-4" />
                                            Entrar
                                        </Button>
                                    </Link>
                                )}

                                {/* Theme Toggle */}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDark(!isDark);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full h-12 gap-2"
                                >
                                    <ThemeIcon className="w-5 h-5" />
                                    {isDark ? 'Modo Claro' : 'Modo Escuro'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
