import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EventImageUpload = ({ event, handleFileChange, errors }) => (
    <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 bg-background">
            <Label className="cursor-pointer text-center">
                <span className="text-foreground/80 hover:text-primary transition-colors">
                    Clique para {event?.image_url ? "alterar" : "adicionar"} imagem
                </span>
                <Input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </Label>
            <p className="text-muted-foreground text-sm mt-2">JPG ou PNG (max. 5MB)</p>
        </div>
        {event?.image_url && (
            <div className="mt-4 flex justify-center">
                <img
                    src={event.image_url}
                    alt="Imagem atual"
                    className="max-h-48 rounded-lg border border-border"
                />
            </div>
        )}
        {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
    </div>
);