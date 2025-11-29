import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useToast } from '@/Components/ui/toast-provider';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, AlertCircle, ScanLine, Loader2 } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export default function Show() {
  const { orderTicket } = usePage().props;
  const { push } = useToast();
  const [status, setStatus] = useState(orderTicket.status);
  const [loading, setLoading] = useState(false);

  const statusBadge = () => {
    const map = {
      paid: { variant: 'secondary', label: 'Pago', icon: CheckCircle2 },
      validated: { variant: 'default', label: 'Validado', icon: ScanLine },
      pending: { variant: 'outline', label: 'Pendente', icon: AlertCircle },
      cancelled: { variant: 'destructive', label: 'Cancelado', icon: AlertCircle },
    };
    const cfg = map[status] || map.pending;
    const Icon = cfg.icon;
    return (
      <Badge variant={cfg.variant} className='flex items-center gap-1'>
        <Icon className='w-3 h-3' /> {cfg.label}
      </Badge>
    );
  };

  const handleSimulateScan = async () => {
    setLoading(true);
    try {
      const res = await fetch(orderTicket.scan_url);
      const data = await res.json();
      if (data.status === 'validated' || data.status === 'already_validated') {
        setStatus('validated');
        push({ title: 'Ingresso validado', description: 'Este ingresso foi marcado como validado.' });
      } else if (data.status === 'invalid_state') {
        push({ title: 'Estado inválido', description: 'O ingresso precisa estar pago para validar.' });
      } else {
        push({ title: 'Falha na validação', description: 'Tente novamente.' });
      }
    } catch (e) {
      push({ title: 'Erro de rede', description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const scanQrInstruction = 'Escaneie no controle de acesso para validar.';

  return (
    <AuthenticatedLayout>
      <div className='max-w-2xl mx-auto p-6 space-y-6'>
        <Card className='p-6 space-y-4'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-2xl font-bold mb-1'>Ingresso #{orderTicket.id}</h1>
              <p className='text-sm text-muted-foreground'>Evento: {orderTicket.ticket.event.name}</p>
              <p className='text-sm text-muted-foreground'>Tipo: {orderTicket.ticket.name}</p>
              <p className='text-sm text-muted-foreground'>Quantidade: {orderTicket.quantity}</p>
              <p className='text-sm text-muted-foreground'>Valor Total: R$ {parseFloat(orderTicket.total_price).toFixed(2)}</p>
            </div>
            {statusBadge()}
          </div>

          <div className='flex flex-col items-center gap-4'>
            <QRCodeSVG value={orderTicket.scan_url} size={220} level='H' />
            <p className='text-xs text-muted-foreground'>{scanQrInstruction}</p>
            <div className='flex gap-2'>
              <Button onClick={handleSimulateScan} disabled={loading || status==='validated'}>
                {loading ? (<><Loader2 className='w-4 h-4 animate-spin mr-2'/>Validando...</>) : 'Simular Leitura'}
              </Button>
              {status !== 'validated' && (
                <form method='post' action={route('orderTicket.validate', orderTicket.id)} onSubmit={(e)=>{e.preventDefault(); handleSimulateScan();}}>
                  <Button variant='outline' disabled={loading || status==='validated'}>
                    Marcar Validado
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className='text-right'>
            <Link href={route('profile.orders')} className='text-sm text-primary hover:underline'>Voltar aos pedidos</Link>
          </div>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}

