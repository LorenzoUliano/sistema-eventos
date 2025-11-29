import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export const EventLocation = ({ data, setData, errors = {} }) => {
    const handleStateChange = (e) => {
        const value = e.target.value.toUpperCase().slice(0, 2);
        setData("state", value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
                <Label className="text-foreground font-medium">Endereço</Label>
                <Input
                    value={data.location}
                    onChange={(e) => setData("location", e.target.value)}
                    className="mt-1 bg-background"
                    placeholder="Rua, número, bairro"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>
            <div className="space-y-1">
                <Label className="text-foreground font-medium">Cidade</Label>
                <Input
                    value={data.city}
                    onChange={(e) => setData("city", e.target.value)}
                    className="mt-1 bg-background"
                    placeholder="Ex: Florianópolis"
                />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
            </div>
            <div className="space-y-1">
                <Label className="text-foreground font-medium">Estado (UF)</Label>
                <Input
                    value={data.state}
                    onChange={handleStateChange}
                    className="mt-1 bg-background uppercase"
                    maxLength={2}
                    placeholder="SC"
                />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
            </div>
        </div>
    );
};
