import { useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" type="text" value={data.name} 
                onChange={(e) => setData('name', e.target.value)} />

            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={data.email} 
                onChange={(e) => setData('email', e.target.value)} />

            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <Button type="submit" disabled={processing}>Salvar</Button>
        </form>
    );
}
