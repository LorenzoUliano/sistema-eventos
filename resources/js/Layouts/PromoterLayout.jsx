import React from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";

export default function PromoterLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-background">
            <Navbar auth={auth} layoutType="promoter" />
            <div className="pt-20 px-6">{children}</div>
        </div>
    );
}