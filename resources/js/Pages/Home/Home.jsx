import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Home() {
    const { auth, events } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Eventos Disponíveis" />

            <div className="mt-20 p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
                    {auth.user ? `Bem-vindo, ${auth.user.name}!` : "Descubra os Melhores Eventos"}
                </h1>

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <Card key={event.id} className="overflow-hidden shadow-lg rounded-lg bg-white transition-transform transform hover:scale-105">
                                <img src={event.image_url} alt={event.name} className="w-full h-48 object-cover" />
                                <CardHeader className="p-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">{event.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 text-gray-700">
                                    <p><strong>📅 Data:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
                                    <p><strong>📍 Local:</strong> {event.location}, {event.city} - {event.state}</p>
                                    <p className="mt-2">{event.description}</p>
                                    <Link href={`/event/${event.id}`}>
                                        <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Ver Detalhes</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-10">Nenhum evento disponível no momento.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
