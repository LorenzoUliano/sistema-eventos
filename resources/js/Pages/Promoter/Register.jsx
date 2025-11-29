import React from "react";
import PromoterLayout from "@/Layouts/PromoterLayout";
import { useForm, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { UserPlus, Mail, Phone, Lock, User, ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function Register() {
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("promoter.register"));
    };

    return (
        <PromoterLayout>
            <div className="container max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href={route("promoter.dashboard")}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Dashboard
                        </Button>
                    </Link>

                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Cadastrar Novo Promoter
                        </h1>
                        <p className="text-muted-foreground">
                            Adicione um novo membro à sua equipe
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg border-border">
                    <CardHeader>
                        <CardTitle>Informações do Promoter</CardTitle>
                        <CardDescription>
                            Preencha os dados do novo promoter abaixo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Nome */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nome Completo
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Digite o nome completo"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className={`pl-10 h-12 ${errors.name ? 'border-destructive' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            {errors.name}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    E-mail
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@email.com"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className={`pl-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            {errors.email}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Telefone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium">
                                    Telefone
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        className={`pl-10 h-12 ${errors.phone ? 'border-destructive' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.phone && (
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            {errors.phone}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Senha */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Senha
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className={`pl-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            {errors.password}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                    Confirmar Senha
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Digite a senha novamente"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        className={`pl-10 h-12 ${errors.password_confirmation ? 'border-destructive' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            {errors.password_confirmation}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border pt-6 space-y-4">
                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 gap-2 text-base font-semibold"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Cadastrando...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Cadastrar Promoter
                                        </>
                                    )}
                                </Button>

                                {/* Cancel Button */}
                                <Link href={route("promoter.dashboard")}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-12"
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Helper Info */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">
                        <strong>Nota:</strong> O novo promoter receberá acesso ao mesmo painel e poderá gerenciar os eventos da empresa.
                    </p>
                </div>
            </div>
        </PromoterLayout>
    );
}
