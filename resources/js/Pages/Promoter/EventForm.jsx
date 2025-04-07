import React, { useState } from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormSection } from "@/Components/eventFormComponents/FormSelection";
import { EventBasicInfo } from "@/Components/eventFormComponents/EventBasicInfo";
import { EventImageUpload } from "@/Components/eventFormComponents/EventImageUpload";
import { EventLocation } from "@/Components/eventFormComponents/EventLocation";
import { EventStatus } from "@/Components/eventFormComponents/EventStatus";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EventForm({ event = null }) {
    const isEditing = event !== null;
    const { success } = usePage().props;
    const [message, setMessage] = useState(success || null);
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: event?.name || "",
        description: event?.description || "",
        image: null,
        start_date: event?.start_date ? new Date(event.start_date) : null,
        end_date: event?.end_date ? new Date(event.end_date) : null,
        location: event?.location || "",
        city: event?.city || "",
        state: event?.state || "",
        status: event?.status || "active",
    });

    const handleDateChange = (date, field) => {
        setData(field, date);
    };

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
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
    
        const request = isEditing 
            ? put(route("promoter.event.update", { id: event.id }), { onSuccess: () => setMessage("Evento atualizado com sucesso!") })
            : post(route("promoter.event.store"), { 
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                onSuccess: () => setMessage("Evento criado com sucesso!")
            });
    
        request;
    };

    return (
        <PromoterLayout>
            <Head title={isEditing ? `Editar ${event.name}` : "Criar Evento"} />

            <div className="max-w-4xl mx-auto bg-card shadow-theme rounded-xl p-8 mt-10">
                <div className="mb-8 space-y-1">
                    <h1 className="text-3xl font-bold text-primary">
                        {isEditing ? "Editar Evento" : "Novo Evento"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Atualize os detalhes do seu evento" : "Preencha os dados para criar um novo evento"}
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                    <div className="space-y-8">
                        <FormSection title="Informações Básicas">
                            <EventBasicInfo data={data} errors={errors} setData={setData} />
                        </FormSection>

                        <FormSection title="Imagem do Evento">
                            <EventImageUpload 
                                event={event} 
                                handleFileChange={handleFileChange} 
                                errors={errors} 
                            />
                        </FormSection>

                        <FormSection title="Datas do Evento">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary">Data de Início</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                {data.start_date ? 
                                                    format(data.start_date, "PPP", { locale: ptBR }) : 
                                                    "Selecione a data"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.start_date}
                                                onSelect={(date) => handleDateChange(date, "start_date")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary">Data de Término</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                {data.end_date ? 
                                                    format(data.end_date, "PPP", { locale: ptBR }) : 
                                                    "Selecione a data"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.end_date}
                                                onSelect={(date) => handleDateChange(date, "end_date")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Localização">
                            <EventLocation data={data} setData={setData} />
                        </FormSection>

                        <FormSection title="Status do Evento">
                            <EventStatus data={data} setData={setData} />
                        </FormSection>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-white bg-primary hover:bg-primary/90 transition-all"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEditing ? "Salvando..." : "Criando..."}
                            </div>
                        ) : (
                            isEditing ? "Salvar Alterações" : "Criar Evento"
                        )}
                    </Button>
                </form>
            </div>
        </PromoterLayout>
    );
}
