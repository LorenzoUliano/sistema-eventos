import React from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar auth={auth} layoutType="default" />
            <div className="pt-[4rem]">{children}</div>
            <Footer />
        </div>
    );
}