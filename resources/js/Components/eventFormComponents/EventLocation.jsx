import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EventLocation = ({ data, setData }) => {
    const handleStateChange = (e) => {
        const value = e.target.value.toUpperCase().slice(0, 2);
        setData("state", value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label className="text-foreground font-medium">Endereço</Label>
                <Input
                    value={data.location}
                    onChange={(e) => setData("location", e.target.value)}
                    className="mt-1 bg-background"
                />
            </div>
            <div>
                <Label className="text-foreground font-medium">Cidade</Label>
                <Input
                    value={data.city}
                    onChange={(e) => setData("city", e.target.value)}
                    className="mt-1 bg-background"
                />
            </div>
            <div>
                <Label className="text-foreground font-medium">Estado (UF)</Label>
                <Input
                    value={data.state}
                    onChange={handleStateChange}
                    className="mt-1 bg-background uppercase"
                    maxLength={2}
                    placeholder="SP"
                />
            </div>
        </div>
    );
};