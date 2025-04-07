
import { Card, CardHeader } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
            <Card className="w-1/2 max-w-md shadow-xl rounded-2xl border-0">
                <CardHeader className="text-center space-y-1">
                    <div className="mb-2 flex justify-center">
                        <div className="bg-primary p-3 rounded-full">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    {children}
                </CardHeader>
            </Card>
        </div>
    );
}
