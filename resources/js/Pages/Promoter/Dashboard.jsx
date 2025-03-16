import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import PromoterLayout from "@/Layouts/PromoterLayout";

export default function Dashboard() {
    const { events } = usePage().props;

    return (
        <PromoterLayout>
            <h1 className="text-2xl font-bold text-gray-800">Seus Eventos</h1>
            <Link href={route("promoter.event.create")}>
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                    Criar Novo Evento
                </Button>
            </Link>

            {/* Lista de eventos */}
            {events.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold">{event.name}</h2>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="text-gray-500 mt-2">
                                📍 {event.location}, {event.city} - {event.state}
                            </p>
                            <p className="text-gray-500">📅 {new Date(event.start_date).toLocaleDateString()}</p>
                            <Link href={route("promoter.event.manage", event.id)}>
                                <Button className="mt-4 w-full">Gerenciar Evento</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 mt-6">Você ainda não tem eventos cadastrados.</p>
            )}
        </PromoterLayout>
    );
}
