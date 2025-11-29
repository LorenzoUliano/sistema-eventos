import React, { useState, useEffect, useRef } from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    Camera,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Scan,
    User,
    Ticket,
    Calendar,
    DollarSign,
    Shield,
    Zap,
    Power,
    PowerOff
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ValidateTickets({ event }) {
    const [scanning, setScanning] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [validationHistory, setValidationHistory] = useState([]);
    const scannerRef = useRef(null);
    const [cameraError, setCameraError] = useState(null);

    const onScanSuccess = (decodedText) => {
        console.log("QR Code detected:", decodedText);

        // Para o scanner temporariamente
        stopScanning();

        // Valida o QR Code no backend
        validateTicket(decodedText);
    };

    const onScanError = (errorMessage) => {
        // Ignorar erros comuns de scan (não encontrou QR code ainda)
        if (!errorMessage.includes("NotFoundException")) {
            console.warn("Scan error:", errorMessage);
        }
    };

    const validateTicket = async (qrData) => {
        try {
            // Parse do JSON do QR Code
            let ticketData;
            try {
                ticketData = JSON.parse(qrData);
                console.log("Parsed ticket data:", ticketData);
            } catch (e) {
                console.error("JSON parse error:", e);
                const errorResult = {
                    success: false,
                    message: "QR Code inválido - formato não reconhecido",
                    type: "invalid_format"
                };
                setValidationResult(errorResult);
                setValidationHistory(prev => [{
                    ...errorResult,
                    timestamp: new Date().toLocaleTimeString('pt-BR')
                }, ...prev.slice(0, 9)]);
                return;
            }

            // Envia para o backend validar
            console.log("Sending request to:", `/promoter/events/${event.id}/validate-ticket`);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            console.log("CSRF Token:", csrfToken ? "Present" : "Missing");

            const response = await fetch(`/promoter/events/${event.id}/validate-ticket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ ticket_data: ticketData })
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Response error:", errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log("Validation result:", result);

            setValidationResult(result);
            setValidationHistory(prev => [{
                ...result,
                timestamp: new Date().toLocaleTimeString('pt-BR')
            }, ...prev.slice(0, 9)]);

        } catch (error) {
            console.error("Validation error:", error);
            const errorResult = {
                success: false,
                message: `Erro ao processar validação: ${error.message}`,
                type: "error"
            };
            setValidationResult(errorResult);
            setValidationHistory(prev => [{
                ...errorResult,
                timestamp: new Date().toLocaleTimeString('pt-BR')
            }, ...prev.slice(0, 9)]);
        }
    };

    const stopScanning = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().then(() => {
                scannerRef.current = null;
                setScanning(false);
            }).catch(err => {
                console.error("Error stopping scanner:", err);
                scannerRef.current = null;
                setScanning(false);
            });
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup scanner on unmount
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    const startScanning = () => {
        setScanning(true);
        setCameraError(null);
        setValidationResult(null);
    };

    useEffect(() => {
        if (scanning && !scannerRef.current) {
            // Aguarda o próximo ciclo de renderização para garantir que o elemento existe
            setTimeout(() => {
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    disableFlip: false,
                };

                try {
                    const html5QrcodeScanner = new Html5QrcodeScanner(
                        "qr-reader",
                        config,
                        false
                    );

                    html5QrcodeScanner.render(onScanSuccess, onScanError);
                    scannerRef.current = html5QrcodeScanner;
                } catch (error) {
                    console.error("Error starting scanner:", error);
                    setCameraError("Erro ao iniciar scanner: " + error.message);
                    setScanning(false);
                }
            }, 100);
        }
    }, [scanning]);

    const resetAndScan = () => {
        setValidationResult(null);
        startScanning();
    };

    const getResultConfig = (result) => {
        if (!result) return null;

        if (result.success) {
            return {
                icon: CheckCircle2,
                color: "text-green-600",
                bg: "bg-green-50 dark:bg-green-950",
                border: "border-green-500",
                title: "✅ Ingresso Validado!"
            };
        } else {
            const configs = {
                already_validated: {
                    icon: AlertCircle,
                    color: "text-amber-600",
                    bg: "bg-amber-50 dark:bg-amber-950",
                    border: "border-amber-500",
                    title: "⚠️ Ingresso Já Validado"
                },
                wrong_event: {
                    icon: XCircle,
                    color: "text-red-600",
                    bg: "bg-red-50 dark:bg-red-950",
                    border: "border-red-500",
                    title: "❌ Evento Incorreto"
                },
                not_paid: {
                    icon: XCircle,
                    color: "text-red-600",
                    bg: "bg-red-50 dark:bg-red-950",
                    border: "border-red-500",
                    title: "❌ Ingresso Não Pago"
                },
                default: {
                    icon: XCircle,
                    color: "text-red-600",
                    bg: "bg-red-50 dark:bg-red-950",
                    border: "border-red-500",
                    title: "❌ Ingresso Inválido"
                }
            };

            return configs[result.type] || configs.default;
        }
    };

    const resultConfig = getResultConfig(validationResult);

    return (
        <PromoterLayout>
            <Head title={`Validar Ingressos - ${event.name}`} />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href={route("promoter.dashboard")}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Dashboard
                        </Button>
                    </Link>

                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <Shield className="w-8 h-8 text-primary" />
                                Validação de Ingressos
                            </h1>
                            <p className="text-muted-foreground text-lg">{event.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {event.city} - {event.state} • {new Date(event.start_date).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Scanner Section */}
                    <div className="lg:col-span-2">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="w-5 h-5" />
                                    Scanner de QR Code
                                </CardTitle>
                                <CardDescription>
                                    Posicione o QR Code do ingresso na frente da câmera
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Scanner Container */}
                                {!scanning && !validationResult && (
                                    <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                                        <Scan className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-muted-foreground mb-6">
                                            Clique no botão abaixo para iniciar a câmera
                                        </p>
                                        <Button
                                            onClick={startScanning}
                                            size="lg"
                                            className="gap-2"
                                        >
                                            <Power className="w-5 h-5" />
                                            Iniciar Scanner
                                        </Button>
                                    </div>
                                )}

                                {scanning && (
                                    <div className="space-y-4">
                                        <div
                                            id="qr-reader"
                                            className="rounded-lg overflow-hidden border-2 border-primary"
                                        />
                                        <Button
                                            onClick={stopScanning}
                                            variant="destructive"
                                            className="w-full gap-2"
                                        >
                                            <PowerOff className="w-4 h-4" />
                                            Parar Scanner
                                        </Button>
                                    </div>
                                )}

                                {/* Validation Result */}
                                {validationResult && resultConfig && (
                                    <div className="space-y-4">
                                        <Alert className={`${resultConfig.bg} border-2 ${resultConfig.border}`}>
                                            <resultConfig.icon className={`h-5 w-5 ${resultConfig.color}`} />
                                            <AlertTitle className={resultConfig.color}>
                                                {resultConfig.title}
                                            </AlertTitle>
                                            <AlertDescription className="mt-2">
                                                <p className="font-medium">{validationResult.message}</p>

                                                {validationResult.ticket && (
                                                    <div className="mt-4 space-y-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Ticket className="w-4 h-4" />
                                                            <span>Ingresso #{validationResult.ticket.id} - {validationResult.ticket.type}</span>
                                                        </div>
                                                        {validationResult.ticket.user && (
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                <span>{validationResult.ticket.user}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="w-4 h-4" />
                                                            <span>R$ {parseFloat(validationResult.ticket.price).toFixed(2)}</span>
                                                        </div>
                                                        {validationResult.ticket.validated_at && (
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>Validado em: {validationResult.ticket.validated_at}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </AlertDescription>
                                        </Alert>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={resetAndScan}
                                                className="flex-1 gap-2"
                                            >
                                                <Zap className="w-4 h-4" />
                                                Escanear Próximo
                                            </Button>
                                            <Link href={route("promoter.dashboard")} className="flex-1">
                                                <Button variant="outline" className="w-full gap-2">
                                                    <ArrowLeft className="w-4 h-4" />
                                                    Voltar
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Camera Error */}
                                {cameraError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Erro de Câmera</AlertTitle>
                                        <AlertDescription>
                                            {cameraError}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Instructions */}
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Instruções</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p>1. Clique em "Iniciar Scanner" para ativar a câmera</p>
                                <p>2. Permita o acesso à câmera quando solicitado pelo navegador</p>
                                <p>3. Posicione o QR Code do ingresso dentro do quadrado</p>
                                <p>4. Aguarde a validação automática</p>
                                <p>5. Após validar, clique em "Escanear Próximo" para continuar</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* History Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Histórico de Validações</CardTitle>
                                <CardDescription>Últimas validações realizadas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {validationHistory.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Nenhuma validação realizada ainda
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {validationHistory.map((item, index) => {
                                            const config = getResultConfig(item);
                                            const Icon = config.icon;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-3 rounded-lg border ${config.border} ${config.bg}`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium ${config.color}`}>
                                                                {item.success ? "Validado" : "Recusado"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {item.message}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {item.timestamp}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Estatísticas da Sessão</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Validado:</span>
                                    <Badge variant="default">
                                        {validationHistory.filter(v => v.success).length}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Recusados:</span>
                                    <Badge variant="destructive">
                                        {validationHistory.filter(v => !v.success).length}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Escaneado:</span>
                                    <Badge variant="secondary">
                                        {validationHistory.length}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PromoterLayout>
    );
}

