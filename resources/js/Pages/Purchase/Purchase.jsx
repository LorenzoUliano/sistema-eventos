import { EventHeader } from "@/Components/eventComponents/EventHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import TicketList from "@/Components/TicketList.jsx";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button.jsx";
import { Loader2 } from "lucide-react";
import axios from "axios";
import QrCodeDisplay from '@/Components/QrCodeDisplay';

export default function Purchase() {
    const { event, tickets, paymentForms, auth } = usePage().props;
    const [selectedPaymentForm, setSelectedPaymentForm] = useState(paymentForms[0]?.id || null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null);

    // Chave única para o sessionStorage baseada no evento e usuário
    const storageKey = `pix_payment_${event.id}_${auth.user.id}`;

    // Recuperar QR Code do sessionStorage ao carregar a página
    useState(() => {
        const savedPayment = sessionStorage.getItem(storageKey);
        if (savedPayment) {
            try {
                const payment = JSON.parse(savedPayment);
                // Verifica se o pagamento não expirou
                if (payment.expiresAt && new Date(payment.expiresAt) > new Date()) {
                    setQrCode(payment.qrCode);
                    setPaymentId(payment.paymentId);
                    setExpiresAt(payment.expiresAt);
                } else {
                    // Remove se expirou
                    sessionStorage.removeItem(storageKey);
                }
            } catch (e) {
                console.error('Erro ao recuperar pagamento salvo:', e);
                sessionStorage.removeItem(storageKey);
            }
        }
    }, []);

    const handlePaymentFormChange = (paymentFormId) => {
        setSelectedPaymentForm(paymentFormId);
    };

    const calculateTotal = () => {
        return tickets.reduce((sum, ticket) => sum + (ticket.line_total ?? (ticket.price * ticket.quantity)), 0);
    };

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(route("payment.create"), {
                event_id: event.id,
                payment_form_id: selectedPaymentForm,
                tickets: tickets
            });

            if (response.data.redirect_url) {
                window.location.href = response.data.redirect_url;
            }
        } catch (error) {
            console.error("Erro ao processar pagamento:", error);
            alert("Erro ao processar pagamento. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateQrCode = async () => {
        setLoading(true);
        const purchaseData = {
            userId: auth.user.id,
            eventId: event.id,
            tickets: tickets.map(ticket => ({
                ticketTypeId: ticket.id,
                quantity: ticket.quantity,
                price: ticket.price,
            })),
        };
        const totalAmount = calculateTotal();
        try {
            const response = await axios.post('/api/pix/payments', {
                amount: totalAmount,
                purchaseData: purchaseData,
            });

            const paymentData = {
                qrCode: response.data.qrCode,
                paymentId: response.data.id,
                expiresAt: response.data.expiresAt,
            };

            // Salva no state
            setQrCode(paymentData.qrCode);
            setPaymentId(paymentData.paymentId);
            setExpiresAt(paymentData.expiresAt);

            // Salva no sessionStorage
            sessionStorage.setItem(storageKey, JSON.stringify(paymentData));
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao gerar QR code: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Função para limpar o QR Code (chamada quando o pagamento é confirmado ou expira)
    const clearQrCode = () => {
        setQrCode(null);
        setPaymentId(null);
        setExpiresAt(null);
        sessionStorage.removeItem(storageKey);
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 space-y-12 pb-4">
                <EventHeader event={event} />

                <section className="space-y-2">
                    <h2 className="text-3xl font-bold text-primary">Carrinho de Compras</h2>
                    <TicketList tickets={tickets} />
                </section>

                {!qrCode ? (
                    <>
                        <section className="flex gap-4 justify-end">
                            <Button
                                className=" w-full"
                                variant="secondary"
                                size="lg"
                                onClick={handleGenerateQrCode}
                                disabled={loading || tickets.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    "Finalizar compra com PIX"
                                )}
                            </Button>
                            {/* Botão de outra forma de pagamento fica visível somente se forma selecionada não for PIX */}
                            {selectedPaymentForm && paymentForms.find(p => p.id === selectedPaymentForm && p.name.toLowerCase() !== 'pix') && (
                                <Button
                                    className="md:w-36 w-full"
                                    variant="secondary"
                                    size="lg"
                                    onClick={handlePurchase}
                                    disabled={isLoading || tickets.length === 0}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processando...
                                        </>
                                    ) : (
                                        "Finalizar"
                                    )}
                                </Button>
                            )}
                        </section>
                    </>
                ) : (
                    <QrCodeDisplay
                        qrCode={qrCode}
                        amount={calculateTotal()}
                        paymentId={paymentId}
                        expiresAt={expiresAt}
                        onPaymentConfirmed={clearQrCode}
                        onExpired={clearQrCode}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
