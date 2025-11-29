import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    User,
    ShoppingBag,
    HelpCircle,
    LogOut,
    Menu,
    X
} from 'lucide-react';

export default function ProfileSidebar({ activeKey, isMobileMenuOpen, setIsMobileMenuOpen }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const menuItems = [
        { href: '/profile', label: 'Informações do Perfil', icon: User, key: 'profile' },
        { href: '/profile/orders', label: 'Meus Pedidos', icon: ShoppingBag, key: 'orders' },
        { href: '/profile/support', label: 'Suporte', icon: HelpCircle, key: 'support' },
    ];

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <Card className="sticky top-24">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">{user?.name}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="space-y-1 p-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeKey === item.key;
                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Deslogar</span>
                            </button>
                        </div>
                    </nav>
                </CardContent>
            </Card>
        </aside>
    );
}

