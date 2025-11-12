import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { QrCode, Construction } from 'lucide-react';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileQRCodes() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeKey = 'qrcodes';

    return (
        <AuthenticatedLayout>
            <Head title="QRCodes" />
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
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <QrCode className="w-6 h-6" />
                                    Meus QRCodes
                                </CardTitle>
                                <CardDescription>
                                    Acesse seus códigos QR para entrada nos eventos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <Construction className="w-16 h-16 text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Implementação Futura</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Esta funcionalidade está em desenvolvimento. Em breve você poderá visualizar e gerenciar seus códigos QR para entrada nos eventos de forma mais prática.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

