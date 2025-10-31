import { EventHeader } from "@/Components/eventComponents/EventHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {usePage} from "@inertiajs/react";
import TicketList from "@/Components/TicketList.jsx";
import { useState } from "react";


export default function Purchase() {
    const { event, tickets, paymentForms } = usePage().props;
    const [selectedPaymentForm, setSelectedPaymentForm] = useState(paymentForms[0]?.id || null);

    const handlePaymentFormChange = (paymentFormId) => {
        setSelectedPaymentForm(paymentFormId);
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
                <EventHeader event={event} />
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary">Carrinho de Compras</h2>
                    <TicketList tickets={tickets} />
                </section>
                <div className={"flex flex-col gap-2"}>
                    <p className="text-lg font-medium mb-2">Formas de pagamento</p>
                    {paymentForms.length > 0 && (
                        <div className="space-y-2">
                            {paymentForms.map((item) => (
                                <label
                                    key={item.id}
                                    className={`flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-secondary ${selectedPaymentForm === item.id ? 'bg-secondary border-primary' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentForm"
                                        value={item.id}
                                        checked={selectedPaymentForm === item.id}
                                        onChange={() => handlePaymentFormChange(item.id)}
                                        className="mr-3 text-primary focus:ring-primary"
                                    />
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                </label>
                            ))}</div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
