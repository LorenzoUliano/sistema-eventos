import React, {useEffect, useState} from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PromoterLayout from '@/Layouts/PromoterLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Plus, Trash2, DollarSign, Users } from 'lucide-react';

export default function EventTickets({ event }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        limit_quantity: ''
    });

    const [formattedPrice, setFormattedPrice] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('promoter.tickets.store', event.id), {
            onSuccess: () => reset()
        });
    };

    const deleteTicket = (ticketId) => {
        router.delete(route('promoter.tickets.destroy', { event: event.id, ticket: ticketId }));
    };

    return (
        <PromoterLayout>
            <Head title={`Gerenciar Ingressos - ${event.name}`} />

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{event.name}</h1>
                        <p className="text-muted-foreground">Gerenciamento de ingressos</p>
                    </div>
                    <Link href={route('promoter.event.manage', event.id)}>
                        <Button variant="outline">
                            Voltar para o evento
                        </Button>
                    </Link>
                </div>

                {/* Formulário de novo ingresso */}
                <Card className="shadow-theme">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-6 h-6" />
                            Criar Novo Tipo de Ingresso
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome do Ingresso</Label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ex: Pista Premium"
                                    />
                                    {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Preço</Label>
                                    <Input
                                        value={data.price}
                                        placeholder="Ex: R$ 199,90"
                                        onChange={e => setData('price', e.target.value)}
                                    />
                                    {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Quantidade Disponível</Label>
                                    <Input
                                        type="number"
                                        value={data.limit_quantity}
                                        onChange={(e) => {
                                            const value = Math.min(9999, e.target.value); // Limita o valor máximo
                                            setData('limit_quantity', value)
                                        }}
                                        placeholder="Ex: 100"
                                        min="1"
                                        max="9999"
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errors.limit_quantity && <p className="text-destructive text-sm">{errors.limit_quantity}</p>}
                                </div>
                            </div>

                            <Button type="submit" className="mt-4 gap-2" disabled={processing}>
                                {processing ? 'Salvando...' : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Criar Ingresso
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Lista de ingressos existentes */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-primary">Ingressos Cadastrados</h2>

                    {event.tickets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.tickets.map((ticket) => (
                                <Card key={ticket.id} className="shadow-theme">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="w-6 h-6 text-primary" />
                                                    <h3 className="text-lg font-semibold">{ticket.name}</h3>
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>
                                                        {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                        }).format(ticket.price)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                    <span>{ticket.limit_quantity} ingressos disponíveis</span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => deleteTicket(ticket.id)}
                                                className="shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                            <p className="text-muted-foreground">Nenhum ingresso cadastrado ainda</p>
                        </div>
                    )}
                </div>
            </div>
        </PromoterLayout>
    );
}
