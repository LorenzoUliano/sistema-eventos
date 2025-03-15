import React, { useState } from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EventManage() {
    const { event, success } = usePage().props;
    const [message, setMessage] = useState(success || null);
    const { data, setData, put, processing, errors } = useForm({
        name: event.name,
        description: event.description,
        image_url: event.image_url,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        city: event.city,
        state: event.state,
        status: event.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("promoter.event.update", event.id), {
            onSuccess: () => {
                setMessage("Evento atualizado com sucesso!")
                route('promoter.dashboard')
            },
        });
    };

    return (
        <PromoterLayout>
            <Head title={`Gerenciar ${event.name}`} />

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
                <h1 className="text-2xl font-bold mb-4">Gerenciar Evento</h1>

                {message && <p className="text-green-600">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nome do Evento</Label>
                        <Input type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <Label>Descrição</Label>
                        <Textarea value={data.description} onChange={(e) => setData("description", e.target.value)} />
                    </div>

                    <div>
                        <Label>Imagem URL</Label>
                        <Input type="url" value={data.image_url} onChange={(e) => setData("image_url", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Data de Início</Label>
                            <Input type="datetime-local" value={data.start_date} onChange={(e) => setData("start_date", e.target.value)} />
                        </div>
                        <div>
                            <Label>Data de Término</Label>
                            <Input type="datetime-local" value={data.end_date} onChange={(e) => setData("end_date", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Localização</Label>
                            <Input type="text" value={data.location} onChange={(e) => setData("location", e.target.value)} />
                        </div>
                        <div>
                            <Label>Cidade</Label>
                            <Input type="text" value={data.city} onChange={(e) => setData("city", e.target.value)} />
                        </div>
                        <div>
                            <Label>Estado</Label>
                            <Input type="text" value={data.state} onChange={(e) => setData("state", e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Status do Evento</Label>
                        <select value={data.status} onChange={(e) => setData("status", e.target.value)} className="w-full border p-2 rounded">
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="canceled">Cancelado</option>
                        </select>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={processing}>
                        {processing ? "Atualizando..." : "Atualizar Evento"}
                    </Button>
                </form>
            </div>
        </PromoterLayout>
    );
}
