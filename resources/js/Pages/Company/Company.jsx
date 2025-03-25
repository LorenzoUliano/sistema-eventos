import React from 'react';
import {Link} from "@inertiajs/react";
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import EventCard from "@/Components/EventCard.jsx";

export default function Company({ company }) {

    console.log(company); // Você pode usar isso para inspecionar os dados da empresa no console

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-background text-foreground dark:bg-darkGray dark:text-textLight">
                {/* Informações da Empresa */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-card dark:bg-darkCard shadow-lg rounded-lg p-6 mb-6 border border-border dark:border-gray-600">
                        <h1 className="text-3xl font-bold text-primary dark:text-primaryForeground">{company.name}</h1>
                        <p className="text-lg text-muted-foreground dark:text-muted-foreground">{company.cnpj}</p>
                        <p className="text-lg text-muted-foreground dark:text-muted-foreground">{company.email}</p>
                        <p className="text-lg text-muted-foreground dark:text-muted-foreground">{company.phone}</p>
                    </div>
                </div>

                {/* Lista de Eventos da Empresa */}
                <div className="max-w-7xl mx-auto p-6">
                    <h2 className="text-2xl font-semibold text-primary dark:text-primaryForeground mb-4">Eventos da Empresa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {company.events.length > 0 ? (
                            company.events.map((event) => (
                                <EventCard key={event.id} event={event} company={company} />
                            ))
                        ) : (
                            <p className="text-lg text-muted-foreground dark:text-muted-foreground">Nenhum evento encontrado para esta empresa.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
