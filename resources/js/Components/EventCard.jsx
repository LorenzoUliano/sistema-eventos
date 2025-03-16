import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventCard({ event }) {
    return (
        <Link href={`/event/${event.id}`} className="block">
            <Card className="overflow-hidden shadow-lg rounded-lg bg-white transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <img 
                    src={event.image_url} 
                    alt={event.name} 
                    className="w-full h-56 object-cover object-center"
                />
                <CardHeader className="p-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-gray-700">
                    <p><strong>📅 Data:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
                    <p><strong>📍 Local:</strong> {event.location}, {event.city} - {event.state}</p>
                    <p className="mt-2">{event.description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
