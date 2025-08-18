import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const clearCart = () => {
        setCartItems([]);
    };

    const addToCart = (ticket) => {
        setCartItems(prev => {
            const existingItem = prev.find(item =>
                item.id === ticket.id && item.event_id === ticket.event_id
            );

            if (existingItem) {
                return prev.map(item =>
                    item.id === ticket.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, {
                id: ticket.id,
                event_id: ticket.event_id,
                name: ticket.name,
                price: ticket.price,
                quantity: 1
            }];
        });
    };

    const updateQuantity = (ticketId, eventId, newQuantity) => {
        setCartItems(prev => {
            if (newQuantity < 1) {
                return prev.filter(item =>
                    !(item.id === ticketId && item.event_id === eventId)
                );
            }

            return prev.map(item =>
                (item.id === ticketId && item.event_id === eventId)
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };

    const getEventTotal = (eventId) => {
        return cartItems
            .filter(item => item.event_id === eventId)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleContinueCart = async () => {

        try {

            const response = await axios.post('/cart/continue', {
                cart: cartItems
            });

            window.location.href = response.data.redirect_url;

        } catch (error) {
            console.error('Erro ao continuar o carrinho:', error);
            throw error;
        }


    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, getEventTotal, clearCart, handleContinueCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};