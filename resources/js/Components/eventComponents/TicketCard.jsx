import React from "react";
import { Button } from "@/components/ui/button";

export const TicketCard = ({ ticket }) => (
    <div className="bg-card p-6 rounded-xl shadow-theme hover:shadow-theme-lg transition-shadow">
        <div className="flex flex-col h-full justify-between">
            <div>
                <h3 className="text-xl font-bold text-primary mb-2">{ticket.name}</h3>
                <div className="space-y-2 text-muted-foreground">
                    <p className="flex justify-between">
                        <span>Preço:</span>
                        <span className="text-primary font-medium">
                            R$ {parseFloat(ticket.price).toFixed(2)}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span>Disponíveis:</span>
                        <span className="text-primary font-medium">{ticket.limit_quantity}</span>
                    </p>
                </div>
            </div>
            <Button
                className="mt-4 w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                size="lg"
            >
                Comprar Ingresso
            </Button>
        </div>
    </div>
);