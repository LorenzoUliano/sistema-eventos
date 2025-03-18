import React, { useState } from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EventForm({ event = null }) {
    const isEditing = event !== null;
    const { success } = usePage().props;

    const [message, setMessage] = useState(success || null);
    const { data, setData, post, put, processing, errors } = useForm({
        name: event?.name || "",
        description: event?.description || "",
        image: null, // Armazena o arquivo da imagem
        start_date: event?.start_date || "",
        end_date: event?.end_date || "",
        location: event?.location || "",
        city: event?.city || "",
        state: event?.state || "",
        status: event?.status || "active",
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                alert("Por favor, selecione uma imagem válida (JPG ou PNG).");
                return;
            }
            setData("image", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        if (isEditing) {
            post(route("promoter.event.update", { id: event.id }), {
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onSuccess: () => setMessage("Evento atualizado com sucesso!"),
            });
        } else {
            post(route("promoter.event.store"), {
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onSuccess: () => setMessage("Evento criado com sucesso!"),
            });
        }
    };

    return (
        <PromoterLayout>
            <Head title={isEditing ? `Editar ${event.name}` : "Criar Evento"} />

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
                <h1 className="text-2xl font-bold mb-4">{isEditing ? "Editar Evento" : "Criar Novo Evento"}</h1>

                {message && <p className="text-green-600 bg-green-100 p-2 rounded">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
                        <Label>Imagem do Evento (JPG ou PNG)</Label>
                        <Input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
                        {event?.image_url && (
                            <img src={event.image_url} alt="Imagem atual" className="mt-4 h-32 w-auto" />
                        )}
                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
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
                        {processing ? (isEditing ? "Atualizando..." : "Criando...") : (isEditing ? "Atualizar Evento" : "Criar Evento")}
                    </Button>
                </form>
            </div>
        </PromoterLayout>
    );
}
