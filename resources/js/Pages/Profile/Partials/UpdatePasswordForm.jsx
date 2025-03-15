import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpdatePasswordForm() {
    const { data, setData, errors, put, processing, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <Label htmlFor="current_password">Senha Atual</Label>
            <Input id="current_password" type="password" value={data.current_password} 
                onChange={(e) => setData('current_password', e.target.value)} />

            <Label htmlFor="password">Nova Senha</Label>
            <Input id="password" type="password" value={data.password} 
                onChange={(e) => setData('password', e.target.value)} />

            <Label htmlFor="password_confirmation">Confirmar Nova Senha</Label>
            <Input id="password_confirmation" type="password" value={data.password_confirmation} 
                onChange={(e) => setData('password_confirmation', e.target.value)} />

            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <Button type="submit" disabled={processing}>Salvar</Button>
        </form>
    );
}
