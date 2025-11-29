import { motion } from 'framer-motion';
import { MotionDiv } from '@/Components/Motion';
import { Search, Sparkles, Calendar, MapPin } from 'lucide-react';

export const HeroSection = ({ onSearchChange }) => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
            {/* Video Background com overlay melhorado */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background z-10" />
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="/hero-bg2.mp4"
            />

            <div className="container relative z-20 px-4 py-16">
                <MotionDiv
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Badge Decorativo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Descubra eventos incríveis
                            </span>
                        </div>
                    </motion.div>

                    {/* Título Principal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Viva Experiências
                            </span>
                            <br />
                            <span className="text-foreground">Inesquecíveis</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Os melhores eventos da sua região com segurança e praticidade
                        </p>
                    </motion.div>

                    {/* Barra de Pesquisa Melhorada */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="mt-10"
                    >
                        <div className="max-w-3xl mx-auto bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-2">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <div className="flex-1 flex items-center gap-3 px-4 w-full md:w-auto">
                                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Buscar eventos, artistas..."
                                        onChange={(e) => onSearchChange?.(e.target.value)}
                                        className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground h-12 text-base"
                                    />
                                </div>
                                <button className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                                    Buscar
                                </button>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap justify-center gap-3 mt-6"
                        >
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all text-sm">
                                <Calendar className="w-4 h-4" />
                                Hoje
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all text-sm">
                                <Calendar className="w-4 h-4" />
                                Este Fim de Semana
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all text-sm">
                                <MapPin className="w-4 h-4" />
                                Próximo a Mim
                            </button>
                        </motion.div>
                    </motion.div>
                </MotionDiv>
            </div>
        </section>
    );
};
