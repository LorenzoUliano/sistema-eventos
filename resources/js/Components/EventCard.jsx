import React from 'react';
import { Card } from '@/Components/ui/card';
import { Link } from '@inertiajs/react';
import { MotionDiv } from '@/Components/Motion';
import { Badge } from '@/Components/ui/badge';
import { MapPin, Ticket, DollarSign, Clock } from 'lucide-react';

export const EventCard = ({ event, company }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const hasTickets = event.tickets?.length > 0;

    const priceRange = hasTickets
        ? event.tickets.reduce((acc, ticket) => ({
            min: Math.min(acc.min, ticket.price),
            max: Math.max(acc.max, ticket.price)
        }), { min: Infinity, max: -Infinity })
        : null;

    const eventDate = new Date(event.start_date);
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();

    const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    return (
        <MotionDiv
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, type: 'spring' }}
        >
            <Link href={`/event/${event.id}`}>
                <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card h-full">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img
                            src={event.image_url}
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            {isToday ? (
                                <Badge className="bg-red-500 text-white border-0 shadow-lg font-semibold">
                                    HOJE
                                </Badge>
                            ) : daysUntilEvent <= 7 && daysUntilEvent > 0 ? (
                                <Badge className="bg-primary text-primary-foreground border-0 shadow-lg font-semibold">
                                    {daysUntilEvent} dias
                                </Badge>
                            ) : (
                                <div />
                            )}

                            {hasTickets && (
                                <Badge className="bg-background/90 backdrop-blur-sm border-0 shadow-lg">
                                    <Ticket className="w-3 h-3 mr-1" />
                                    {event.tickets.length} tipos
                                </Badge>
                            )}
                        </div>

                        {/* Bottom Date Badge */}
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            {eventDate.getDate()}
                                        </div>
                                        <div className="text-xs text-muted-foreground uppercase">
                                            {eventDate.toLocaleDateString('pt-BR', { month: 'short' })}
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-border" />
                                    <div className="text-sm">
                                        <div className="font-semibold text-foreground">
                                            {eventDate.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {eventDate.toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {event.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Info Tags */}
                        <div className="flex flex-wrap gap-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="font-medium">{event.city}, {event.state}</span>
                            </div>

                            {priceRange?.min !== Infinity && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-sm">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-primary">
                                        {priceRange.min === priceRange.max
                                            ? `R$ ${priceRange.min.toFixed(2)}`
                                            : `R$ ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}`
                                        }
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Footer com organização */}
                        <div className="pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Organizado por</span>
                                <span className="font-semibold text-primary">{company.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary/20 transition-all pointer-events-none" />
                </Card>
            </Link>
        </MotionDiv>
    );
};
