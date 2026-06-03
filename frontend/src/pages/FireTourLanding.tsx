import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, Instagram, Globe } from 'lucide-react';

export default function FireTourLanding() {
  const containerRef = useRef(null);
  
  // Track scroll progress for the whole page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero Animations (0 to 0.3)
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, -150]);

  // Buggy Animations (0.2 to 0.6)
  const buggyScale = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0.5, 1, 1.2]);
  const buggyOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);
  const buggyRotate = useTransform(scrollYProgress, [0.2, 0.6], [-10, 5]);

  // Saona Animations (0.5 to 0.8)
  const saonaScale = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0.8, 1, 1.1]);
  const saonaOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [0, 1, 1, 0]);
  const saonaY = useTransform(scrollYProgress, [0.5, 0.8], [100, -100]);

  // Coco Bongo (0.8 to 1.0)
  const cocoOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const cocoScale = useTransform(scrollYProgress, [0.8, 0.9], [0.9, 1]);

  return (
    <div ref={containerRef} className="bg-black text-white min-h-[400vh] font-sans">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center -mt-20">
        
        {/* HERO SECTION */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: heroOpacity }}
        >
          <motion.div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ 
              backgroundImage: 'url(/firetour/saona_island_1780296371819.png)',
              scale: heroScale 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
          
          <motion.div style={{ y: heroTextY }} className="relative z-10 text-center px-4">
            <h1 className="text-6xl md:text-[8rem] font-black leading-none tracking-tighter mb-6">
              EXPERIENCIAS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                INOLVIDABLES
              </span>
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-wide text-gray-300">
              PUNTA CANA
            </p>
          </motion.div>
        </motion.div>

        {/* BUGGY SECTION */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: buggyOpacity, pointerEvents: 'none' }}
        >
          <motion.img 
            src="/firetour/buggy_adventure_1780296359413.png" 
            className="absolute w-[120%] h-[120%] object-cover opacity-30"
            style={{ scale: buggyScale, rotate: buggyRotate }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black mb-4 uppercase">
                Aventura <br/>
                <span className="text-orange-500 font-light italic">Extrema</span>
              </h2>
              <p className="text-2xl text-gray-400 font-light max-w-md">Recorrido off-road, lodo y adrenalina pura en nuestros boogies profesionales.</p>
            </div>
            <motion.div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20" style={{ scale: buggyScale }}>
               <img src="/firetour/buggy_adventure_1780296359413.png" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </motion.div>

        {/* SAONA SECTION */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: saonaOpacity, pointerEvents: 'none' }}
        >
           <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm z-0"></div>
           
           <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row-reverse items-center justify-between gap-12">
            <motion.div className="flex-1 text-right" style={{ y: saonaY }}>
              <h2 className="text-5xl md:text-7xl font-black mb-4 uppercase text-blue-400">
                Isla Saona
              </h2>
              <p className="text-2xl text-blue-200 font-light ml-auto max-w-md">Aguas cristalinas, arena blanca y el paraíso tropical definitivo.</p>
            </motion.div>
            <motion.div className="flex-1 w-full aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/30" style={{ scale: saonaScale }}>
               <img src="/firetour/saona_island_1780296371819.png" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </motion.div>

        {/* COCO BONGO SECTION */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950"
          style={{ opacity: cocoOpacity, scale: cocoScale }}
        >
          <div className="absolute inset-0 bg-[url('/firetour/coco_bongo_1780296385079.png')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
          
          <div className="relative z-20 text-center w-full max-w-6xl px-6">
            <h2 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter mb-12 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">
              COCO<br/>BONGO
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left mt-24">
              <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl hover:border-cyan-500 transition-colors">
                <p className="text-cyan-400 font-bold uppercase tracking-widest mb-4">General</p>
                <p className="text-5xl font-light">US$120<span className="text-xl text-gray-500">.59</span></p>
              </div>
              <div className="p-8 border border-yellow-500/50 bg-yellow-500/10 backdrop-blur-xl rounded-3xl transform md:-translate-y-12 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                <p className="text-yellow-500 font-bold uppercase tracking-widest mb-4 flex justify-between">Gold Member <span className="bg-yellow-500 text-black px-2 py-1 text-xs rounded">VIP</span></p>
                <p className="text-6xl font-black text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">US$146<span className="text-2xl">.55</span></p>
              </div>
              <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl hover:border-pink-500 transition-colors">
                <p className="text-pink-500 font-bold uppercase tracking-widest mb-4">Front Row</p>
                <p className="text-5xl font-light">US$181<span className="text-xl text-gray-500">.03</span></p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
