import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { useState } from 'react';
import {
    Mail,
    Phone,
    Facebook,
    Instagram,
    Twitter,
    Star,
    Send
} from 'lucide-react';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileSupport() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const activeKey = 'support';

    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        message: '',
        rating: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.rating = rating;
        // Aqui você pode enviar o feedback para o backend
        console.log('Feedback:', data);
        alert('Obrigado pelo seu feedback!');
        setData({ subject: '', message: '', rating: 0 });
        setRating(0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Suporte" />
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
                        {/* Avaliação do Website */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Avalie nosso Website</CardTitle>
                                <CardDescription>
                                    Sua opinião é muito importante para nós!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${
                                                    star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-muted-foreground'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Formulário de Feedback */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Envie seu Feedback</CardTitle>
                                <CardDescription>
                                    Tem alguma sugestão, reclamação ou dúvida? Entre em contato!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="subject">Assunto</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="Ex: Problema com pedido, Sugestão de melhoria..."
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="message">Mensagem</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Descreva sua dúvida, sugestão ou problema..."
                                            rows={6}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive mt-1">{errors.message}</p>
                                        )}
                                    </div>
                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Send className="w-4 h-4 mr-2" />
                                        Enviar Feedback
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Informações de Contato */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Entre em Contato</CardTitle>
                                <CardDescription>
                                    Outras formas de nos encontrar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Telefone</p>
                                        <p className="text-sm text-muted-foreground">(99) 99999-9999</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">E-mail</p>
                                        <p className="text-sm text-muted-foreground">suporte@eventflow.com</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="font-medium mb-3">Redes Sociais</p>
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="icon" asChild>
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Facebook className="w-5 h-5" />
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon" asChild>
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon" asChild>
                                            <a href="#" target="_blank" rel="noopener noreferrer">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        </Button>
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

