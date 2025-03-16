import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EventCard from "@/Components/EventCard";
import Filtro from "./Components/Filtro";

export default function Home() {
    const { auth, events } = usePage().props;

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setDate("");
    };

    const filteredEvents = events.filter(event => {
        return (
            (search === "" || event.name.toLowerCase().includes(search.toLowerCase())) &&
            (location === "" || event.city.toLowerCase().includes(location.toLowerCase())) &&
            (date === "" || event.start_date.startsWith(date))
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title="Eventos Disponíveis" />

            {/* Seção Hero */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center">
                <h1 className="text-4xl font-extrabold">Descubra Eventos Incríveis Perto de Você</h1>
                <p className="text-lg mt-2">Explore, participe e viva experiências únicas!</p>
            </div>

            <div className="mt-10 p-6 max-w-7xl mx-auto">
                {/* Card de Filtros */}
                <Filtro 
                    search={search}
                    setSearch={setSearch}
                    location={location}
                    setLocation={setLocation}
                    clearFilters={clearFilters}
                />

                {/* Lista de eventos */}
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} /> // ⬅ Agora usamos o novo componente
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-10">Nenhum evento encontrado com os filtros aplicados.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
