import React from 'react';
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { EventCard } from '@/Components/EventCard';
import { Building2, Mail, Phone, ClipboardList, CalendarDays } from 'lucide-react';
import { Badge } from "@/Components/ui/badge";

export default function Company({ company }) {
    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-background text-foreground">
                {/* Header da Empresa */}
                <div className="relative bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className="w-32 h-32 rounded-xl border-2 border-primary/20 overflow-hidden shadow-lg">
                                <img
                                    src={company.logo_url}
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="space-y-2 flex-1">
                                <h1 className="text-4xl font-bold text-primary">{company.name}</h1>
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                    <ClipboardList className="w-4 h-4 mr-2" />
                                    CNPJ: {company.cnpj}
                                </Badge>
                                
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <a
                                        href={`mailto:${company.email}`}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                        <span className="font-medium">{company.email}</span>
                                    </a>
                                    
                                    <a
                                        href={`tel:${company.phone}`}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span className="font-medium">{company.phone}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Eventos */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <CalendarDays className="w-8 h-8" />
                            Eventos Organizados
                        </h2>
                        <Badge variant="outline" className="text-primary border-primary">
                            {company.events.length} eventos encontrados
                        </Badge>
                    </div>

                    {company.events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {company.events.map((event) => (
                                <EventCard 
                                    key={event.id} 
                                    event={event} 
                                    company={company} 
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <div className="text-muted-foreground space-y-4">
                                <Building2 className="w-12 h-12 mx-auto" />
                                <p className="text-xl font-medium">
                                    Nenhum evento encontrado para esta empresa
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}