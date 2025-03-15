import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const events = [
    {
        id: 1,
        title: "Festival de Música",
        date: "20 de Abril, 2025",
        location: "São Paulo, SP",
        description: "O maior festival de música do Brasil, com diversas atrações nacionais e internacionais.",
        image: "https://source.unsplash.com/400x250/?concert,music",
    },
    {
        id: 2,
        title: "Stand-Up Comedy Night",
        date: "15 de Maio, 2025",
        location: "Rio de Janeiro, RJ",
        description: "Uma noite de comédia imperdível com os maiores humoristas do país!",
        image: "https://source.unsplash.com/400x250/?standup,comedy",
    },
    {
        id: 3,
        title: "Conferência de Tecnologia",
        date: "10 de Junho, 2025",
        location: "Belo Horizonte, MG",
        description: "O evento mais inovador do ano, com palestras sobre IA, desenvolvimento e startups.",
        image: "https://source.unsplash.com/400x250/?technology,conference",
    },
];

export default function Home() {
    const { auth } = usePage().props;
    
    return (
        <AuthenticatedLayout>
            <Head title="Home" />

            <div className="mt-20 p-6">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
                    {auth.user ? `Bem-vindo, ${auth.user.name}!` : "Eventos Disponíveis"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <Card key={event.id} className="overflow-hidden shadow-lg rounded-lg bg-white transition-transform transform hover:scale-105">
                            <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                            <CardHeader className="p-4">
                                <CardTitle className="text-xl font-semibold text-gray-900">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 text-gray-700">
                                <p><strong>📅 Data:</strong> {event.date}</p>
                                <p><strong>📍 Local:</strong> {event.location}</p>
                                <p className="mt-2">{event.description}</p>
                                <Link href={`/event/${event.id}`}>
                                    <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Ver Detalhes</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
