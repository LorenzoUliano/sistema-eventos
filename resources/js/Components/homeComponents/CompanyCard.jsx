import React from 'react';
import { Card } from '@/Components/ui/card';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Building2, Mail, Phone, ArrowRight } from 'lucide-react';

export const CompanyCard = ({ company, children }) => (
    <Card className="p-8 rounded-xl shadow-theme bg-card/50 backdrop-blur-lg border border-border/20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-start gap-4">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20 transition-all duration-300 group-hover:border-primary">
                        <img
                            src={company.logo_url}
                            alt={company.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur">
                        CNPJ: {company.cnpj}
                    </Badge>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        {company.name}
                    </h2>

                    <div className="flex flex-wrap gap-4 mt-4">
                        <a
                            href={`mailto:${company.email}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            <span className="font-medium">{company.email}</span>
                        </a>

                        <a
                            href={`tel:${company.phone}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            <span className="font-medium">{company.phone}</span>
                        </a>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="space-y-6">
                    {children}
                </div>

                {/* Ver mais button */}
                {company.events.length >= 3 && (
                    <div className="mt-6 border-t border-border/20 pt-6">
                        <Link href={`/company/${company.id}`}>
                            <Button
                                variant="ghost"
                                className="gap-2 text-primary hover:bg-primary/5"
                            >
                                Ver todos os eventos
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    </Card>
);