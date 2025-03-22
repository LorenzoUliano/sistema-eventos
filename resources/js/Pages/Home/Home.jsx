import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EventCard from "@/Components/EventCard";
import Filtro from "./Components/Filtro";

export default function Home() {
    const { auth, companies } = usePage().props; // Alterado para receber os eventos agrupados

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setDate("");
    };

    // Função para filtrar eventos
    const filteredEvents = (events) => {
        return events.filter(event => {
            return (
                (search === "" || event.name.toLowerCase().includes(search.toLowerCase())) &&
                (location === "" || event.city.toLowerCase().includes(location.toLowerCase())) &&
                (date === "" || event.start_date.startsWith(date))
            );
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Eventos Disponíveis" />

            {/* Seção Hero */}
            <div className="relative overflow-hidden mb-10 min-h-[300px]">
                {/* Fundo da imagem com filtro */}
                <div
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat bg-fixed"
                    style={{
                        backgroundImage: `url('/fundo.jpg')`,
                        filter: 'brightness(0.4) blur(2px)',
                    }}
                />

                {/* Camada de conteúdo sobreposta */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full min-h-[300px] px-4 md:px-8 text-center bg-card/10 backdrop-blur-md border border-border shadow-md transition-colors">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                        Descubra Eventos Incríveis Perto de Você
                    </h1>
                    <p className="mt-4 text-white/60 text-lg md:text-xl max-w-2xl">
                        Explore, participe e viva experiências únicas com praticidade e segurança.
                    </p>
                </div>
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

                {/* Exibindo empresas e seus eventos */}
                {companies.map((company) => (
                    <div key={company.id} className="mb-8 bg-card p-6 rounded-lg shadow-md border border-border">
                        {/* Informações da Empresa */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-primary">{company.name}</h2>
                                <p className="text-primary">CNPJ: {company.cnpj}</p>
                                <p className="text-primary">Contato: {company.phone}</p>
                                <p className="text-primary">{company.email}</p>
                            </div>
                            <img
                                src={`https://via.placeholder.com/150?text=${company.name[0]}`} // Placeholder para logo
                                alt={company.name}
                                className="h-20 w-20 object-cover rounded-full"
                            />
                        </div>

                        {/* Separador entre informações e eventos */}
                        <div className="border-b border-border mb-4"></div>

                        {/* Lista de eventos da empresa */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {filteredEvents(company.events).length > 0 ? (
                                filteredEvents(company.events).map((event) => (
                                    <EventCard key={event.id} event={event} company={company} />
                                ))
                            ) : (
                                <p className="text-center text-gray-600 mt-10">Nenhum evento encontrado para esta empresa.</p>
                            )}
                        </div>

                        {/* Botão "Ver mais" para carregar todos os eventos da empresa */}
                        {company.events.length === 3 && (
                            <div className="mt-4 text-center">
                                <a href={`/company/${company.id}/events`}>
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                                        Ver mais eventos
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
