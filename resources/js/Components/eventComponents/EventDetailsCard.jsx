import React from "react";
import { CalendarDays, MapPin, Building2, Mail, Phone } from "lucide-react";

export const EventDetailsCard = ({ event }) => {
    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className="bg-card p-8 rounded-2xl shadow-theme">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Localização</h3>
                            <p className="text-muted-foreground">
                                {event.location}, {event.city} - {event.state}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Data do Evento</h3>
                            <p className="text-muted-foreground">
                                {formatDate(event.start_date)} até<br />
                                {formatDate(event.end_date)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Organizador</h3>
                            <p className="text-muted-foreground">{event.company.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-primary" />
                        <p className="text-muted-foreground">{event.company.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6 text-primary" />
                        <p className="text-muted-foreground">{event.company.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};