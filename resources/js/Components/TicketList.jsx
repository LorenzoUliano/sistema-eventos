import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function TicketList({ tickets }) {
    if (!tickets || tickets.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-4 text-center text-muted-foreground text-sm">
                    Nenhum ingresso selecionado.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-3">
            {tickets.map((ticket) => (
                <Card key={ticket.id} className="transition hover:shadow-sm">
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-base">{ticket.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center p-3 pt-1">
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                            <p>Qtd: {ticket.quantity}</p>
                            <p>Unitário: R$ {parseFloat(ticket.unit_price ?? ticket.price).toFixed(2)}</p>
                        </div>
                        <p className="text-lg font-semibold text-primary">
                            R$ {parseFloat(ticket.line_total ?? (ticket.price * ticket.quantity)).toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
