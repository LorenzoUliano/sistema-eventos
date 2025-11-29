import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Building2, Mail, Phone, ArrowRight } from 'lucide-react';

export const CompanyCard = ({ company, children }) => (
    <div className="space-y-6">
        {/* Company Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-xl">
                    <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                        {company.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {company.email && (
                            <a
                                href={`mailto:${company.email}`}
                                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                {company.email}
                            </a>
                        )}
                        {company.phone && (
                            <a
                                href={`tel:${company.phone}`}
                                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                {company.phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {company.events.length >= 3 && (
                <Link href={`/company/${company.id}`}>
                    <Button
                        variant="outline"
                        className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary"
                    >
                        Ver todos os eventos
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            )}
        </div>

        {/* Events Grid */}
        <div>
            {children}
        </div>
    </div>
);
