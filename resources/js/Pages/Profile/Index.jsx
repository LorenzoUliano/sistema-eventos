import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';
import { Edit } from 'lucide-react';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileIndex({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeKey = 'profile';

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />
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
                                <div className="flex items-center justify-between">
                                    <CardTitle>Informações do Perfil</CardTitle>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/profile/edit">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                        <p className="text-lg font-semibold mt-1">{user?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                                        <p className="text-lg font-semibold mt-1">{user?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

