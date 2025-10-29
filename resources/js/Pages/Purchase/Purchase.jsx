import { EventHeader } from "@/Components/eventComponents/EventHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {usePage} from "@inertiajs/react";
import TicketList from "@/Components/TicketList.jsx";


export default function Purchase() {
    const { event, tickets } = usePage().props;

    console.log(tickets)
    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
                <EventHeader event={event} />
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary">Carrinho de Compras</h2>
                    <TicketList tickets={tickets} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
