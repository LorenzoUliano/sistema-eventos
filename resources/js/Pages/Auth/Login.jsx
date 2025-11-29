import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Lock, Mail, UserPlus, ArrowRight } from "lucide-react";
import {Input} from "@/Components/ui/input.jsx";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />
            <CardContent className="space-y-6">
                {status && (
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
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
                        </div>
                        {errors.email && (
                            <p className="text-destructive text-sm">{errors.email}</p>
                        )}
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
                                autoComplete="current-password"
                                onChange={(e) => setData("password", e.target.value)}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-destructive text-sm">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData("remember", checked)}
                            />
                            <Label htmlFor="remember" className="text-muted-foreground">
                                Lembrar-me
                            </Label>
                        </div>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Esqueceu a senha?
                            </Link>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-secondary text-lg font-semibold transition-all"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-pulse">Carregando...</span>
                            </div>
                        ) : (
                            <span>Acessar conta</span>
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link
                        href={route("register")}
                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        Cadastre-se
                        <ArrowRight className="w-4 h-4 inline-block ml-1" />
                    </Link>
                </div>
            </CardContent>
        </GuestLayout>
    );
}
