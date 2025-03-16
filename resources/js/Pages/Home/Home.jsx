import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaTimes } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Home() {
    const { auth, events } = usePage().props;
    
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    // Função para limpar os filtros
    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setDate("");
    };

    // Filtra os eventos de acordo com os filtros aplicados
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
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Filtrar Eventos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Nome do Evento */}
                        <div>
                            <Label className="flex items-center pb-1">
                                <FaSearch className="mr-1 text-gray-500" /> Nome do Evento
                            </Label>
                            <Input 
                                type="text" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                placeholder="Buscar evento..."
                                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        
                        {/* Localização */}
                        <div>
                            <Label className="flex items-center pb-1">
                                <FaMapMarkerAlt className="mr-1 text-gray-500" /> Localização
                            </Label>
                            <Input 
                                type="text" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                placeholder="Digite a cidade..."
                                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>

                        {/* Data */}
                        <div>
                            <Label className="flex items-center pb-1">
                                <FaCalendarAlt className="mr-1 text-gray-500" /> Data
                            </Label>
                            <Input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>

                    {/* Botão Limpar Filtros */}
                    <div className="mt-4 flex justify-end">
                        <Button 
                            onClick={clearFilters} 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center"
                        >
                            <FaTimes /> Limpar Filtros
                        </Button>
                    </div>
                </div>

                {/* Lista de eventos */}
                <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
                    {auth.user ? `Bem-vindo, ${auth.user.name}!` : "Descubra os Melhores Eventos"}
                </h2>

                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden shadow-lg rounded-lg bg-white transition-transform transform hover:scale-105">
                                <img src={event.image_url} 
                                     alt={event.name} 
                                     className="w-full h-56 object-cover object-center" />
                                <CardHeader className="p-4">
                                    <CardTitle className="text-xl font-semibold text-gray-900">{event.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 text-gray-700">
                                    <p><strong>📅 Data:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
                                    <p><strong>📍 Local:</strong> {event.location}, {event.city} - {event.state}</p>
                                    <p className="mt-2">{event.description}</p>
                                    <Link href={`/event/${event.id}`}>
                                        <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                            Ver Detalhes
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-10">Nenhum evento encontrado com os filtros aplicados.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
