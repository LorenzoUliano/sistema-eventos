import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Loader2, Check, Copy } from 'lucide-react';

export default function QrCodeDisplay({ qrCode, amount, paymentId }) {
    const [scanned, setScanned] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    const scanUrl = qrCode; // ja e a URL /api/pix/payments/{id}/scan

    const handleSimulateScan = async () => {
        setProcessing(true);
        try {
            const response = await axios.get(scanUrl);
            if (response.data.status === 'paid' || response.data.status === 'already_paid') {
                setScanned(true);
                setTimeout(() => {
                    window.location.href = '/orders/' + response.data.order.id;
                }, 1500);
            } else {
                alert('Falha ao confirmar pagamento');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar pagamento: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessing(false);
        }
    };

    const handleManualConfirm = async (e) => {
        if (e.key !== 'Enter') return;
        setProcessing(true);
        try {
            const response = await axios.post(`/api/pix/payments/${paymentId}/confirm`);
            if (response.data.status === 'paid' || response.data.status === 'already_paid') {
                setScanned(true);
                setTimeout(() => {
                    window.location.href = '/orders/' + response.data.order.id;
                }, 1500);
            } else {
                alert('Falha ao confirmar pagamento');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar pagamento: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessing(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(scanUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    return (
        <Card className="p-6 space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Escaneie o QR Code do PIX</h2>
                <p className="text-sm text-muted-foreground">Ao validar, criaremos sua ordem automaticamente.</p>
            </div>

            {scanned ? (
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <Check className="h-5 w-5" /> Pagamento confirmado!
                    </div>
                    <p className="text-sm text-muted-foreground">Redirecionando para seus pedidos...</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="flex justify-center p-6 bg-muted rounded">
                        <QRCodeSVG value={qrCode} size={256} level="H" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-sm">Valor</Label>
                            <div className="text-lg font-medium">R$ {amount.toFixed(2)}</div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">URL do QR</Label>
                            <div className="flex items-center gap-2">
                                <Input readOnly value={scanUrl} className="flex-1" />
                                <Button variant="outline" onClick={handleCopy} disabled={copied}>
                                    {copied ? (<><Check className="h-4 w-4 mr-1" /> Copiado</>) : (<><Copy className="h-4 w-4 mr-1" /> Copiar</>)}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Você pode abrir essa URL no navegador para simular a leitura.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={handleSimulateScan} disabled={processing} className="sm:w-40">
                                {processing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validando...</>) : 'Simular leitura'}
                            </Button>
                            <Input placeholder="Ou cole o código PIX aqui e pressione Enter" onKeyDown={handleManualConfirm} disabled={processing} />
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
