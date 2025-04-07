import React from "react";
import { Head } from "@inertiajs/react";

export const EventHeader = ({ event }) => (
    <div className="relative overflow-hidden rounded-2xl bg-card shadow-theme">
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent" />
        <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-96 object-cover opacity-20"
        />
        <div className="absolute inset-0 p-8 flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-primary mb-4">{event.name}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{event.description}</p>
        </div>
        <Head title={event.name} />
    </div>
);