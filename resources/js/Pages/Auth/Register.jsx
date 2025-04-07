import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Cadastro" />
            
            <CardContent className="space-y-6">
                <CardTitle className="text-3xl font-bold text-center text-primary">
                    Crie sua conta
                </CardTitle>
                <p className="text-muted-foreground text-center">
                    Comece sua jornada conosco
                </p>

                <form onSubmit={submit} className="space-y-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-primary">Nome</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                placeholder="Seu nome completo"
                                className="pl-10 h-12"
                                autoComplete="name"
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-primary">E-mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                placeholder="seu@email.com"
                                className="pl-10 h-12"
                                autoComplete="username"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-primary">Senha</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                placeholder="••••••••"
                                className="pl-10 h-12"
                                autoComplete="new-password"
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-primary">Confirme a Senha</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                placeholder="••••••••"
                                className="pl-10 h-12"
                                autoComplete="new-password"
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                            />
                            {errors.password_confirmation && (
                                <p className="text-destructive text-sm">{errors.password_confirmation}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg font-semibold transition-all"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse">Criando conta...</span>
                            </div>
                        ) : (
                            <span>Cadastrar</span>
                        )}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Ou continue com
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            {/* Ícone do Google */}
                        </svg>
                        Google
                    </Button>
                    <Button variant="outline" className="h-12 gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            {/* Ícone do GitHub */}
                        </svg>
                        GitHub
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link
                        href={route("login")}
                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        Acesse aqui
                        <ArrowRight className="w-4 h-4 inline-block ml-1" />
                    </Link>
                </div>
            </CardContent>
        </GuestLayout>
    );
}