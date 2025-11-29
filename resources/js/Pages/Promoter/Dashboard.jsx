import React, { useState } from "react";
import {Head, Link, usePage} from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/Components/ui/dialog";
import {
    CalendarDays,
    Ticket,
    MapPin,
    Plus,
    Settings,
    Users,
    DollarSign,
    Eye,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ScanLine
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
    const { events } = usePage().props;

    // Métricas gerais
    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === 'active').length;
    const inactiveEvents = events.filter(e => e.status === 'inactive').length;
    const canceledEvents = events.filter(e => e.status === 'canceled').length;

    // Métricas de ingressos
    const totalTicketTypes = events.reduce((acc, event) => acc + event.tickets.length, 0);
    const totalTicketsAvailable = events.reduce((acc, event) => {
        return acc + event.tickets.reduce((sum, ticket) => sum + (parseInt(ticket.quantity) || 0), 0);
    }, 0);
    const totalTicketsSold = events.reduce((acc, event) => {
        return acc + event.tickets.reduce((sum, ticket) => sum + (parseInt(ticket.sold) || 0), 0);
    }, 0);
    const totalTicketsValidated = events.reduce((acc, event) => {
        return acc + event.tickets.reduce((sum, ticket) => sum + (parseInt(ticket.validated) || 0), 0);
    }, 0);

    // Métricas financeiras
    const totalRevenue = events.reduce((acc, event) => {
        return acc + event.tickets.reduce((sum, ticket) => {
            const sold = parseInt(ticket.sold) || 0;
            const price = parseFloat(ticket.price) || 0;
            return sum + (sold * price);
        }, 0);
    }, 0);

    const potentialRevenue = events.reduce((acc, event) => {
        return acc + event.tickets.reduce((sum, ticket) => {
            const quantity = parseInt(ticket.quantity) || 0;
            const price = parseFloat(ticket.price) || 0;
            return sum + (quantity * price);
        }, 0);
    }, 0);

    const salesRate = totalTicketsAvailable > 0 ? ((totalTicketsSold / totalTicketsAvailable) * 100).toFixed(1) : 0;
    const validationRate = totalTicketsSold > 0 ? ((totalTicketsValidated / totalTicketsSold) * 100).toFixed(1) : 0;

    // Próximos eventos
    const upcomingEvents = events
        .filter(e => new Date(e.start_date) >= new Date() && e.status === 'active')
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 3);

    return (
        <PromoterLayout>
            <Head title={"Dashboard"}/>

            <div className="space-y-8">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-secondary shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Painel do Promoter</h1>
                            <p className="text-secondary/90 text-sm md:text-base">
                                Gerencie seus eventos e acompanhe o desempenho em tempo real
                            </p>
                        </div>
                        <Link href={route("promoter.event.create")} className="w-full md:w-auto">
                            <Button className="gap-2 bg-white text-secondary hover:bg-white/90 shadow-md w-full md:w-auto">
                                <Plus className="w-5 h-5" />
                                Novo Evento
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Estatísticas Principais */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Visão Geral</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CardMetric
                            icon={<Ticket className="w-6 h-6" />}
                            title="Eventos Ativos"
                            value={activeEvents}
                            subtitle={`${totalEvents} total`}
                            color="text-green-500"
                            bgColor="bg-green-500/10"
                        />
                        <CardMetric
                            icon={<Users className="w-6 h-6" />}
                            title="Ingressos Vendidos"
                            value={totalTicketsSold}
                            subtitle={`de ${totalTicketsAvailable} disponíveis`}
                            color="text-blue-500"
                            bgColor="bg-blue-500/10"
                        />
                        <CardMetric
                            icon={<CheckCircle2 className="w-6 h-6" />}
                            title="Pessoas que Entraram"
                            value={totalTicketsValidated}
                            subtitle={`${validationRate}% dos vendidos`}
                            color="text-purple-500"
                            bgColor="bg-purple-500/10"
                        />
                        <CardMetric
                            icon={<DollarSign className="w-6 h-6" />}
                            title="Receita Total"
                            value={`R$ ${(totalRevenue / 1000).toFixed(1)}k`}
                            subtitle={`de R$ ${(potentialRevenue / 1000).toFixed(1)}k possível`}
                            color="text-amber-500"
                            bgColor="bg-amber-500/10"
                        />
                    </div>
                </div>

                {/* Performance e Próximos Eventos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Performance
                            </h3>
                            <div className="space-y-4">
                                {/* Taxa de Vendas */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Taxa de Vendas</span>
                                        <span className="font-semibold text-primary">{salesRate}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all"
                                            style={{ width: `${salesRate}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {totalTicketsSold} vendidos de {totalTicketsAvailable}
                                    </p>
                                </div>

                                {/* Taxa de Entrada */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Taxa de Entrada</span>
                                        <span className="font-semibold text-blue-600">{validationRate}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
                                            style={{ width: `${validationRate}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {totalTicketsValidated} entraram de {totalTicketsSold} vendidos
                                    </p>
                                </div>

                                {/* Status dos Eventos */}
                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm font-medium text-foreground mb-3">Status dos Eventos</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                Ativos
                                            </span>
                                            <span className="font-semibold">{activeEvents}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-amber-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                Inativos
                                            </span>
                                            <span className="font-semibold">{inactiveEvents}</span>
                                        </div>
                                        {canceledEvents > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-red-600 flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                    Cancelados
                                                </span>
                                                <span className="font-semibold">{canceledEvents}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Próximos Eventos */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-primary" />
                                Próximos Eventos
                            </h3>
                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingEvents.map((event) => {
                                        const daysUntil = differenceInDays(parseISO(event.start_date), new Date());
                                        const sold = event.tickets.reduce((sum, t) => sum + (parseInt(t.sold) || 0), 0);
                                        const total = event.tickets.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);
                                        const percentage = total > 0 ? ((sold / total) * 100).toFixed(0) : 0;

                                        return (
                                            <div key={event.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-foreground">{event.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(parseISO(event.start_date), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                                                        </p>
                                                    </div>
                                                    <Badge variant={daysUntil === 0 ? "default" : "secondary"}>
                                                        {daysUntil === 0 ? "Hoje!" : `${daysUntil} dias`}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <MapPin className="w-4 h-4" />
                                                        {event.city} - {event.state}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Ticket className="w-4 h-4" />
                                                        {sold}/{total} ({percentage}%)
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Nenhum evento ativo agendado</p>
                                </div>
                            )}
                        </div>
                    </div>
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
const CardMetric = ({ icon, title, value, subtitle, color, bgColor }) => (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all hover:scale-105 duration-200">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${bgColor}`}>
                <div className={color}>
                    {icon}
                </div>
            </div>
        </div>
        <div>
            <p className="text-muted-foreground text-sm mb-1">{title}</p>
            <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
            {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
        </div>
    </div>
);

// Componente para Card de Evento
const EventCard = ({ event }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const statusColors = {
        active: 'bg-green-500/10 text-green-500',
        draft: 'bg-yellow-500/10 text-yellow-500',
        canceled: 'bg-red-500/10 text-red-500',
        inactive: 'bg-gray-500/10 text-gray-500'
    };

    // Calcular estatísticas com validação de números
    const totalTickets = event.tickets.reduce((acc, ticket) => {
        const quantity = parseInt(ticket.quantity) || 0;
        return acc + quantity;
    }, 0);

    const soldTickets = event.tickets.reduce((acc, ticket) => {
        const sold = parseInt(ticket.sold) || 0;
        return acc + sold;
    }, 0);

    const availableTickets = Math.max(0, totalTickets - soldTickets);

    const totalRevenue = event.tickets.reduce((acc, ticket) => {
        const sold = parseInt(ticket.sold) || 0;
        const price = parseFloat(ticket.price) || 0;
        return acc + (sold * price);
    }, 0);

    const potentialRevenue = event.tickets.reduce((acc, ticket) => {
        const quantity = parseInt(ticket.quantity) || 0;
        const price = parseFloat(ticket.price) || 0;
        return acc + (quantity * price);
    }, 0);

    const salesPercentage = totalTickets > 0 ? ((soldTickets / totalTickets) * 100).toFixed(1) : "0.0";
    const daysUntilEvent = differenceInDays(parseISO(event.start_date), new Date());

    // Calcular ingressos validados (pessoas que entraram)
    const validatedTickets = event.tickets.reduce((acc, ticket) => {
        const validated = parseInt(ticket.validated) || 0;
        return acc + validated;
    }, 0);

    const validationPercentage = soldTickets > 0 ? ((validatedTickets / soldTickets) * 100).toFixed(1) : "0.0";

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
                <img
                    src={event.image_url || '/placeholder-event.jpg'}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute top-2 right-2 ${statusColors[event.status]}`}>
                    {event.status === 'active' ? 'Ativo' :
                     event.status === 'draft' ? 'Rascunho' :
                     event.status === 'inactive' ? 'Inativo' : 'Cancelado'}
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
                            {format(parseISO(event.start_date), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {event.city} - {event.state}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="gap-1">
                        <Ticket className="w-4 h-4" />
                        {event.tickets.length} tipos
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Users className="w-4 h-4" />
                        {soldTickets}/{totalTickets}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" size="sm" className="gap-2 flex-1">
                                <Eye className="w-4 h-4" />
                                Detalhes
                            </Button>
                        </DialogTrigger>
                        <EventDetailsModal event={event} stats={{
                            totalTickets,
                            soldTickets,
                            availableTickets,
                            totalRevenue,
                            potentialRevenue,
                            salesPercentage,
                            daysUntilEvent,
                            validatedTickets,
                            validationPercentage
                        }} />
                    </Dialog>

                    <Link href={route("promoter.event.manage", event.id)}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Editar
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Componente Modal de Detalhes do Evento
const EventDetailsModal = ({ event, stats }) => {
    const statusConfig = {
        active: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Ativo' },
        inactive: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Inativo' },
        canceled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelado' },
        draft: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Rascunho' },
    };

    const status = statusConfig[event.status] || statusConfig.active;
    const StatusIcon = status.icon;

    return (
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl">{event.name}</DialogTitle>
                <DialogDescription>
                    Visualize todas as informações e estatísticas do evento
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                {/* Imagem do Evento */}
                {event.image_url && (
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                        <img
                            src={event.image_url}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${status.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status do Evento</p>
                        <p className={`font-semibold ${status.color}`}>{status.label}</p>
                    </div>
                </div>

                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                    <InfoItem
                        icon={<CalendarDays className="w-5 h-5" />}
                        label="Data de Início"
                        value={format(parseISO(event.start_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    />
                    <InfoItem
                        icon={<CalendarDays className="w-5 h-5" />}
                        label="Data de Término"
                        value={format(parseISO(event.end_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    />
                    <InfoItem
                        icon={<MapPin className="w-5 h-5" />}
                        label="Local"
                        value={event.location}
                    />
                    <InfoItem
                        icon={<MapPin className="w-5 h-5" />}
                        label="Cidade/Estado"
                        value={`${event.city} - ${event.state}`}
                    />
                    <InfoItem
                        icon={<Clock className="w-5 h-5" />}
                        label="Dias até o evento"
                        value={stats.daysUntilEvent > 0 ? `${stats.daysUntilEvent} dias` : stats.daysUntilEvent === 0 ? 'Hoje!' : 'Evento finalizado'}
                        valueClass={stats.daysUntilEvent > 0 ? 'text-primary' : stats.daysUntilEvent === 0 ? 'text-green-500 font-bold' : 'text-muted-foreground'}
                    />
                </div>

                {/* Descrição */}
                {event.description && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Descrição</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                )}

                {/* Estatísticas de Vendas */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Estatísticas de Vendas
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            label="Vendidos"
                            value={stats.soldTickets}
                            icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                            color="text-green-500"
                        />
                        <StatCard
                            label="Disponíveis"
                            value={stats.availableTickets}
                            icon={<Ticket className="w-5 h-5 text-blue-500" />}
                            color="text-blue-500"
                        />
                        <StatCard
                            label="Total"
                            value={stats.totalTickets}
                            icon={<Users className="w-5 h-5 text-purple-500" />}
                            color="text-purple-500"
                        />
                        <StatCard
                            label="Taxa de Venda"
                            value={`${stats.salesPercentage}%`}
                            icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
                            color="text-amber-500"
                        />
                    </div>

                    {/* Barra de Progresso */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progresso de Vendas</span>
                            <span className="font-semibold text-primary">{stats.salesPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500"
                                style={{ width: `${stats.salesPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Estatísticas de Entrada/Validação */}
                <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Controle de Entrada
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard
                            label="Já Entraram"
                            value={stats.validatedTickets}
                            icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
                            color="text-blue-600"
                        />
                        <StatCard
                            label="Ainda Não Entraram"
                            value={stats.soldTickets - stats.validatedTickets}
                            icon={<Clock className="w-5 h-5 text-amber-600" />}
                            color="text-amber-600"
                        />
                        <StatCard
                            label="Taxa de Entrada"
                            value={`${stats.validationPercentage}%`}
                            icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                            color="text-purple-600"
                        />
                    </div>

                    {/* Barra de Progresso de Entrada */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Progresso de Entrada ({stats.validatedTickets} de {stats.soldTickets} vendidos)
                            </span>
                            <span className="font-semibold text-blue-600">{stats.validationPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                                style={{ width: `${stats.validationPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            {stats.soldTickets - stats.validatedTickets > 0
                                ? `${stats.soldTickets - stats.validatedTickets} pessoas ainda não chegaram`
                                : 'Todos os ingressos vendidos foram validados!'}
                        </p>
                    </div>
                </div>

                {/* Receita */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Receita Atual
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                            R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Receita Potencial
                        </p>
                        <p className="text-2xl font-bold text-primary">
                            R$ {stats.potentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Tipos de Ingressos */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" />
                        Tipos de Ingressos ({event.tickets.length})
                    </h3>
                    <div className="space-y-3">
                        {event.tickets.map((ticket) => (
                            <TicketItem key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-4 border-t border-border">
                    <Link href={route("promoter.event.manage", event.id)}>
                        <Button variant="outline" className="w-full gap-2">
                            <Settings className="w-4 h-4" />
                            Editar Evento
                        </Button>
                    </Link>
                    <Link href={route("promoter.event.tickets", event.id)}>
                        <Button variant="outline" className="w-full gap-2">
                            <Ticket className="w-4 h-4" />
                            Gerenciar Ingressos
                        </Button>
                    </Link>
                    <Link href={route("promoter.event.validate", event.id)}>
                        <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                            <ScanLine className="w-4 h-4" />
                            Validar Ingressos
                        </Button>
                    </Link>
                </div>
            </div>
        </DialogContent>
    );
};

// Componente auxiliar para informações
const InfoItem = ({ icon, label, value, valueClass = "text-foreground" }) => (
    <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-sm font-medium ${valueClass} break-words`}>{value}</p>
        </div>
    </div>
);

// Componente auxiliar para cards de estatística
const StatCard = ({ label, value, icon, color }) => {
    // Garantir que value seja sempre válido
    const displayValue = value !== null && value !== undefined && !isNaN(value) ? value : "0";

    return (
        <div className="bg-card p-4 rounded-lg border border-border text-center space-y-2">
            <div className="flex justify-center">{icon}</div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{displayValue}</p>
        </div>
    );
};

// Componente para item de ingresso
const TicketItem = ({ ticket }) => {
    const sold = parseInt(ticket.sold) || 0;
    const quantity = parseInt(ticket.quantity) || 0;
    const price = parseFloat(ticket.price) || 0;
    const validated = parseInt(ticket.validated) || 0;
    const available = Math.max(0, quantity - sold);
    const percentage = quantity > 0 ? ((sold / quantity) * 100).toFixed(0) : 0;
    const validatedPercentage = sold > 0 ? ((validated / sold) * 100).toFixed(0) : 0;
    const revenue = (sold * price).toFixed(2);

    return (
        <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{ticket.type}</h4>
                    {ticket.description && (
                        <p className="text-xs text-muted-foreground mt-1">{ticket.description}</p>
                    )}
                </div>
                <Badge variant="secondary" className="ml-2">
                    R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Badge>
            </div>

            <div className="space-y-3">
                {/* Vendas */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Vendas</span>
                        <span className="font-semibold text-primary">{percentage}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{sold} vendidos de {quantity}</span>
                        <span>{available} disponíveis</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Entrada/Validação */}
                {sold > 0 && (
                    <div className="pt-2 border-t border-border/50">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Entrada
                            </span>
                            <span className="font-semibold text-blue-600">{validatedPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span className="text-blue-600">{validated} já entraram</span>
                            <span className="text-amber-600">{sold - validated} aguardando</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                                style={{ width: `${validatedPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Receita */}
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Receita
                    </span>
                    <span className="font-semibold text-green-600">
                        R$ {parseFloat(revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};
