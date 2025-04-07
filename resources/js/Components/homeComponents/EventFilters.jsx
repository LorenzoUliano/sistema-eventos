import React from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card } from '@/Components/ui/card';
import { X, MapPin, CalendarDays, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import { format } from 'date-fns';

export const EventFilters = ({
    search,
    setSearch,
    location,
    setLocation,
    date,
    setDate,
    clearFilters
}) => {
    return (
        <Card className="p-6 rounded-2xl shadow-theme">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Campo de Busca */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nome do evento"
                        className="pl-10 h-12 rounded-xl"
                    />
                </div>

                {/* Localização */}
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Localização"
                        className="pl-10 h-12 rounded-xl"
                    />
                </div>

                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-12 justify-start text-left font-normal pl-10 rounded-xl"
                        >
                            <CalendarDays className="w-5 h-5 mr-2 text-muted-foreground" />
                            {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Botão Limpar */}
                <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="h-12 gap-2 text-destructive hover:bg-destructive/10"
                >
                    <X className="w-5 h-5" />
                    Limpar Filtros
                </Button>
            </div>
        </Card>
    );
};