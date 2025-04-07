import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, UserPlus, ArrowRight } from "lucide-react";

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

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
                    <CardHeader className="space-y-1">
                        <div className="mb-6 flex justify-center">
                            <div className="bg-primary p-3 rounded-full">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-center text-primary">
                            Bem-vindo de volta
                        </CardTitle>
                        <p className="text-muted-foreground text-center">
                            Acesse sua conta para continuar
                        </p>
                    </CardHeader>

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
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg font-semibold transition-all"
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
                </Card>
            </div>
        </GuestLayout>
    );
}