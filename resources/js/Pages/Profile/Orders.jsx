import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import OrdersContent from './OrdersContent';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileOrders() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeKey = 'orders';

    return (
        <AuthenticatedLayout>
            <Head title="Meus Pedidos" />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Menu Lateral */}
                    <ProfileSidebar 
                        activeKey={activeKey}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />

                    {/* Conteúdo Principal */}
                    <main className="flex-1 min-w-0">
                        <OrdersContent />
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

