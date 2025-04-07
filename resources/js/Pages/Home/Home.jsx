import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { HeroSection } from "@/Components/homeComponents/HeroSection";
import { EventFilters } from "@/Components/homeComponents/EventFilters";
import { CompanyCard } from "@/Components/homeComponents/CompanyCard";
import { EventCard } from "@/Components/EventCard";

export default function Home() {
    const { companies } = usePage().props;
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    const filteredEvents = (events) => events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase());
        const matchesLocation = event.city.toLowerCase().includes(location.toLowerCase());
        
        // Converter datas para comparar apenas o dia
        const eventDate = new Date(event.start_date);
        const selectedDate = date ? new Date(date) : null;
        
        // Formatar datas para YYYY-MM-DD para comparação
        const eventDateStr = eventDate.toISOString().split('T')[0];
        const selectedDateStr = selectedDate?.toISOString().split('T')[0];
        
        const matchesDate = !date || eventDateStr === selectedDateStr;
    
        return matchesSearch && matchesLocation && matchesDate;
    });


    console.log(date);
    
    return (
        <AuthenticatedLayout>
            <Head title="Eventos Incríveis" />
            
            <HeroSection />
            
            <div className="container m-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                <EventFilters
                    search={search}
                    setSearch={setSearch}
                    location={location}
                    setLocation={setLocation}
                    date={date}
                    setDate={setDate}
                    clearFilters={() => {
                        setSearch("");
                        setLocation("");
                        setDate("");
                    }}
                />

                <div className="space-y-16">
                    {companies.map((company) => (
                        <CompanyCard key={company.id} company={company}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents(company.events).map(event => (
                                    <EventCard
                                        key={event.id} 
                                        event={event} 
                                        company={company} 
                                    />
                                ))}
                                
                                {filteredEvents(company.events).length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-muted-foreground text-lg">
                                            Nenhum evento encontrado para os filtros selecionados
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CompanyCard>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}