import { Label } from "@/Components/ui/label";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const EventStatus = ({ data, setData }) => {
    const statusOptions = [
        { value: "active", label: "Ativo", icon: CheckCircle2, color: "text-emerald-600" },
        { value: "inactive", label: "Inativo", icon: AlertCircle, color: "text-amber-600" },
        { value: "canceled", label: "Cancelado", icon: XCircle, color: "text-red-600" },
    ];

    const currentStatus = statusOptions.find(opt => opt.value === data.status);
    const Icon = currentStatus?.icon || CheckCircle2;

    return (
        <div className="space-y-2">
            <Label className="text-foreground font-medium">Status do Evento</Label>
            <div className="relative">
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="w-full bg-background border border-border rounded-md p-3 pl-10 appearance-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary transition-all cursor-pointer hover:border-primary/50"
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentStatus?.color} pointer-events-none`} />
            </div>
            <p className="text-muted-foreground text-xs">
                {data.status === "active" && "O evento estará visível para o público"}
                {data.status === "inactive" && "O evento ficará oculto temporariamente"}
                {data.status === "canceled" && "O evento foi cancelado"}
            </p>
        </div>
    );
};

