import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Ticket, MapPin, Plus, Settings, Users, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
    const { events } = usePage().props;
    console.log(events.length);
    
    // Métricas rápidas
    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === 'active').length;
    const totalTickets = events.reduce((acc, event) => acc + event.tickets.length, 0);

    return (
        <PromoterLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Painel do Promoter</h1>
                        <p className="text-muted-foreground mt-2">Gerencie seus eventos e acompanhe o desempenho</p>
                    </div>
                    <Link href={route("promoter.event.create")} className="w-full md:w-auto">
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors">
                            <Plus className="w-5 h-5" />
                            Novo Evento
                        </Button>
                    </Link>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CardMetric 
                        icon={<Ticket className="w-6 h-6" />}
                        title="Eventos Ativos"
                        value={activeEvents}
                        color="text-green-500"
                    />
                    <CardMetric 
                        icon={<Users className="w-6 h-6" />}
                        title="Total de Eventos"
                        value={totalEvents}
                        color="text-blue-500"
                    />
                    <CardMetric 
                        icon={<DollarSign className="w-6 h-6" />}
                        title="Ingressos Disponíveis"
                        value={totalTickets}
                        color="text-purple-500"
                    />
                </div>

                {/* Lista de Eventos */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-primary">Seus Eventos</h2>
                    
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                            <div className="mb-4 text-muted-foreground">
                                <Ticket className="w-12 h-12 mx-auto" />
                            </div>
                            <p className="text-muted-foreground">Nenhum evento encontrado</p>
                            <p className="text-sm text-muted-foreground mt-2">Comece criando seu primeiro evento</p>
                        </div>
                    )}
                </div>
            </div>
        </PromoterLayout>
    );
}

// Componente para Card de Métrica
const CardMetric = ({ icon, title, value, color }) => (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-opacity-10 ${color} bg-current`}>
                {icon}
            </div>
            <div>
                <p className="text-muted-foreground text-sm">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
        </div>
    </div>
);

// Componente para Card de Evento
const EventCard = ({ event }) => {
    const statusColors = {
        active: 'bg-green-500/10 text-green-500',
        draft: 'bg-yellow-500/10 text-yellow-500',
        canceled: 'bg-red-500/10 text-red-500'
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
                <img
                    src={event.image_url || '/placeholder-event.jpg'}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute top-2 right-2 ${statusColors[event.status]}`}>
                    {event.status === 'active' ? 'Ativo' : event.status === 'draft' ? 'Rascunho' : 'Cancelado'}
                </Badge>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">{event.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {format(parseISO(event.start_date), "dd MMM yyyy", { locale: ptBR })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {event.city} - {event.state}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="gap-1">
                        <Ticket className="w-4 h-4" />
                        {event.tickets.length} tipos de ingressos
                    </Badge>
                    <Link href={route("promoter.event.manage", event.id)}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Gerenciar
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};