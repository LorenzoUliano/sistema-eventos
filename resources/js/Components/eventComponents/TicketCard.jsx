import React, { useState, useContext } from "react";
import { Button } from "@/Components/ui/button";
import { useCart } from "@/Contexts/cart-context"; // Você precisa criar este contexto

export const TicketCard = ({ ticket }) => {
    const { addToCart, updateQuantity, cartItems } = useCart();
    const currentCartItem = cartItems.find(
        (item) => item.id === ticket.id && item.event_id === ticket.event_id
    );

    const handleBuy = () => {
        addToCart(ticket);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) {
            updateQuantity(ticket.id, ticket.event_id, 0);
            return;
        }

        if (newQuantity > ticket.limit_quantity) return;

        updateQuantity(ticket.id, ticket.event_id, newQuantity);
    };

    return (
        <div className="bg-card p-6 rounded-xl shadow-theme hover:shadow-theme-lg transition-shadow">
            <div className="flex flex-col h-full justify-between">
                <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                        {ticket.name}
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                        <p className="flex justify-between">
                            <span>Preço:</span>
                            <span className="text-primary font-medium">
                                R$ {parseFloat(ticket.price).toFixed(2)}
                            </span>
                        </p>
                        <p className="flex justify-between">
                            <span>Disponíveis:</span>
                            <span className="text-primary font-medium">
                                {ticket.limit_quantity}
                            </span>
                        </p>
                    </div>
                </div>

                {currentCartItem ? (
                    <div className="flex items-center gap-4 mt-4">
                        <Button
                            onClick={() =>
                                handleQuantityChange(
                                    currentCartItem.quantity - 1
                                )
                            }
                            className="h-12 w-12"
                            variant="outline"
                        >
                            -
                        </Button>
                        <span className="text-lg font-medium">
                            {currentCartItem.quantity}
                        </span>
                        <Button
                            onClick={() =>
                                handleQuantityChange(
                                    currentCartItem.quantity + 1
                                )
                            }
                            className="h-12 w-12"
                            disabled={
                                currentCartItem.quantity >=
                                ticket.limit_quantity
                            }
                        >
                            +
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="mt-4 w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                        size="lg"
                        onClick={handleBuy}
                    >
                        Adicionar ao carrinho
                    </Button>
                )}
            </div>
        </div>
    );
};
