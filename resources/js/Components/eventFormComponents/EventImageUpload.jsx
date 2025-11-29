import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";

export const EventImageUpload = ({ event, handleFileChange, errors }) => (
    <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 bg-background hover:bg-accent/5 transition-colors">
            <Label className="cursor-pointer text-center flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                    {event?.image_url ? (
                        <ImageIcon className="w-8 h-8 text-primary" />
                    ) : (
                        <Upload className="w-8 h-8 text-primary" />
                    )}
                </div>
                <div>
                    <span className="text-foreground font-medium hover:text-primary transition-colors block">
                        {event?.image_url ? "Alterar imagem do evento" : "Adicionar imagem do evento"}
                    </span>
                    <p className="text-muted-foreground text-sm mt-1">
                        JPG ou PNG (máx. 2MB) {event?.image_url && "• Opcional"}
                    </p>
                </div>
                <Input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </Label>
        </div>
        {event?.image_url && (
            <div className="mt-4 flex justify-center">
                <div className="relative group">
                    <img
                        src={event.image_url}
                        alt="Imagem atual do evento"
                        className="max-h-48 rounded-lg border border-border shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Imagem atual</p>
                    </div>
                </div>
            </div>
        )}
        {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
    </div>
);
