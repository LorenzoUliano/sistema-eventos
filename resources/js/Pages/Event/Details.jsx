import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function EventDetails() {
    const { event } = usePage().props;
    console.log(event);
    
    return (
        <AuthenticatedLayout>
            <Head title={event.name} />

            <div className="mt-20 p-6 max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800">{event.name}</h1>
                <p className="text-lg text-gray-600 mt-2">{event.description}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <img src={event.image_url} alt={event.name} className="w-full h-96 object-cover rounded-lg shadow-md" />
                    <div>
                        <p><strong>📍 Local:</strong> {event.location}, {event.city} - {event.state}</p>
                        <p><strong>📅 Data:</strong> {new Date(event.start_date).toLocaleDateString()} até {new Date(event.end_date).toLocaleDateString()}</p>
                        <p><strong>🏢 Organizado por:</strong> {event.company.name}</p>
                        <p><strong>📧 Contato:</strong> {event.company.email}</p>
                        <p><strong>📞 Telefone:</strong> {event.company.phone}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">Ingressos Disponíveis</h2>
                
                {event.tickets.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {event.tickets.map(ticket => (
                            <Card key={ticket.id} className="shadow-lg rounded-lg bg-white">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">{ticket.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 text-gray-700">
                                    <p><strong>💰 Preço:</strong> R$ {parseFloat(ticket.price).toFixed(2)}</p>
                                    <p><strong>🎟️ Disponíveis:</strong> {ticket.limit}</p>
                                    <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                        Comprar Ingresso
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 mt-6">Nenhum ingresso disponível para este evento.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
