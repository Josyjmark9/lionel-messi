import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SafeImage from './components/SafeImage';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * IMAGE STRATEGY:
 * 1. All images use the <SafeImage /> component for automatic fallback and lazy loading.
 * 2. External URLs are used by default. For local images, place them in /public/images/
 *    and use relative paths (e.g., "/images/my-photo.jpg").
 * 3. Filenames should be strictly lowercase to avoid case-sensitivity issues on servers.
 * 4. Alt text is mandatory for accessibility and SEO.
 */

gsap.registerPlugin(ScrollTrigger);
import { 
  Trophy, 
  Star, 
  Globe, 
  Settings, 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook,
  Menu,
  X,
  Upload,
  Users
} from 'lucide-react';
import AdminPanel from './components/AdminPanel';

// --- Custom Cursor ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    let frameId: number;
    const animateRing = () => {
      setRingPos(prev => ({
        x: prev.x + (mousePos.x - prev.x - 18) * 0.12,
        y: prev.y + (mousePos.y - prev.y - 18) * 0.12
      }));
      frameId = requestAnimationFrame(animateRing);
    };
    frameId = requestAnimationFrame(animateRing);
    return () => cancelAnimationFrame(frameId);
  }, [mousePos, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-3 h-3 bg-gold rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 hidden md:block"
        style={{ 
          transform: `translate(${mousePos.x - 6}px, ${mousePos.y - 6}px)`
        }}
      />
      <div 
        className="fixed top-0 left-0 w-9 h-9 border border-gold rounded-full pointer-events-none z-[9998] opacity-60 hidden md:block"
        style={{ transform: `translate(${ringPos.x}px, ${ringPos.y}px)` }}
      />
    </>
  );
};

// --- Components ---

const Navbar = ({ onLogoClick }: { onLogoClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent pointer-events-none" />
      <button 
        onClick={onLogoClick}
        className="relative z-10 font-bebas text-2xl tracking-[0.2em] text-gold cursor-none hover:opacity-80 transition-opacity drop-shadow-[0_0_8px_rgba(201,168,76,0.4)]"
      >
        LM · 10
      </button>
      
      {/* Desktop Menu */}
      <ul className="relative z-10 hidden md:flex gap-10 list-none">
        {['Story', 'On Pitch', 'Trophies', 'Career', 'Social'].map(item => (
          <li key={item}>
            <motion.a 
              href={`#${item.toLowerCase().replace(' ', '-')}`} 
              className="relative text-[0.65rem] tracking-[0.2em] uppercase text-white/70 hover:text-gold transition-colors group inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
              whileHover={{ 
                y: -5,
                scale: 1.1,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              {item}
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(201,168,76,0.5)]"
              />
            </motion.a>
          </li>
        ))}
      </ul>

      <div className="relative z-10 flex items-center gap-6">
        <motion.a 
          href="mailto:josiahjohnmark9@gmail.com" 
          className="hidden sm:block text-[0.65rem] tracking-[0.15em] uppercase text-gold border border-gold/40 px-4 py-2 hover:bg-gold/10 transition-colors"
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          Inquiries
        </motion.a>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gold p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Story', 'On Pitch', 'Trophies', 'Career', 'Social'].map(item => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                onClick={() => setIsMenuOpen(false)}
                className="font-anton text-4xl uppercase tracking-tighter text-white hover:text-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <a href="mailto:josiahjohnmark9@gmail.com" className="mt-8 text-[0.8rem] tracking-[0.2em] uppercase text-gold border border-gold/40 px-8 py-4">
              Business Enquiries
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Counter = ({ value, duration = 2, delay = 0 }: { value: string, duration?: number, delay?: number }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/,/g, '')) || 0;
  const isAward = value.includes('×');
  const suffix = isAward ? '×' : '';

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    const timeout = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Hero = ({ name1, name2, tag, bgImage, profileImage, stats }: { name1: string, name2: string, tag: string, bgImage?: string, profileImage?: string, stats: any[] }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particles = Array.from({ length: 20 });
  const { scrollY } = useScroll();
  const profileOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const profileScale = useTransform(scrollY, [0, 500], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20, 
        y: (e.clientY / window.innerHeight - 0.5) * 20 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Group stats by their group property
  const groupedStats = stats.reduce((acc: any, stat: any) => {
    const group = stat.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(stat);
    return acc;
  }, {});

  const fullName = `${name1} ${name2} `.repeat(10);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden group/hero">
      {/* Background Image with Parallax and Dim Effect */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 0.6,
          x: -mousePos.x * 0.5,
          y: -mousePos.y * 0.5
        }}
        whileHover={{ opacity: 0.8 }}
        transition={{ 
          scale: { duration: 2.5, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 1 },
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 }
        }}
        className="absolute inset-0 z-0 transition-all duration-1000"
      >
        {bgImage ? (
          <SafeImage 
            src={bgImage} 
            alt="Messi Hero Background" 
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(116,172,223,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(201,168,76,0.08)_0%,transparent_50%),linear-gradient(135deg,#0A0A0A_0%,#111520_50%,#0A0A0A_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </motion.div>

      {/* Grid Lines with Hover Effect */}
      <motion.div 
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(116,172,223,0.1)_48px,rgba(116,172,223,0.1)_50px)] pointer-events-none group-hover/hero:opacity-20 transition-opacity duration-500" 
      />
      
      {/* Scrolling Name (Background Layer) */}
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-1 opacity-10">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap font-anton text-[30vw] uppercase text-transparent tracking-tighter"
          style={{ WebkitTextStroke: '3px rgba(116,172,223,0.2)' }}
        >
          {fullName}
        </motion.div>
      </div>

      {/* Background "10" (Top Layer) */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: 0.15, 
          x: mousePos.x * 2,
          y: [0, -20, 0]
        }}
        whileHover={{ opacity: 0.3, scale: 1.05 }}
        transition={{ 
          opacity: { duration: 1.5 },
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute right-[-0.05em] top-1/2 -translate-y-1/2 font-anton text-[45vw] md:text-[45vw] lg:text-[60rem] leading-[0.85] text-transparent select-none pointer-events-none z-15 drop-shadow-[0_0_20px_rgba(116,172,223,0.1)]" 
        style={{ WebkitTextStroke: '1px rgba(116,172,223,0.3)' }}
      >
        10
      </motion.div>

      {/* Background Name Slider (Bottom Layer) */}
      <div className="absolute inset-0 z-5 flex items-start justify-center overflow-hidden pointer-events-none pt-16 md:pt-20">
        <motion.div 
          animate={{ x: [-100, 100] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="max-w-7xl mx-auto w-full px-6 md:px-12"
        >
          <div className="w-full font-anton text-6xl sm:text-8xl md:text-[10vw] lg:text-[13rem] leading-none uppercase cursor-default relative origin-center group-hover/hero:scale-x-[1.05] group-hover/hero:scale-y-[1.05] transition-all duration-700 ease-in-out">
            <div className="flex justify-between w-full overflow-hidden transition-colors duration-500">
              {(name1 + ' ' + name2).split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${i < name1.length ? 'text-white' : char === ' ' ? 'px-[0.2em]' : 'text-[#74ACDF]'}`}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            {/* Decorative LEGENDARY text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              className="absolute -bottom-8 left-0 w-full flex justify-between font-sans font-thin text-[0.6rem] tracking-[2em] text-white pointer-events-none scale-x-[1.5] origin-left"
            >
              {"LEGENDARY".split('').map((c, i) => <span key={i}>{c}</span>)}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Profile Image (Middle Layer) */}
      {profileImage && (
        <motion.div 
          style={{ opacity: profileOpacity, scale: profileScale }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto cursor-pointer group/profile pt-12 md:pt-0"
        >
          <div className="relative h-[60%] md:h-[95%] bg-transparent">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                filter: "grayscale(0) contrast(1.2) brightness(0.9)",
              }}
              initial={{ filter: "grayscale(1) contrast(1.1) brightness(0.6) blur(0px)" }}
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                duration: 0.8,
                scale: { duration: 0.4 },
                filter: { duration: 0.5 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" }
              }}
              className="h-full transition-all duration-500 bg-transparent"
              style={{ 
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            >
              <SafeImage 
                src={profileImage} 
                alt="Lionel Messi Profile" 
                className="h-full object-contain bg-transparent drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                width={800}
                height={1200}
              />
            </motion.div>
          </div>
          {/* Aura Effect (Glow removed) */}
          <div className="absolute inset-0 opacity-0 pointer-events-none" />
        </motion.div>
      )}
      
      {/* Content (Front Layer) */}
      <div className="relative z-20 px-6 md:px-12 w-full h-full flex flex-col py-12 md:py-20">
        <div className="flex-1" />

        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8 text-[0.5rem] md:text-[0.6rem] tracking-[0.3em] uppercase text-gold drop-shadow-[0_0_12px_rgba(201,168,76,0.8)] brightness-110"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-px bg-gold shadow-[0_0_12px_rgba(201,168,76,0.8)]" 
            />
            {tag}
          </motion.div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-8">
            {Object.entries(groupedStats).map(([group, groupStats]: [string, any], groupIdx) => (
              <div key={group} className="space-y-2 md:space-y-3 w-[calc(50%-1rem)] md:w-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + (groupIdx * 0.2) }}
                  className="text-[0.4rem] md:text-[0.45rem] tracking-[0.3em] uppercase text-gold flex items-center gap-2 drop-shadow-[0_0_8px_rgba(201,168,76,0.6)] brightness-110"
                >
                  {group}
                  <div className="h-px w-4 md:w-8 bg-gold/40 shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
                </motion.div>
                <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-3">
                  {groupStats.map((stat: any, i: number) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1.4 + (groupIdx * 0.2) + (i * 0.1)
                      }}
                      className="min-w-[45px] md:min-w-[60px]"
                    >
                      <div className="font-anton text-lg md:text-2xl text-gold leading-none drop-shadow-[0_0_15px_rgba(201,168,76,0.9)] brightness-125 [text-shadow:0_2px_10px_rgba(0,0,0,1)]">
                        <Counter 
                          value={stat.num} 
                          delay={1.5 + (groupIdx * 0.2) + (i * 0.1)} 
                        />
                      </div>
                      <div className="text-[0.35rem] md:text-[0.45rem] tracking-[0.1em] uppercase text-white mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] font-medium [text-shadow:0_1px_4px_rgba(0,0,0,1)]">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-2 text-[0.55rem] tracking-[0.2em] uppercase text-gold drop-shadow-[0_0_8px_rgba(201,168,76,0.4)]"
      >
        <motion.div 
          animate={{ height: [0, 60, 0], y: [0, 0, 60] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px bg-gold shadow-[0_0_8px_rgba(201,168,76,0.4)]" 
        />
        Scroll
      </motion.div>
    </section>
  );
};

const Marquee = () => (
  <div className="overflow-hidden py-8 bg-albi-deep border-y border-gold/30">
    <motion.div 
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="flex whitespace-nowrap"
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="font-bebas text-xl tracking-[0.2em] text-white/90 px-8">
          Ballon d'Or <span className="text-gold px-2">★</span>
          World Cup 2022 <span className="text-gold px-2">★</span>
          Champions League <span className="text-gold px-2">★</span>
          Copa América <span className="text-gold px-2">★</span>
          La Liga <span className="text-gold px-2">★</span>
          Greatest of All Time <span className="text-gold px-2">★</span>
        </span>
      ))}
    </motion.div>
  </div>
);

const Story = () => (
  <section id="story" className="bg-dark px-6 md:px-12 py-32 grid md:grid-cols-2 gap-24 items-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-4 mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
        <div className="w-8 h-px bg-gold" />
        His Story
      </div>
      <blockquote className="font-playfair text-3xl md:text-[2.8rem] leading-[1.3] italic text-white/90">
        Redefining <span className="text-albi not-italic">limits</span>, carrying Argentina to the summit of <span className="text-albi not-italic">world football</span>, building a legacy that will outlive the game itself.
      </blockquote>
    </motion.div>
    <div className="text-[0.8rem] leading-[2] text-gray tracking-wider space-y-6">
      <p>Born on June 24, 1987 in Rosario, Santa Fe, Lionel Andrés Messi showed football genius from his very first touches. Diagnosed with a growth hormone deficiency at age 10, Barcelona saw enough to fund his treatment — and the rest became history.</p>
      <p>At 17, he broke into Barça's first team. By 25, he had become the greatest scorer in football history. By 35, he had delivered the one thing that had eluded him — a FIFA World Cup, in Qatar 2022, cementing a legacy no one can dispute.</p>
      <p>Now in Miami, a new chapter is being written. But the legend has long since been sealed.</p>
    </div>
  </section>
);

const PhotoStrip = ({ photos }: { photos: any[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      const scrollWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;
      const xTranslation = -(scrollWidth - viewportWidth + 48); // 48 for padding

      gsap.to(container, {
        x: xTranslation,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [photos]);

  return (
    <section ref={sectionRef} className="bg-black h-screen flex flex-col justify-center overflow-hidden">
      <div className="px-6 md:px-12 mb-12 text-[0.6rem] tracking-[0.3em] uppercase text-gold">Career Moments</div>
      <div 
        ref={containerRef} 
        className="flex gap-4 md:gap-8 w-max px-6 md:px-12"
      >
        {photos.map((photo, i) => (
          <div key={i} className="relative w-[260px] md:w-[450px] h-[350px] md:h-[600px] border border-albi/10 overflow-hidden group shrink-0">
            {photo.image ? (
              <SafeImage 
                src={photo.image} 
                alt={photo.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                width={450}
                height={600}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[0.6rem] tracking-widest uppercase text-albi/30">
                {photo.icon}
                <span className="text-center">{photo.title}<br/>Photo Slot</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-8 flex flex-col justify-end">
              <div className="text-[0.6rem] tracking-[0.2em] uppercase text-gold mb-2">{photo.year}</div>
              <div className="font-anton text-2xl md:text-4xl tracking-wider uppercase leading-none">{photo.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SignatureSection = ({ signature }: { signature: string }) => (
  <section className="bg-albi-deep px-6 md:px-12 py-20 md:py-32 border-y-[3px] border-gold relative overflow-hidden flex items-center justify-center">
    {/* Background Atmosphere */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.2)_0%,transparent_70%)]" />
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"
      />
    </div>

    <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-8 text-[0.6rem] tracking-[0.4em] uppercase text-gold/60"
      >
        <div className="w-12 h-px bg-gold/30" />
        The Mark of Greatness
        <div className="w-12 h-px bg-gold/30" />
      </motion.div>
      
      <div className="relative group">
        {signature ? (
          <div className="relative">
            {/* Subtle glow pulse behind signature */}
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gold/15 blur-[80px] rounded-full"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 0.5, 0, -0.5, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative overflow-hidden"
              >
                <SafeImage 
                  src={signature} 
                  alt="Lionel Messi Signature" 
                  className="max-h-[200px] md:max-h-[350px] w-auto object-contain drop-shadow-[0_0_40px_rgba(201,168,76,0.4)] filter brightness-110"
                  width={800}
                  height={400}
                />
                
                {/* Shimmer Sweep Effect */}
                <motion.div 
                  animate={{ 
                    left: ['-150%', '250%']
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    repeatDelay: 6,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="h-[200px] md:h-[300px] flex items-center justify-center text-gold/20 font-anton text-4xl uppercase tracking-[0.2em] border-2 border-dashed border-gold/10 px-20">
            Signature Space
          </div>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12 text-center"
      >
        <div className="font-anton text-2xl md:text-3xl text-white tracking-widest uppercase mb-2">Lionel Messi</div>
        <div className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Official Signature</div>
      </motion.div>
    </div>
  </section>
);

const Trophies = ({ trophies }: { trophies: any[] }) => (
  <section id="trophies" className="bg-dark px-6 md:px-12 py-32">
    <div className="grid md:grid-cols-2 gap-16 items-end mb-20">
      <div>
        <div className="flex items-center gap-4 mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
          <div className="w-8 h-px bg-gold" />
          Honours
        </div>
        <h2 className="font-anton text-5xl md:text-8xl leading-[0.9] uppercase tracking-tight">Trophy<br/>Cabinet</h2>
      </div>
      <p className="text-[0.8rem] text-gray leading-[2]">From Argentina to Spain to Paris to Miami — every chapter of Messi's career has been defined by silverware. A collection no player in history can match.</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-albi/10">
      {trophies.map((trophy, i) => (
        <div key={i} className="relative group h-[280px] md:h-[350px] overflow-hidden border border-white/5">
          {trophy.imageUrl ? (
            <SafeImage 
              src={trophy.imageUrl} 
              alt={`${trophy.name} Trophy`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-40 group-hover:opacity-60"
              width={400}
              height={350}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-mid/30">
              <div className="text-4xl opacity-10">{trophy.icon}</div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex flex-col justify-end">
            <div className="font-anton text-6xl text-gold leading-none mb-2 drop-shadow-[0_0_15px_rgba(201,168,76,0.5)]">{trophy.count}</div>
            <div className="text-[0.75rem] tracking-[0.15em] font-anton uppercase text-white mb-1">{trophy.name}</div>
            <div className="text-[0.6rem] text-gray leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">{trophy.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Achievements = ({ achievements }: { achievements: any[] }) => (
  <section id="achievements" className="bg-mid px-6 md:px-12 py-32">
    <div className="flex items-center gap-4 mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
      <div className="w-8 h-px bg-gold" />
      Individual Awards
    </div>
    <h2 className="font-anton text-5xl md:text-8xl leading-[0.9] uppercase tracking-tight mb-16">Personal<br/>Milestones</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
      {achievements.map((item, i) => (
        <div key={i} className="bg-dark/50 p-8 border border-white/5 hover:border-gold/30 transition-colors">
          <div className="text-gold font-anton text-2xl mb-2">{item.year}</div>
          <div className="text-white font-anton text-xl uppercase tracking-tight mb-4">{item.title}</div>
          <p className="text-[0.7rem] text-gray leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const Timeline = ({ timeline }: { timeline: any[] }) => (
  <section id="career" className="bg-black px-6 md:px-12 py-32">
    <div className="flex items-center gap-4 mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
      <div className="w-8 h-px bg-gold" />
      The Journey
    </div>
    <h2 className="font-anton text-5xl md:text-8xl leading-[0.9] uppercase tracking-tight mb-16">Career<br/>Timeline</h2>
    <div className="relative pl-0 sm:pl-32">
      <div className="absolute left-4 sm:left-[8.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-gold to-gold/10" />
      {timeline.map((item, i) => (
        <div key={i} className="grid grid-cols-[4rem_1fr] sm:grid-cols-[8rem_1fr] gap-6 sm:gap-12 pb-12 relative">
          <div className="absolute left-4 sm:left-[8.5rem] -translate-x-1/2 top-1 w-2.5 h-2.5 rounded-full bg-gold border-2 border-black" />
          <div className="font-anton text-lg sm:text-xl text-gold tracking-widest text-left sm:text-right pr-0 sm:pr-8">{item.year}</div>
          <div>
            <div className="text-[0.7rem] sm:text-[0.8rem] tracking-wider text-white leading-relaxed mb-1">{item.event}</div>
            <div className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.15em] uppercase text-albi">{item.club}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Partners = ({ partners }: { partners: any[] }) => (
  <section className="bg-dark px-6 md:px-12 py-32">
    <div className="flex items-center gap-4 mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
      <div className="w-8 h-px bg-gold" />
      Partners & Campaigns
    </div>
    <h2 className="font-anton text-5xl md:text-8xl leading-[0.9] uppercase tracking-tight mb-16">Brands &<br/>Sponsors</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-albi/10">
      {partners.map((partner, i) => (
        <div key={i} className="p-10 border-r border-b border-albi/10 flex flex-col items-center justify-center hover:bg-albi/5 transition-colors group gap-4 min-h-[180px]">
          {partner.logo ? (
            <SafeImage 
              src={partner.logo} 
              alt={partner.name} 
              className="max-w-[80%] max-h-[60px] object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              width={120}
              height={60}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold/20">
              <Users size={20} />
            </div>
          )}
          <span className="font-anton text-[0.7rem] tracking-widest text-gray group-hover:text-gold transition-colors uppercase text-center">{partner.name}</span>
        </div>
      ))}
    </div>
  </section>
);

const Social = ({ photos }: { photos: string[] }) => (
  <motion.section 
    id="social" 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className="bg-black px-6 md:px-12 py-32 text-center"
  >
    <div className="flex items-center justify-center gap-4 mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
      <div className="w-8 h-px bg-gold" />
      Follow Leo
    </div>
    <h2 className="font-anton text-5xl md:text-8xl leading-[0.9] uppercase tracking-tight mb-16">On Social</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
      {photos.map((img, i) => (
        <div key={i} className="aspect-square border border-albi/10 flex items-center justify-center text-[0.6rem] tracking-[0.2em] uppercase text-albi/20 group cursor-pointer overflow-hidden">
          {img ? (
            <SafeImage 
              src={img} 
              alt={`Social Media Post ${i + 1}`} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-90 transition-all duration-700 ease-out"
              width={400}
              height={400}
            />
          ) : (
            <div className="group-hover:scale-110 transition-transform duration-500">[ Instagram Photo Slot ]</div>
          )}
        </div>
      ))}
    </div>
    <div className="flex flex-wrap justify-center gap-8">
      {[
        { name: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
        { name: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
        { name: 'X / Twitter', icon: <Twitter className="w-4 h-4" /> },
        { name: 'Facebook', icon: <Facebook className="w-4 h-4" /> }
      ].map(social => (
        <a key={social.name} href="#" className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-white/60 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1">
          {social.icon} {social.name}
        </a>
      ))}
    </div>
  </motion.section>
);

const Footer = ({ bgImage }: { bgImage: string }) => (
  <footer className="relative bg-dark px-6 md:px-12 pt-20 pb-12 border-t border-albi/15 overflow-hidden group">
    {/* Background Image with Glossy Effect */}
    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
      <SafeImage 
        src={bgImage} 
        alt="Footer Background Image" 
        className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
        width={1920}
        height={600}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(201,168,76,0.1),transparent)] animate-[spin_10s_linear_infinite]" />
      </div>
    </div>

    <div className="relative z-10 grid md:grid-cols-3 gap-16 mb-16">
      <div>
        <div className="font-anton text-5xl text-gold leading-none mb-6">LM<br/>10</div>
        <p className="font-playfair italic text-gray leading-relaxed">"Always bringing the fight."</p>
      </div>
      <div>
        <div className="text-[0.6rem] tracking-[0.25em] uppercase text-gold mb-6">Pages</div>
        <ul className="space-y-3">
          {['Story', 'On Pitch', 'Trophies', 'Career', 'Social'].map(item => (
            <li key={item}><a href="#" className="text-[0.75rem] text-gray hover:text-white transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-[0.6rem] tracking-[0.25em] uppercase text-gold mb-6">Follow</div>
        <ul className="space-y-3">
          {['Instagram', 'YouTube', 'X / Twitter', 'TikTok', 'Facebook'].map(item => (
            <li key={item}><a href="#" className="text-[0.75rem] text-gray hover:text-white transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="relative z-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="text-[0.6rem] tracking-widest text-gray">© 2026 Lionel Messi. All rights reserved.</span>
      <div className="flex gap-8">
        <a href="#" className="text-[0.6rem] tracking-widest text-gray hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="text-[0.6rem] tracking-widest text-gray hover:text-white transition-colors">Terms</a>
      </div>
    </div>
  </footer>
);

// --- Main App ---

const Preloader = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center"
  >
    <div className="relative">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gold/20 blur-[60px] rounded-full"
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-anton text-7xl md:text-9xl text-gold leading-none tracking-tighter text-center relative z-10"
      >
        LM<br/>10
      </motion.div>
    </div>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: "120px" }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="h-[2px] bg-gold mt-8 relative overflow-hidden"
    >
      <motion.div 
        animate={{ left: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-white/40"
      />
    </motion.div>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 0.5 }}
      className="text-[0.5rem] tracking-[0.4em] uppercase text-gold mt-4"
    >
      Authenticating Greatness
    </motion.p>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-12 text-[0.45rem] tracking-[0.5em] uppercase text-white/50"
    >
      Site Crafted by <span className="text-gold">Johnmark</span>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [heroData, setHeroData] = useState({
    name1: 'Lionel',
    name2: 'Messi',
    tag: 'Inter Miami CF · Argentine National Team',
    bgImage: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=1974&auto=format&fit=crop',
    profileImage: 'https://www.pngall.com/wp-content/uploads/2016/05/Lionel-Messi-PNG-Image.png'
  });

  const [quoteData, setQuoteData] = useState({
    text: 'I had to grow up fast, leave my home, leave my family — and I did it all with one purpose. To play football. To be the best.',
    attr: '— Lionel Messi'
  });

  const [footerData, setFooterData] = useState({
    bgImage: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=1974&auto=format&fit=crop'
  });

  const [photoStripData, setPhotoStripData] = useState([
    { year: 'Qatar · 2022', title: 'World Cup Glory', icon: <Globe className="w-10 h-10 text-albi opacity-30" />, image: '' },
    { year: 'Paris · 2023', title: '8th Ballon d\'Or', icon: <Star className="w-10 h-10 text-gold opacity-30" />, image: '' },
    { year: 'Berlin · 2015', title: 'UCL Treble', icon: <Trophy className="w-10 h-10 text-albi opacity-30" />, image: '' },
    { year: 'Brazil · 2021', title: 'Copa América Win', icon: <Globe className="w-10 h-10 text-gold opacity-30" />, image: '' },
    { year: 'Miami · 2023', title: 'MLS Debut', icon: <Star className="w-10 h-10 text-albi opacity-30" />, image: '' },
    { year: 'Camp Nou · 2012', title: '91 Goals Season', icon: <Trophy className="w-10 h-10 text-gold opacity-30" />, image: '' },
  ]);

  const [trophiesData, setTrophiesData] = useState([
    { count: '8×', name: "Ballon d'Or", desc: "2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023", icon: "⭐", imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop" },
    { count: '1×', name: "FIFA World Cup", desc: "Qatar 2022 — Player of the Tournament", icon: "🏆", imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000&auto=format&fit=crop" },
    { count: '3×', name: "Copa América", desc: "2021 (Brazil), 2024 (USA), 2019 (runner-up)", icon: "🥇", imageUrl: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=1000&auto=format&fit=crop" },
    { count: '4×', name: "Champions League", desc: "2006, 2009, 2011, 2015 with FC Barcelona", icon: "🏅", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop" },
    { count: '10×', name: "La Liga", desc: "All 10 titles won with FC Barcelona", icon: "🇪🇸", imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop" },
    { count: '7×', name: "Copa del Rey", desc: "Spain's domestic cup — FC Barcelona era", icon: "🏟", imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop" },
    { count: '3×', name: "Club World Cup", desc: "FIFA Club World Cup champion", icon: "🌍", imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000&auto=format&fit=crop" },
    { count: '6×', name: "European Golden Shoe", desc: "Top scorer in European leagues — record 6 times", icon: "⚽", imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop" }
  ]);

  const [timelineData, setTimelineData] = useState([
    { year: '2000', event: 'Signs with FC Barcelona aged 13 — legendary napkin contract', club: 'FC Barcelona Youth Academy' },
    { year: '2004', event: 'Liga debut at 17 — becomes youngest Barça player at the time', club: 'FC Barcelona' },
    { year: '2009', event: 'First Ballon d\'Or · Champions League · Treble season under Pep Guardiola', club: 'FC Barcelona' },
    { year: '2012', event: 'Records 91 goals in a single calendar year — a world record', club: 'FC Barcelona' },
    { year: '2021', event: 'Signs for Paris Saint-Germain · Wins Copa América with Argentina', club: 'PSG · Argentina' },
    { year: '2022', event: 'Wins the FIFA World Cup in Qatar · Named Player of the Tournament', club: 'Argentina National Team' },
    { year: '2023', event: 'Joins Inter Miami CF · Wins 8th Ballon d\'Or · Leagues Cup champion', club: 'Inter Miami CF · MLS' }
  ]);

  const [statsData, setStatsData] = useState([
    { num: '1,074', label: 'Total Career Goals', group: 'Total' },
    { num: '372', label: 'Total Career Assists', group: 'Total' },
    { num: '109', label: 'Argentina Goals', group: 'Clubs & Country' },
    { num: '672', label: 'Barcelona Goals', group: 'Clubs & Country' },
    { num: '32', label: 'PSG Goals', group: 'Clubs & Country' },
    { num: '25', label: 'Inter Miami Goals', group: 'Clubs & Country' },
    { num: '13', label: 'World Cup Goals', group: 'World Cup' },
    { num: '1', label: 'World Cup Trophy', group: 'World Cup' }
  ]);

  const [seoData, setSeoData] = useState({
    title: 'Lionel Messi | Official Portfolio',
    description: 'The official portfolio of the Greatest of All Time, Lionel Messi.',
    keywords: 'Messi, Football, GOAT, Barcelona, Argentina, Inter Miami'
  });

  const [achievementsData, setAchievementsData] = useState([
    { year: '2023', title: "Ballon d'Or #8", desc: "Record-extending eighth award after World Cup win." },
    { year: '2022', title: "World Cup Golden Ball", desc: "Best player of the FIFA World Cup 2022." },
    { year: '2012', title: "Guinness World Record", desc: "91 goals in a single calendar year." }
  ]);

  const [partnersData, setPartnersData] = useState([
    { name: 'Adidas', logo: '' },
    { name: 'Pepsi', logo: '' },
    { name: 'Hard Rock', logo: '' },
    { name: 'Apple TV+', logo: '' },
    { name: 'Budweiser', logo: '' },
    { name: 'MLS', logo: '' },
    { name: 'Lay\'s', logo: '' },
    { name: 'Gatorade', logo: '' },
    { name: 'Michelob', logo: '' },
    { name: 'Jacob & Co', logo: '' },
    { name: 'Crypto.com', logo: '' },
    { name: 'Socios', logo: '' }
  ]);

  const [signatureData, setSignatureData] = useState('');

  const [socialPhotosData, setSocialPhotosData] = useState(['', '', '', '', '', '']);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Data Sync
  useEffect(() => {
    if (!isAuthReady) return;

    const mainDoc = doc(db, 'config', 'main');
    const mediaDoc = doc(db, 'config', 'media');
    
    let mainLoaded = false;
    let mediaLoaded = false;

    const checkLoaded = () => {
      if (mainLoaded && mediaLoaded) {
        setIsDataLoaded(true);
      }
    };

    const unsubMain = onSnapshot(mainDoc, (snapshot) => {
      if (snapshot.metadata.hasPendingWrites) return;
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.hero) setHeroData(data.hero);
        if (data.quote) setQuoteData(data.quote);
        if (data.footer) setFooterData(data.footer);
        if (data.trophies) setTrophiesData(data.trophies);
        if (data.timeline) setTimelineData(data.timeline);
        if (data.stats) setStatsData(data.stats);
        if (data.seo) setSeoData(data.seo);
        if (data.achievements) setAchievementsData(data.achievements);
      }
      mainLoaded = true;
      checkLoaded();
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'config/main');
      mainLoaded = true;
      checkLoaded();
    });

    const unsubMedia = onSnapshot(mediaDoc, (snapshot) => {
      if (snapshot.metadata.hasPendingWrites) return;
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.photoStrip) setPhotoStripData(data.photoStrip);
        if (data.socialPhotos) setSocialPhotosData(data.socialPhotos);
        if (data.partners) setPartnersData(data.partners);
        if (data.signature !== undefined) setSignatureData(data.signature);
      }
      mediaLoaded = true;
      checkLoaded();
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'config/media');
      mediaLoaded = true;
      checkLoaded();
    });

    return () => {
      unsubMain();
      unsubMedia();
    };
  }, [isAuthReady]);

  // Save Data Helpers
  const saveToMain = async (updates: any) => {
    try {
      const configDoc = doc(db, 'config', 'main');
      await setDoc(configDoc, updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/main');
    }
  };

  const saveToMedia = async (updates: any) => {
    try {
      const configDoc = doc(db, 'config', 'media');
      await setDoc(configDoc, updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/media');
    }
  };

  // Update SEO Meta Tags
  useEffect(() => {
    document.title = seoData.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seoData.description);
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seoData.keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = seoData.keywords;
      document.head.appendChild(meta);
    }
  }, [seoData]);

  const handleLogoClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
  };

  // Reset click count after 2 seconds of inactivity
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black cursor-none">
      <AnimatePresence>
        {!isDataLoaded && <Preloader key="preloader" />}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <CustomCursor />
      <Navbar onLogoClick={handleLogoClick} />
      
      <main>
        <Hero {...heroData} stats={statsData} />
        <div className="h-[3px] bg-gradient-to-r from-albi via-white to-albi" />
        <Marquee />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <Story />
        </motion.div>

        <PhotoStrip photos={photoStripData} />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <SignatureSection signature={signatureData} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-black text-center py-32 px-6 md:px-12"
        >
          <motion.blockquote 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl md:text-6xl italic text-white max-w-4xl mx-auto mb-8"
          >
            "{quoteData.text.split(' ').map((word, i) => (
              <span key={i} className={['grow', 'best', 'purpose'].includes(word.toLowerCase().replace(/[^a-z]/g, '')) ? 'text-gold not-italic' : ''}>
                {word}{' '}
              </span>
            ))}"
          </motion.blockquote>
          <cite className="text-[0.6rem] tracking-[0.25em] uppercase text-gray">{quoteData.attr}</cite>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Trophies trophies={trophiesData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Achievements achievements={achievementsData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Timeline timeline={timelineData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Partners partners={partnersData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Social photos={socialPhotosData} />
        </motion.div>
      </main>

      <Footer bgImage={footerData.bgImage} />
      
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            user={user}
            onLogin={loginWithGoogle}
            onLogout={logout}
            heroData={heroData} 
            setHeroData={(data) => { setHeroData(data); saveToMain({ hero: data }); }} 
            quoteData={quoteData} 
            setQuoteData={(data) => { setQuoteData(data); saveToMain({ quote: data }); }} 
            footerData={footerData}
            setFooterData={(data) => { setFooterData(data); saveToMain({ footer: data }); }}
            photoStripData={photoStripData}
            setPhotoStripData={(data) => { setPhotoStripData(data); saveToMedia({ photoStrip: data }); }}
            socialPhotosData={socialPhotosData}
            setSocialPhotosData={(data) => { setSocialPhotosData(data); saveToMedia({ socialPhotos: data }); }}
            trophiesData={trophiesData}
            setTrophiesData={(data) => { setTrophiesData(data); saveToMain({ trophies: data }); }}
            timelineData={timelineData}
            setTimelineData={(data) => { setTimelineData(data); saveToMain({ timeline: data }); }}
            statsData={statsData}
            setStatsData={(data) => { setStatsData(data); saveToMain({ stats: data }); }}
            seoData={seoData}
            setSeoData={(data) => { setSeoData(data); saveToMain({ seo: data }); }}
            achievementsData={achievementsData}
            setAchievementsData={(data) => { setAchievementsData(data); saveToMain({ achievements: data }); }}
            partnersData={partnersData}
            setPartnersData={(data) => { setPartnersData(data); saveToMedia({ partners: data }); }}
            signatureData={signatureData}
            setSignatureData={(data) => { setSignatureData(data); saveToMedia({ signature: data }); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
