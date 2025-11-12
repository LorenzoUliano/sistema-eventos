import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Package,
    Calendar,
    MapPin,
    Ticket,
    DollarSign,
    Building,
    User,
    Download,
    X,
    Mail,
    AlertCircle
} from "lucide-react";

export default function OrderDetails({ order }) {
    const [isLoading, setIsLoading] = useState(false);
    const getStatusBadge = (status) => {
        const variants = {
            paid: { variant: "default", label: "Pago", icon: CheckCircle2 },
            pending: { variant: "secondary", label: "Pendente", icon: Clock },
            canceled: { variant: "destructive", label: "Cancelado", icon: Package },
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const orderTotal = order?.tickets?.reduce((sum, ticket) => {
        return sum + (parseFloat(ticket.pivot?.total_price) || 0);
    }, 0) || 0;

    const totalTickets = order?.tickets?.reduce((sum, ticket) => {
        return sum + (parseInt(ticket.pivot?.quantity) || 0);
    }, 0) || 0;

    const handleCancelOrder = () => {
        if (confirm("Tem certeza que deseja cancelar este pedido?")) {
            setIsLoading(true);
            router.delete(`/orders/${order.id}`, {
                onFinish: () => setIsLoading(false),
            });
        }
    };

    const handleDownloadReceipt = () => {
        // Gerar comprovante completo
        const printWindow = window.open('', '_blank');
        const orderDate = formatDate(order?.created_at);
        const ticketsHtml = order?.tickets?.map((ticket, index) => {
            const ticketPrice = parseFloat(ticket.pivot?.total_price) || 0;
            const ticketQuantity = parseInt(ticket.pivot?.quantity) || 0;
            const unitPrice = ticketPrice / ticketQuantity;
            const eventName = ticket.event?.name || ticket.name || "Evento não disponível";
            
            return `
                <div class="ticket-item">
                    <h3>${eventName}</h3>
                    <p><strong>Tipo:</strong> ${ticket.name}</p>
                    <p><strong>Quantidade:</strong> ${ticketQuantity}x</p>
                    <p><strong>Preço unitário:</strong> ${formatCurrency(unitPrice)}</p>
                    <p><strong>Subtotal:</strong> ${formatCurrency(ticketPrice)}</p>
                </div>
            `;
        }).join('') || '<p>Nenhum ingresso encontrado</p>';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Comprovante - Pedido #${order?.id}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: Arial, sans-serif; 
                            padding: 40px 20px; 
                            max-width: 800px; 
                            margin: 0 auto;
                            color: #333;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 40px; 
                            padding-bottom: 20px;
                            border-bottom: 2px solid #ddd;
                        }
                        .header h1 { 
                            font-size: 28px; 
                            margin-bottom: 10px; 
                            color: #1a1a1a;
                        }
                        .order-info { 
                            margin-bottom: 30px; 
                            padding: 20px;
                            background: #f9f9f9;
                            border-radius: 8px;
                        }
                        .order-info p { 
                            margin: 8px 0; 
                            font-size: 14px;
                        }
                        .ticket-item { 
                            border: 1px solid #ddd; 
                            padding: 20px; 
                            margin-bottom: 15px; 
                            border-radius: 8px;
                            background: #fff;
                        }
                        .ticket-item h3 {
                            font-size: 18px;
                            margin-bottom: 10px;
                            color: #1a1a1a;
                        }
                        .ticket-item p {
                            margin: 5px 0;
                            font-size: 14px;
                        }
                        .total { 
                            font-size: 20px; 
                            font-weight: bold; 
                            text-align: right; 
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 2px solid #ddd;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 2px solid #ddd;
                            color: #666;
                            font-size: 14px;
                        }
                        @media print {
                            body { padding: 20px; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Comprovante de Pedido</h1>
                        <p style="font-size: 18px; color: #666;">Pedido #${order?.id}</p>
                    </div>
                    <div class="order-info">
                        <p><strong>Data do Pedido:</strong> ${orderDate}</p>
                        <p><strong>Status:</strong> ${order?.status === 'paid' ? 'Pago' : order?.status === 'pending' ? 'Pendente' : 'Cancelado'}</p>
                        <p><strong>Total de Ingressos:</strong> ${totalTickets}</p>
                    </div>
                    <h2 style="margin-bottom: 20px; font-size: 20px;">Detalhes dos Ingressos</h2>
                    ${ticketsHtml}
                    <div class="total">
                        <p>Total: ${formatCurrency(orderTotal)}</p>
                    </div>
                    <div class="footer">
                        <p>Obrigado pela sua compra!</p>
                        <p style="margin-top: 10px; font-size: 12px;">Este é um comprovante gerado automaticamente pelo sistema.</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    // Obter nome do evento (com fallback)
    const getEventName = (ticket) => {
        if (ticket.event && ticket.event.name) {
            return ticket.event.name;
        }
        if (ticket.name) {
            return `Ingresso: ${ticket.name}`;
        }
        return "Evento não disponível";
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Pedido #${order?.id}`} />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/orders">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para pedidos
                        </Button>
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Pedido #{order?.id}
                            </h1>
                            <p className="text-muted-foreground">
                                Realizado em {formatDate(order?.created_at)}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(order?.status)}
                            {order?.status === "paid" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadReceipt}
                                    disabled={isLoading}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar Comprovante
                                </Button>
                            )}
                            {order?.status === "pending" && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleCancelOrder}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Cancelando...
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4 mr-2" />
                                            Cancelar Pedido
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informações do Pedido */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                Total de Ingressos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalTickets}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {order?.tickets?.length || 0} tipo{order?.tickets?.length !== 1 ? 's' : ''} diferente{order?.tickets?.length !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Valor Total
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(orderTotal)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Valor do pedido
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Data do Pedido
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-semibold">
                                {new Date(order?.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(order?.created_at).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detalhes dos Ingressos */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Detalhes dos Ingressos</CardTitle>
                        <CardDescription>
                            Informações completas sobre os ingressos deste pedido
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {order?.tickets && order.tickets.length > 0 ? (
                            <div className="space-y-4">
                                {order.tickets.map((ticket, index) => {
                                    const ticketPrice = parseFloat(ticket.pivot?.total_price) || 0;
                                    const ticketQuantity = parseInt(ticket.pivot?.quantity) || 0;
                                    const unitPrice = ticketPrice / ticketQuantity;

                                    return (
                                        <div
                                            key={index}
                                            className="p-4 border rounded-lg space-y-4 transition-all hover:shadow-md"
                                        >
                                            {/* Informações do Evento */}
                                            {ticket.event ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-2">
                                                            {ticket.event.name}
                                                        </h3>
                                                        {ticket.event.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {ticket.event.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        {ticket.event.start_date && (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    {new Date(ticket.event.start_date).toLocaleDateString('pt-BR', {
                                                                        weekday: 'long',
                                                                        day: '2-digit',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {ticket.event.city && (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <MapPin className="w-4 h-4" />
                                                                <span>
                                                                    {ticket.event.city}
                                                                    {ticket.event.state && ` - ${ticket.event.state}`}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {ticket.event.company && (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Building className="w-4 h-4" />
                                                                <span>{ticket.event.company.name}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {ticket.event.image_url && (
                                                        <div className="rounded-lg overflow-hidden">
                                                            <img
                                                                src={ticket.event.image_url}
                                                                alt={ticket.event.name}
                                                                className="w-full h-48 object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    <Link
                                                        href={`/event/${ticket.event.id}`}
                                                        className="inline-block"
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            Ver evento
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                                        <AlertCircle className="w-5 h-5" />
                                                        <h3 className="font-semibold text-lg">
                                                            {getEventName(ticket)}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Informações detalhadas do evento não estão disponíveis no momento.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Informações do Ingresso */}
                                            <div className="pt-4 border-t">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="font-semibold">
                                                            {ticket.name}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Preço unitário: {formatCurrency(unitPrice)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">
                                                            Quantidade
                                                        </p>
                                                        <p className="text-lg font-bold">
                                                            {ticketQuantity}x
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                    <span className="font-semibold">Subtotal:</span>
                                                    <span className="text-xl font-bold">
                                                        {formatCurrency(ticketPrice)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    Nenhum ingresso encontrado neste pedido
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Resumo do Pedido */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(orderTotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                {getStatusBadge(order?.status)}
                            </div>
                            <div className="pt-3 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-2xl font-bold">
                                        {formatCurrency(orderTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

