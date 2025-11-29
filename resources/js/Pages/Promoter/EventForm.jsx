import React, { useState, useEffect } from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { FormSection } from "@/Components/eventFormComponents/FormSelection";
import { EventBasicInfo } from "@/Components/eventFormComponents/EventBasicInfo";
import { EventImageUpload } from "@/Components/eventFormComponents/EventImageUpload";
import { EventLocation } from "@/Components/eventFormComponents/EventLocation";
import { EventStatus } from "@/Components/eventFormComponents/EventStatus";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function EventForm({ event = null }) {
    const isEditing = event !== null;
    const { success } = usePage().props;
    const [message, setMessage] = useState(success || null);
    const [startDate, setStartDate] = useState(event?.start_date ? new Date(event.start_date) : null);
    const [endDate, setEndDate] = useState(event?.end_date ? new Date(event.end_date) : null);

    const { data, setData, post, processing, errors } = useForm({
        name: event?.name || "",
        description: event?.description || "",
        image: null,
        start_date: event?.start_date || "",
        end_date: event?.end_date || "",
        location: event?.location || "",
        city: event?.city || "",
        state: event?.state || "",
        status: event?.status || "active",
        _method: isEditing ? "PUT" : "POST",
    });

    useEffect(() => {
        if (success) {
            setMessage(success);
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);


    const handleDateChange = (date, field) => {
        if (date) {
            const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
            setData(field, formattedDate);

            if (field === "start_date") {
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        } else {
            setData(field, "");
            if (field === "start_date") {
                setStartDate(null);
            } else {
                setEndDate(null);
            }
        }
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

        const submitData = {
            ...data,
            _method: isEditing ? "PUT" : "POST"
        };

        if (isEditing) {
            post(route("promoter.event.update", { id: event.id }), {
                forceFormData: true,
                onSuccess: () => {
                    setMessage("Evento atualizado com sucesso!");
                }
            });
        } else {
            post(route("promoter.event.store"), {
                forceFormData: true,
                onSuccess: () => {
                    setMessage("Evento criado com sucesso!");
                }
            });
        }
    };

    return (
        <PromoterLayout>
            <Head title={isEditing ? `Editar ${event.name}` : "Criar Evento"} />

            <div className="container max-w-4xl mx-auto py-8 px-4">
                <div className="bg-card shadow-lg rounded-xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                            {isEditing ? "Editar Evento" : "Novo Evento"}
                        </h1>
                        <p className="text-primary-foreground/90 text-sm md:text-base">
                            {isEditing ? "Atualize os detalhes do seu evento" : "Preencha os dados para criar um novo evento"}
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mx-6 mt-6 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">{message}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
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
                                    <label className="text-sm font-medium text-foreground">Data de Início</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                {startDate ?
                                                    format(startDate, "PPP 'às' HH:mm", { locale: ptBR }) :
                                                    "Selecione a data de início"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) => handleDateChange(date, "start_date")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Data de Término</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                {endDate ?
                                                    format(endDate, "PPP 'às' HH:mm", { locale: ptBR }) :
                                                    "Selecione a data de término"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={(date) => handleDateChange(date, "end_date")}
                                                initialFocus
                                                disabled={(date) => startDate && date < startDate}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Localização">
                            <EventLocation data={data} errors={errors} setData={setData} />
                        </FormSection>

                        <FormSection title="Status do Evento">
                            <EventStatus data={data} setData={setData} />
                        </FormSection>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-border">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {isEditing ? "Salvando alterações..." : "Criando evento..."}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        {isEditing ? "Salvar Alterações" : "Criar Evento"}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </PromoterLayout>
    );
}
