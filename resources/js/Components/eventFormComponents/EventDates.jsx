import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EventDates = ({ data, setData }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label className="text-foreground font-medium">Data de Início</Label>
            <Input
                type="datetime-local"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="mt-1 bg-background"
            />
        </div>
        <div>
            <Label className="text-foreground font-medium">Data de Término</Label>
            <Input
                type="datetime-local"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="mt-1 bg-background"
            />
        </div>
    </div>
);