import React from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "@/Components/NavBar";
import Footer from "@/Components/Footer";
import { ToastProvider } from "@/Components/ui/toast-provider";
import { ToastContainer } from "@/Components/ui/toast-container";

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <ToastProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar auth={auth} layoutType="default" />
                <div className="pt-[4rem]">{children}</div>
                <Footer />
                <ToastContainer />
            </div>
        </ToastProvider>
    );
}
