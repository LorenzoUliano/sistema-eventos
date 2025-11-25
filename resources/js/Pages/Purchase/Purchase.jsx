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

    const handlePaymentFormChange = (paymentFormId) => {
        setSelectedPaymentForm(paymentFormId);
    };

    const calculateTotal = () => {
        return tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
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
            setQrCode(response.data.qrCode);
            setPaymentId(response.data.id);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao gerar QR code: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
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
                        <section className="space-y-2">
                            <h3 className="text-xl font-semibold">Formas de pagamento</h3>

                            {paymentForms.length > 0 ? (
                                <RadioGroup
                                    value={selectedPaymentForm}
                                    onValueChange={handlePaymentFormChange}
                                    className="grid md:grid-cols-2 gap-3"
                                >
                                    {paymentForms.map((item) => (
                                        <Card
                                            key={item.id}
                                            className={`p-4 border cursor-pointer transition-all duration-200 ${
                                                selectedPaymentForm === item.id
                                                    ? "border-primary bg-secondary/50"
                                                    : "hover:bg-muted"
                                            }`}
                                            onClick={() => handlePaymentFormChange(item.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem
                                                    value={item.id}
                                                    id={`payment-${item.id}`}
                                                    className="text-primary"
                                                />
                                                <Label
                                                    htmlFor={`payment-${item.id}`}
                                                    className="text-lg font-medium cursor-pointer"
                                                >
                                                    {item.name}
                                                </Label>
                                            </div>
                                        </Card>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhuma forma de pagamento disponível.</p>
                            )}
                        </section>

                        <section className="flex gap-4 justify-end">
                            <Button
                                className="md:w-36 w-full"
                                variant="outline"
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
                                    "PIX"
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
                    <QrCodeDisplay qrCode={qrCode} amount={calculateTotal()} paymentId={paymentId} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
