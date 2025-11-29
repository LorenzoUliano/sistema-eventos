import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
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

    const orderTotal = order?.order_tickets?.reduce((sum, ot) => {
        return sum + (parseFloat(ot.unit_price) || 0);
    }, 0) || 0;

    const totalTickets = order?.order_tickets?.length || 0;

    const handleDownloadReceipt = () => {
        const printWindow = window.open('', '_blank');
        const orderDate = formatDate(order?.created_at);
        const ticketsHtml = order?.order_tickets?.map((ot, index) => {
            const unitPrice = parseFloat(ot.unit_price) || 0;
            const ticket = ot.ticket;
            const eventName = ticket?.event?.name || ticket?.name || "Evento não disponível";

            return `
                <div class="ticket-item">
                    <h3>${eventName}</h3>
                    <p><strong>Tipo:</strong> ${ticket?.name || ''}</p>
                    <p><strong>Quantidade:</strong> 1x</p>
                    <p><strong>Preço unitário:</strong> ${formatCurrency(unitPrice)}</p>
                    <p><strong>Subtotal:</strong> ${formatCurrency(unitPrice)}</p>
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
                                {order?.order_tickets?.length || 0} tipo{order?.order_tickets?.length !== 1 ? 's' : ''} diferente{order?.order_tickets?.length !== 1 ? 's' : ''}
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
                        {order?.order_tickets && order.order_tickets.length > 0 ? (
                            <div className="space-y-4">
                                {order.order_tickets.map((ot) => (
                                    <div key={ot.id} className="p-4 border rounded-lg space-y-4 transition-all hover:shadow-md">
                                        {/* Informações do Evento */}
                                        {ot.ticket?.event ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg mb-2">
                                                        {ot.ticket.event.name}
                                                    </h3>
                                                    {ot.ticket.event.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {ot.ticket.event.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    {ot.ticket.event.start_date && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                {new Date(ot.ticket.event.start_date).toLocaleDateString('pt-BR', {
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
                                                    {ot.ticket.event.city && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>
                                                                {ot.ticket.event.city}
                                                                {ot.ticket.event.state && ` - ${ot.ticket.event.state}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {ot.ticket.event.company && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Building className="w-4 h-4" />
                                                            <span>{ot.ticket.event.company.name}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {ot.ticket.event.image_url && (
                                                    <div className="rounded-lg overflow-hidden">
                                                        <img
                                                            src={ot.ticket.event.image_url}
                                                            alt={ot.ticket.event.name}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                Informações do evento não disponíveis
                                            </div>
                                        )}

                                        {/* Informações do Ingresso */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Ingresso</p>
                                                <p className="font-semibold">#{ot.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Preço</p>
                                                <p className="font-semibold">{formatCurrency(parseFloat(ot.unit_price) || 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Status</p>
                                                <p className="font-semibold">{ot.status}</p>
                                            </div>
                                        </div>

                                        {/* Ações por ingresso */}
                                        <div className="flex items-center gap-2">
                                            <Link href={`/order-tickets/${ot.id}`} className="flex-1">
                                                <Button variant="default" className="w-full gap-2">
                                                    <Ticket className="w-4 h-4" />
                                                    Ver QR Code do Ingresso
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum ingresso encontrado</p>
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
