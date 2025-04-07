import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const EventBasicInfo = ({ data, errors, setData }) => (
    <>
        <div>
            <Label className="text-foreground font-medium">Nome do Evento</Label>
            <Input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="mt-1 bg-background"
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
            <Label className="text-foreground font-medium">Descrição</Label>
            <Textarea
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="mt-1 bg-background h-32"
            />
        </div>
    </>
);