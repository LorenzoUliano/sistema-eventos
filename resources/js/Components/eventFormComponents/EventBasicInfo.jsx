import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

export const EventBasicInfo = ({ data, errors, setData }) => (
    <>
        <div className="space-y-2">
            <Label className="text-foreground font-medium">Nome do Evento</Label>
            <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="mt-1 bg-background"
                placeholder="Ex: Festival de Música 2025"
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
            <Label className="text-foreground font-medium">Descrição</Label>
            <Textarea
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="mt-1 bg-background h-32 resize-none"
                placeholder="Descreva seu evento..."
            />
            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
        </div>
    </>
);
