import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventCard({ event, company }) {

    console.log(event);

    return (
        <Link href={`/event/${event.id}`} className="block">
            <Card className="overflow-hidden shadow-lg rounded-lg bg-backgroundb transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-56 object-cover object-center"
                />
                <CardHeader className="px-4 py-2">
                    <CardTitle className="text-xl font-semibold text-primary">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2 text-primary">
                    <p><strong>📅 Data:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
                    <p><strong>📍 Local:</strong> {event.location}, {event.city} - {event.state}</p>
                    <p className="mt-2">{event.description}</p>

                    {/* Informações da Empresa */}
                    <div className="mt-2">
                        <p><strong>Empresa:</strong> {company.name}</p>
                        <p><strong>CNPJ:</strong> {company.cnpj}</p>
                        <p><strong>Contato:</strong> {company.phone}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
