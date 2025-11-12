import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileEdit({ mustVerifyEmail, status }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeKey = 'profile';

    return (
        <AuthenticatedLayout>
            <Head title="Editar Perfil" />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Menu Lateral */}
                    <ProfileSidebar 
                        activeKey={activeKey}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />

                    {/* Conteúdo Principal */}
                    <main className="flex-1 min-w-0 space-y-6">
                        <div className="mb-4">
                            <Link href="/profile">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar
                                </Button>
                            </Link>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Perfil</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Alterar Senha</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <UpdatePasswordForm />
                            </CardContent>
                        </Card>

                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">Excluir Conta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DeleteUserForm />
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
