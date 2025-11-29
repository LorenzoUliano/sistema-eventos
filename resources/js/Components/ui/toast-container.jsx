import React from 'react';
import { useToast } from './toast-provider';
import { Button } from './button';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
      {toasts.map(t => (
        <div key={t.id} className="rounded-md border bg-card text-card-foreground shadow p-4 animate-in fade-in slide-in-from-right-2">
          <div className="font-medium mb-1">{t.title}</div>
          {t.description && <div className="text-sm text-muted-foreground mb-2">{t.description}</div>}
          <div className="flex gap-2 justify-end">
            {t.action && <Button size="sm" variant="outline" onClick={() => { t.action.onClick?.(); dismiss(t.id); }}>{t.action.label}</Button>}
            <Button size="sm" variant="ghost" onClick={() => dismiss(t.id)}>Fechar</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

