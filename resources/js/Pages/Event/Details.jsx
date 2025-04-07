import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { EventHeader } from "@/Components/eventComponents/EventHeader";
import { EventDetailsCard } from "@/Components/eventComponents/EventDetailsCard";
import { TicketCard } from "@/Components/eventComponents/TicketCard";


export default function EventDetails() {
    const { event } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
                <EventHeader event={event} />

                <EventDetailsCard event={event} />

                {/* Seção de Galeria (opcional) */}
                {/* <EventGallery images={[event.image_url]} /> */}

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary">Ingressos Disponíveis</h2>
                    {event.tickets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {event.tickets.map(ticket => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card rounded-xl">
                            <p className="text-muted-foreground text-lg">
                                Nenhum ingresso disponível no momento
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}