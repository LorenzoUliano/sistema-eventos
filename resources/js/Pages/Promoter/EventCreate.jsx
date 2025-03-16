import React, { useState } from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EventCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        image: null, // Armazena a imagem como um arquivo
        start_date: "",
        end_date: "",
        location: "",
        city: "",
        state: "",
        status: "active",
    });

    const [message, setMessage] = useState(null);

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

        // Adiciona os dados do evento ao FormData
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        post(route("promoter.event.store"), {
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onSuccess: () => setMessage("Evento criado com sucesso!"),
        });
    };

    return (
        <PromoterLayout>
            <Head title="Criar Evento" />

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
                <h1 className="text-2xl font-bold mb-4">Criar Novo Evento</h1>

                {message && <p className="text-green-600 bg-green-100 p-2 rounded">{message}</p>}

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
                        <Label>Imagem do Evento (JPG ou PNG)</Label>
                        <Input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
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
                        {processing ? "Criando..." : "Criar Evento"}
                    </Button>
                </form>
            </div>
        </PromoterLayout>
    );
}
