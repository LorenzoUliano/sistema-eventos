import React from "react";
import { Link } from "@inertiajs/react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sobre o site */}
                    <div>
                        <h2 className="text-lg font-bold text-white">Sobre Nós</h2>
                        <p className="text-sm mt-2">
                            O melhor lugar para encontrar e participar dos eventos mais incríveis! 
                            Fique por dentro das novidades e garanta seu ingresso.
                        </p>
                    </div>

                    {/* Links úteis */}
                    <div>
                        <h2 className="text-lg font-bold text-white">Links Úteis</h2>
                        <ul className="mt-2 space-y-2">
                            <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
                            <li><Link href="/events" className="hover:text-blue-400">Eventos</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400">Sobre</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400">Contato</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-blue-400">Política de Privacidade</Link></li>
                        </ul>
                    </div>

                    {/* Redes sociais */}
                    <div>
                        <h2 className="text-lg font-bold text-white">Nos siga</h2>
                        <div className="flex space-x-4 mt-2">
                            <a href="https://facebook.com" target="_blank" className="hover:text-blue-400">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" className="hover:text-pink-400">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://twitter.com" target="_blank" className="hover:text-blue-300">
                                <FaTwitter size={24} />
                            </a>
                            <a href="mailto:contato@evento.com" className="hover:text-gray-400">
                                <FaEnvelope size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
                    &copy; {new Date().getFullYear()} Eventos Online - Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
