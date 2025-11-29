import React from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card } from '@/Components/ui/card';
import { X, MapPin, CalendarDays, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const EventFilters = ({
    search,
    setSearch,
    location,
    setLocation,
    date,
    setDate,
    clearFilters
}) => {
    const hasActiveFilters = search || location || date;

    return (
        <Card className="p-6 rounded-2xl shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="space-y-4">
                {/* Title */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Search className="w-5 h-5 text-primary" />
                        Filtrar Eventos
                    </h3>
                    {hasActiveFilters && (
                        <Button
                            onClick={clearFilters}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-destructive"
                        >
                            <X className="w-4 h-4" />
                            Limpar
                        </Button>
                    )}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Campo de Busca */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar eventos..."
                            className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                        />
                    </div>

                    {/* Localização */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Cidade..."
                            className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary bg-background/50"
                        />
                    </div>

                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-12 justify-start text-left font-normal rounded-xl border-border/50 hover:border-primary bg-background/50"
                            >
                                <CalendarDays className="w-5 h-5 mr-2 text-muted-foreground" />
                                {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Data do evento"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                locale={ptBR}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                        {search && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                <Search className="w-3 h-3" />
                                {search}
                                <button onClick={() => setSearch("")} className="ml-1 hover:text-primary/70">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {location && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                <MapPin className="w-3 h-3" />
                                {location}
                                <button onClick={() => setLocation("")} className="ml-1 hover:text-primary/70">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {date && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                <CalendarDays className="w-3 h-3" />
                                {format(date, "dd/MM/yyyy")}
                                <button onClick={() => setDate("")} className="ml-1 hover:text-primary/70">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};
