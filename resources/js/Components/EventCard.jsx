import React from 'react';
import { Card } from '@/Components/ui/card';
import { Link } from '@inertiajs/react';
import { MotionDiv } from '@/Components/Motion';
import { Badge } from '@/Components/ui/badge';
import { MapPin, Ticket, DollarSign, CalendarDays, Building } from 'lucide-react';

export const EventCard = ({ event, company }) => {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
    };

    const hasTickets = event.tickets?.length > 0;

    const priceRange = hasTickets
        ? event.tickets.reduce((acc, ticket) => ({
            min: Math.min(acc.min, ticket.price),
            max: Math.max(acc.max, ticket.price)
        }), { min: Infinity, max: -Infinity })
        : null;

    const eventDate = new Date(event.start_date);

    return (
        <MotionDiv
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={`/event/${event.id}`}>
                <Card className="group relative overflow-hidden rounded-xl shadow-theme hover:shadow-theme-lg transition-all">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            src={event.image_url}
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                {eventDate.toLocaleDateString('pt-BR', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                }).replace(/\./g, '')}
                            </Badge>
                            {hasTickets && (
                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                    {event.tickets.length} ingressos
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-primary leading-tight">
                            {event.name}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-primary/20 text-primary">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.city} - {event.state}
                            </Badge>

                            {priceRange?.min !== Infinity && (
                                <Badge variant="outline" className="border-primary/20 text-primary">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    R$ {priceRange?.min.toFixed(2)} - {priceRange?.max.toFixed(2)}
                                </Badge>
                            )}
                        </div>

                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                            {event.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-primary/80">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">{company.name}</span>
                        </div>
                    </div>
                </Card>
            </Link>
        </MotionDiv>
    );
};