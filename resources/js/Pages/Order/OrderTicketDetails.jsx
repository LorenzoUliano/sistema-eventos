import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    XCircle,
    Calendar,
    MapPin,
    Ticket,
    DollarSign,
    Building,
    User,
    Download,
    Share2,
    AlertCircle,
    Shield,
    Sparkles
} from "lucide-react";

export default function OrderTicketDetails({ orderTicket, order }) {
    const getStatusConfig = (status) => {
        const configs = {
            paid: {
                variant: "default",
                label: "Pago",
                icon: CheckCircle2,
                color: "text-green-600",
                bg: "bg-green-50 dark:bg-green-950"
            },
            pending: {
                variant: "secondary",
                label: "Pendente",
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-50 dark:bg-amber-950"
            },
            validated: {
                variant: "default",
                label: "Validado",
                icon: Shield,
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-950"
            },
            cancelled: {
                variant: "destructive",
                label: "Cancelado",
                icon: XCircle,
                color: "text-red-600",
                bg: "bg-red-50 dark:bg-red-950"
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(orderTicket?.status);
    const StatusIcon = statusConfig.icon;

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

    // Gerar string única para QR Code
    const qrCodeData = JSON.stringify({
        ticket_id: orderTicket?.id,
        order_id: order?.id,
        user_id: orderTicket?.user_id,
        event_id: orderTicket?.ticket?.event?.id,
        timestamp: new Date().toISOString(),
        hash: btoa(`${orderTicket?.id}-${order?.id}-${orderTicket?.user_id}`)
    });

    const handleDownloadQRCode = () => {
        const svg = document.getElementById('qr-code-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `ingresso-${orderTicket?.id}-qrcode.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const handlePrintTicket = () => {
        const event = orderTicket?.ticket?.event;
        const printWindow = window.open('', '_blank');

        const qrSvg = document.getElementById('qr-code-svg').outerHTML;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Ingresso #${orderTicket?.id}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .ticket {
                            border: 3px solid #333;
                            border-radius: 15px;
                            padding: 30px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            margin-bottom: 20px;
                        }
                        .ticket-header {
                            text-align: center;
                            margin-bottom: 30px;
                            padding-bottom: 20px;
                            border-bottom: 2px dashed rgba(255,255,255,0.3);
                        }
                        .ticket-header h1 {
                            font-size: 32px;
                            margin-bottom: 10px;
                        }
                        .ticket-id {
                            font-size: 18px;
                            opacity: 0.9;
                        }
                        .ticket-body {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 20px;
                            margin-bottom: 30px;
                        }
                        .info-group {
                            margin-bottom: 15px;
                        }
                        .info-label {
                            font-size: 12px;
                            opacity: 0.8;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .info-value {
                            font-size: 18px;
                            font-weight: bold;
                            margin-top: 5px;
                        }
                        .qr-section {
                            background: white;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                        }
                        .qr-section h3 {
                            color: #333;
                            margin-bottom: 15px;
                        }
                        .qr-code-container {
                            display: flex;
                            justify-content: center;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            padding-top: 20px;
                            border-top: 2px dashed rgba(255,255,255,0.3);
                            font-size: 12px;
                            opacity: 0.8;
                        }
                        @media print {
                            body { padding: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="ticket-header">
                            <h1>${event?.name || 'Evento'}</h1>
                            <div class="ticket-id">Ingresso #${orderTicket?.id}</div>
                        </div>

                        <div class="ticket-body">
                            <div class="info-group">
                                <div class="info-label">Data do Evento</div>
                                <div class="info-value">
                                    ${event?.start_date ? formatDate(event.start_date) : 'A definir'}
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-label">Local</div>
                                <div class="info-value">
                                    ${event?.city || ''} - ${event?.state || ''}
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-label">Tipo de Ingresso</div>
                                <div class="info-value">
                                    ${orderTicket?.ticket?.name || 'Ingresso'}
                                </div>
                            </div>

                            <div class="info-group">
                                <div class="info-label">Valor</div>
                                <div class="info-value">
                                    ${formatCurrency(parseFloat(orderTicket?.unit_price) || 0)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="qr-section">
                        <h3>QR Code de Validação</h3>
                        <div class="qr-code-container">
                            ${qrSvg}
                        </div>
                        <p style="color: #666; font-size: 12px; margin-top: 10px;">
                            Apresente este QR Code na entrada do evento
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; color: #666;">
                        <p style="font-size: 12px;">
                            Pedido #${order?.id} • Status: ${statusConfig.label}
                        </p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            Este ingresso é pessoal e intransferível
                        </p>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handleShareTicket = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Ingresso #${orderTicket?.id}`,
                    text: `Meu ingresso para ${orderTicket?.ticket?.event?.name || 'evento'}`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Erro ao compartilhar:', err);
            }
        } else {
            // Fallback: copiar link
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    };

    const event = orderTicket?.ticket?.event;
    const ticket = orderTicket?.ticket;

    return (
        <AuthenticatedLayout>
            <Head title={`Ingresso #${orderTicket?.id}`} />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/orders" className="hover:text-primary">Pedidos</Link>
                    <span>/</span>
                    <Link href={`/orders/${order?.id}`} className="hover:text-primary">
                        Pedido #{order?.id}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">Ingresso #{orderTicket?.id}</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <Link href={`/orders/${order?.id}`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para o pedido
                        </Button>
                    </Link>

                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <Ticket className="w-8 h-8" />
                                Ingresso #{orderTicket?.id}
                            </h1>
                            <p className="text-muted-foreground">
                                Pedido #{order?.id} • {formatDate(order?.created_at)}
                            </p>
                        </div>
                        <Badge variant={statusConfig.variant} className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                        </Badge>
                    </div>

                    {orderTicket?.status === 'validated' && (
                        <div className={`${statusConfig.bg} border-l-4 border-blue-600 p-4 rounded-lg flex items-center gap-3`}>
                            <Shield className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-semibold text-blue-900 dark:text-blue-100">
                                    Ingresso Validado
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-200">
                                    Este ingresso já foi validado e utilizado
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* QR Code Card - Destaque */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4 border-2 border-primary/20 shadow-lg">
                            <CardHeader className="text-center bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    QR Code
                                </CardTitle>
                                <CardDescription>
                                    Apresente na entrada
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="bg-white p-4 rounded-lg shadow-inner flex justify-center">
                                    <QRCodeSVG
                                        id="qr-code-svg"
                                        value={qrCodeData}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                                <div className="mt-6 space-y-2">
                                    <Button
                                        onClick={handlePrintTicket}
                                        className="w-full gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Imprimir Ingresso
                                    </Button>

                                    <Button
                                        onClick={handleDownloadQRCode}
                                        variant="outline"
                                        className="w-full gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Baixar QR Code
                                    </Button>

                                    <Button
                                        onClick={handleShareTicket}
                                        variant="outline"
                                        className="w-full gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Compartilhar
                                    </Button>
                                </div>

                                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-center text-muted-foreground">
                                        <AlertCircle className="w-3 h-3 inline mr-1" />
                                        Ingresso pessoal e intransferível
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informações do Evento */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Evento Card */}
                        {event && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{event.name}</CardTitle>
                                    {event.description && (
                                        <CardDescription className="text-sm mt-2">
                                            {event.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {event.image_url && (
                                        <div className="rounded-lg overflow-hidden">
                                            <img
                                                src={event.image_url}
                                                alt={event.name}
                                                className="w-full h-64 object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {event.start_date && (
                                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Data e Hora</p>
                                                    <p className="font-semibold">
                                                        {new Date(event.start_date).toLocaleDateString('pt-BR', {
                                                            weekday: 'long',
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(event.start_date).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {(event.city || event.location) && (
                                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Local</p>
                                                    <p className="font-semibold">
                                                        {event.location || event.city}
                                                    </p>
                                                    {event.city && event.state && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {event.city} - {event.state}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {event.company && (
                                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Building className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Organizador</p>
                                                    <p className="font-semibold">{event.company.name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Detalhes do Ingresso */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalhes do Ingresso</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">ID do Ingresso</p>
                                        <p className="font-semibold">#{orderTicket?.id}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Tipo</p>
                                        <p className="font-semibold">{ticket?.name || 'Ingresso'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Valor</p>
                                        <p className="font-semibold text-primary">
                                            {formatCurrency(parseFloat(orderTicket?.unit_price) || 0)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge variant={statusConfig.variant} className="mt-1">
                                            {statusConfig.label}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Pedido</p>
                                        <Link href={`/orders/${order?.id}`}>
                                            <p className="font-semibold text-primary hover:underline">
                                                #{order?.id}
                                            </p>
                                        </Link>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Compra</p>
                                        <p className="font-semibold text-sm">
                                            {new Date(order?.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informações Importantes */}
                        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                                    <AlertCircle className="w-5 h-5" />
                                    Informações Importantes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                                <p>• Apresente o QR Code na entrada do evento</p>
                                <p>• Este ingresso é pessoal e intransferível</p>
                                <p>• Leve um documento com foto para validação</p>
                                <p>• Chegue com antecedência para evitar filas</p>
                                {orderTicket?.status === 'validated' && (
                                    <p className="font-semibold">• Este ingresso já foi validado e não pode ser usado novamente</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

