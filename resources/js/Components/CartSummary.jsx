// components/CartSummary.jsx
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";

export const CartSummary = ({ eventId }) => {
    const { cartItems, getEventTotal, clearCart, handleContinueCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const eventItems = cartItems.filter((item) => item.event_id === eventId);
    const total = getEventTotal(eventId);

    if (eventItems.length === 0) return null;

    return (
        <Card className="fixed bottom-4 right-4 left-4 mx-auto w-[90%] shadow-lg">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full flex items-center justify-between hover:bg-muted"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                        Seu Carrinho
                                    </span>
                                    <span className="text-primary">
                                        (
                                        {eventItems.reduce(
                                            (acc, item) => acc + item.quantity,
                                            0
                                        )}
                                        )
                                    </span>
                                </div>
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronUp className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => clearCart()}
                            >
                                Limpar
                            </Button>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                    Total
                                </p>
                                <p className="font-semibold flex flex-nowrap">
                                    R$ {total.toFixed(2)}
                                </p>
                            </div>
                            <Button size="sm" onClick={handleContinueCart}>Continuar</Button>
                        </div>


                    </div>

                    <CollapsibleContent>
                        <div className="mt-4 pt-4 border-t">
                            {eventItems.map((item) => (
                                <div
                                    key={`${item.event_id}-${item.id}`}
                                    className="flex justify-between items-center py-2"
                                >
                                    <div>
                                        <h4 className="font-medium">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} × R${" "}
                                            {parseFloat(item.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="font-medium">
                                        R${" "}
                                        {(
                                            item.quantity *
                                            parseFloat(item.price)
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </Card>
    );
};
