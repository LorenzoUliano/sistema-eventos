import { Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { useState, useMemo } from 'react';
import {
    ShoppingBag,
    Ticket,
    TrendingUp,
    Package,
    Search,
    Filter,
    X,
    AlertCircle,
    Sparkles,
    ArrowUpDown,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    Clock
} from 'lucide-react';

export default function OrdersContent() {
    const { orders, stats, most_visited_events } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [isLoading, setIsLoading] = useState(false);

    const getStatusBadge = (status) => {
        const variants = {
            paid: { variant: "default", label: "Pago", icon: CheckCircle2 },
            pending: { variant: "secondary", label: "Pendente", icon: Clock },
            canceled: { variant: "destructive", label: "Cancelado", icon: Package },
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isNewOrder = (dateString) => {
        const orderDate = new Date(dateString);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return orderDate >= sevenDaysAgo;
    };

    const getEventName = (order) => {
        if (order.tickets && order.tickets.length > 0) {
            const firstTicket = order.tickets[0];
            if (firstTicket.event && firstTicket.event.name) {
                return firstTicket.event.name;
            }
            if (firstTicket.name) {
                return `Ingresso: ${firstTicket.name}`;
            }
        }
        return "Evento não disponível";
    };

    const filteredAndSortedOrders = useMemo(() => {
        if (!orders) return [];

        let filtered = [...orders];

        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(order => {
                const orderId = order.id.toString();
                const eventName = getEventName(order).toLowerCase();
                return orderId.includes(searchLower) || eventName.includes(searchLower);
            });
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "old":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "high": {
                    const totalA = a.tickets?.reduce((sum, ticket) =>
                        sum + (parseFloat(ticket.pivot?.total_price) || 0), 0) || 0;
                    const totalB = b.tickets?.reduce((sum, ticket) =>
                        sum + (parseFloat(ticket.pivot?.total_price) || 0), 0) || 0;
                    return totalB - totalA;
                }
                case "low": {
                    const totalA = a.tickets?.reduce((sum, ticket) =>
                        sum + (parseFloat(ticket.pivot?.total_price) || 0), 0) || 0;
                    const totalB = b.tickets?.reduce((sum, ticket) =>
                        sum + (parseFloat(ticket.pivot?.total_price) || 0), 0) || 0;
                    return totalA - totalB;
                }
                default:
                    return 0;
            }
        });

        return filtered;
    }, [orders, statusFilter, searchTerm, sortBy]);

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setSortBy("recent");
    };

    const hasActiveFilters = searchTerm || statusFilter !== "all" || sortBy !== "recent";

    const handleCancelOrder = (orderId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Tem certeza que deseja cancelar este pedido?")) {
            setIsLoading(true);
            router.delete(`/orders/${orderId}`, {
                onFinish: () => setIsLoading(false),
                preserveScroll: true
            });
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            all: "Todos",
            paid: "Pago",
            pending: "Pendente",
            canceled: "Cancelado"
        };
        return labels[status] || status;
    };

    const getSortLabel = (sort) => {
        const labels = {
            recent: "Recente",
            old: "Antigo",
            high: "Maior valor",
            low: "Menor valor"
        };
        return labels[sort] || sort;
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
                <p className="text-muted-foreground">
                    Gerencie e acompanhe todos os seus pedidos de ingressos
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Pedidos */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        {/* Header com Título e Filtros */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Histórico de Pedidos</h2>
                            <div className="flex items-center gap-2">
                                {/* Filtro de Status */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Filter className="w-4 h-4" />
                                            {getStatusLabel(statusFilter)}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2">
                                        <div className="space-y-1">
                                            {["all", "paid", "pending", "canceled"].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setStatusFilter(status)}
                                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                        statusFilter === status
                                                            ? "bg-primary text-primary-foreground"
                                                            : "hover:bg-muted"
                                                    }`}
                                                >
                                                    {getStatusLabel(status)}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Filtro de Ordenação */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <ArrowUpDown className="w-4 h-4" />
                                            {getSortLabel(sortBy)}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2">
                                        <div className="space-y-1">
                                            {[
                                                { value: "recent", label: "Recente", icon: ArrowDown },
                                                { value: "old", label: "Antigo", icon: ArrowUp },
                                                { value: "high", label: "Maior valor" },
                                                { value: "low", label: "Menor valor" }
                                            ].map((sort) => {
                                                const Icon = sort.icon;
                                                return (
                                                    <button
                                                        key={sort.value}
                                                        onClick={() => setSortBy(sort.value)}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                                                            sortBy === sort.value
                                                                ? "bg-primary text-primary-foreground"
                                                                : "hover:bg-muted"
                                                        }`}
                                                    >
                                                        {Icon && <Icon className="w-3 h-3" />}
                                                        {sort.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Botão Limpar Filtros */}
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Limpar filtros
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Busca */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Buscar por número do pedido ou evento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {isLoading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
                            </div>
                        )}

                        {!isLoading && filteredAndSortedOrders && filteredAndSortedOrders.length > 0 ? (
                            <div className="space-y-4">
                                {filteredAndSortedOrders.map((order) => {
                                    // Calcula o total do pedido somando todos os order_tickets
                                    const orderTotal = order.order_tickets?.reduce((sum, ot) => {
                                        return sum + (parseFloat(ot.unit_price) || 0);
                                    }, 0) || 0;

                                    // Total de ingressos (cada order_ticket = 1 ingresso)
                                    const totalTickets = order.order_tickets?.length || 0;

                                    // Tipos diferentes de ingressos (agrupando pelo NOME do ticket)
                                    const uniqueTicketTypes = order.order_tickets?.reduce((acc, ot) => {
                                        const ticketName = ot.ticket?.name || 'Ingresso';
                                        if (!acc.includes(ticketName)) {
                                            acc.push(ticketName);
                                        }
                                        return acc;
                                    }, []) || [];
                                    const numberOfTicketTypes = uniqueTicketTypes.length;

                                    const eventName = getEventName(order);
                                    const isNew = isNewOrder(order.created_at);
                                    const hasIssues = order.status === "pending" &&
                                        new Date(order.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                                    return (
                                        <Card
                                            key={order.id}
                                            className="hover:shadow-lg transition-all hover:border-primary/50 relative"
                                        >
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <CardTitle className="text-lg">
                                                                Pedido #{order.id}
                                                            </CardTitle>
                                                            {isNew && (
                                                                <Badge variant="default" className="flex items-center gap-1 animate-pulse">
                                                                    <Sparkles className="w-3 h-3" />
                                                                    Novo
                                                                </Badge>
                                                            )}
                                                            {hasIssues && (
                                                                <Badge variant="destructive" className="flex items-center gap-1">
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    Atenção
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <CardDescription className="mb-2">
                                                            {formatDate(order.created_at)}
                                                        </CardDescription>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-sm font-medium text-primary">
                                                                {eventName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Ticket className="w-4 h-4" />
                                                            <span>
                                                                {totalTickets} ingresso{totalTickets !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        {numberOfTicketTypes > 0 && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {numberOfTicketTypes} tipo{numberOfTicketTypes !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold">
                                                            {formatCurrency(orderTotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 pt-4 border-t">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="flex-1"
                                                    >
                                                        <Button variant="outline" className="w-full">
                                                            Ver detalhes
                                                        </Button>
                                                    </Link>
                                                    {order.status === "pending" && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={(e) => handleCancelOrder(order.id, e)}
                                                            title="Cancelar pedido"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : !isLoading && orders && orders.length > 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nenhum pedido encontrado
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Tente ajustar os filtros de busca
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                    >
                                        Limpar filtros
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-bounce" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nenhum pedido encontrado
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Você ainda não realizou nenhum pedido. Comece explorando nossos eventos incríveis!
                                    </p>
                                    <Link href="/">
                                        <Button>
                                            Explorar Eventos
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Eventos Mais Visitados */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Eventos Mais Visitados
                            </CardTitle>
                            <CardDescription>
                                Seus eventos favoritos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {most_visited_events && most_visited_events.length > 0 ? (
                                <div className="space-y-4">
                                    {most_visited_events.map((item, index) => (
                                        <Link
                                            key={item.event.id}
                                            href={`/event/${item.event.id}`}
                                            className="block"
                                        >
                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm truncate">
                                                        {item.event.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Ticket className="w-3 h-3" />
                                                            {item.count} ingresso{item.count > 1 ? 's' : ''}
                                                        </span>
                                                        <span className="font-medium text-primary">
                                                            {formatCurrency(item.total_spent)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum evento visitado ainda
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
