import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import PromoterLayout from "@/Layouts/PromoterLayout";

export default function Dashboard() {
    const { events } = usePage().props;

    return (
        <PromoterLayout>
            <h1 className="text-3xl font-semibold text-primary mb-8">Seus Eventos</h1>
            <Link href={route("promoter.event.create")}>
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                    Criar Novo Evento
                </Button>
            </Link>

            {/* Lista de eventos */}
            {events.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="bg-card shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-2xl transform hover:scale-105">
                            <h2 className="text-2xl font-semibold text-primary mb-2">{event.name}</h2>
                            <p className="text-primary text-sm">{event.description}</p>
                            <p className="text-primary mt-3">
                                📍 {event.location}, {event.city} - {event.state}
                            </p>
                            <p className="text-gray-500">📅 {new Date(event.start_date).toLocaleDateString()}</p>
                            <Link href={route("promoter.event.manage", event.id)}>
                                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                                    Gerenciar Evento
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-6">Você ainda não tem eventos cadastrados.</p>
            )}
        </PromoterLayout>
    );
}
