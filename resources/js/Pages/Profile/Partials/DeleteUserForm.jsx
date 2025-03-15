import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function DeleteUserForm() {
    const [open, setOpen] = useState(false);
    const passwordInput = useRef();
    const { data, setData, delete: destroy, processing, errors, reset } = useForm({ password: '' });

    const confirmDeletion = () => setOpen(true);
    const closeModal = () => { setOpen(false); reset(); };

    const submit = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
        });
    };

    return (
        <div>
            <Button variant="destructive" onClick={confirmDeletion}>Excluir Conta</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tem certeza?</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Sua conta será permanentemente excluída. Digite sua senha para confirmar.
                        </p>

                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" ref={passwordInput} value={data.password} 
                            onChange={(e) => setData('password', e.target.value)} />

                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>Excluir</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
