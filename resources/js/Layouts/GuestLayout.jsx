import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-4">
            {/* Logo */}
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-16 w-16 text-gray-600" />
                </Link>
            </div>

            {/* Card de autenticação */}
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Bem-vindo</h2>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
