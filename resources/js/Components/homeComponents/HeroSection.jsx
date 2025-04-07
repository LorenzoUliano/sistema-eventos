import { motion } from 'framer-motion';
import { MotionDiv } from '@/Components/Motion';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

export const HeroSection = () => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent z-10" />
            <video
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover"
                src="/hero-bg2.mp4"
            />

            <MotionDiv
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.8 }}
                className="relative z-20 text-center px-4"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-6">
                        Viva Experiências Únicas
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Descubra eventos incríveis na sua cidade com ingressos seguros e facilidade
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                >
                    <div className="max-w-3xl mx-auto bg-background/90 backdrop-blur-lg p-2 rounded-full shadow-theme-lg">
                        <div className="flex items-center gap-2 px-4">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Pesquisar eventos, artistas ou locais..."
                                className="border-0 text-lg h-14 focus-visible:ring-0 bg-transparent"
                            />
                        </div>
                    </div>
                </motion.div>
            </MotionDiv>
        </section>
    );
};