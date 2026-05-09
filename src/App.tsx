import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Plus, 
  ShoppingBasket, 
  Home, 
  UtensilsCrossed, 
  Tag, 
  User as UserIcon, 
  Flame, 
  Box,
  LogOut,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  loginWithGoogle, 
  logout, 
  getDishes, 
  getCombos, 
  createOrder, 
  testConnection,
  seedDatabase
} from './services/firebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Components ---

const Header = ({ user }: { user: User | null }) => (
  <motion.header 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border-b border-outline-variant/10"
  >
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 p-2.5 rounded-2xl">
        <MapPin className="text-primary w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/60">Delivering to</span>
        <span className="text-base font-bold text-primary truncate max-w-[170px] tracking-tight">Vinayaka Nagar Colony</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant shadow-sm" 
        id="header-search"
      >
        <Search className="w-5 h-5" />
      </motion.button>
      <div className="flex items-center gap-2">
        {user ? (
          <div className="w-12 h-12 rounded-2xl border-2 border-primary-container p-0.5 relative group cursor-pointer" onClick={() => logout()}>
            <img 
              src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
              alt="User" 
              className="w-full h-full object-cover rounded-[14px]"
            />
            <div className="absolute inset-0 bg-black/40 rounded-[14px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <LogOut className="text-white w-5 h-5" />
            </div>
          </div>
        ) : (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => loginWithGoogle()}
            className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg"
          >
            <LogIn className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  </motion.header>
);

const HygieneBadge = () => (
  <section className="px-5 mt-4">
    <div className="bg-surface-container-low border border-outline-variant/30 flex items-center gap-4 p-4 rounded-2xl">
      <div className="bg-secondary-container/20 p-2 rounded-full">
        <ShieldCheck className="text-secondary w-6 h-6 fill-secondary/20" />
      </div>
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Hygiene Certified</h3>
        <p className="text-xs text-on-surface-variant">100% contactless preparation & surgical-grade sanitization.</p>
      </div>
    </div>
  </section>
);

const HeroBanner = () => (
  <motion.section 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="px-6 mt-8"
  >
    <div className="relative w-full h-[380px] rounded-[40px] overflow-hidden shadow-2xl group">
      <img 
        src="https://images.unsplash.com/photo-1596797038558-45e07663f707?auto=format&fit=crop&q=80&w=1200" 
        alt="Chef's Special Biryani" 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full w-fit mb-4 uppercase">
          CHEF'S SPECIAL
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tighter">
          Chef's <br /> Recommendations
        </h1>
        <p className="text-sm md:text-base text-white/80 max-w-[320px] mb-8 leading-relaxed font-medium">
          Experience the royal heritage of our Slow-Cooked Biryani, infused with 24 hand-ground spices.
        </p>
        <button className="bg-primary text-white font-black px-10 py-4 rounded-2xl w-fit transition-all shadow-[0_10px_20px_rgb(159,61,0,0.3)] hover:shadow-[0_15px_30px_rgb(159,61,0,0.4)]" id="hero-order-now">
          Order Now
        </button>
      </div>
    </div>
  </motion.section>
);

const Bestsellers = ({ dishes, onAdd }: { dishes: any[], onAdd: (item: any) => void }) => {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between px-6 mb-6">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight">Bestsellers</h2>
        <button className="text-primary font-bold text-sm flex items-center gap-1 group" id="view-all-bestsellers">
          View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <div className="flex overflow-x-auto gap-5 px-6 pb-6 no-scrollbar">
        {dishes.map((item, idx) => (
          <motion.div 
            key={item.id || `dish-${idx}`} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex-shrink-0 w-[280px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/10 overflow-hidden" 
          >
            <div className="relative h-[180px] overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Star className="w-3.5 h-3.5 text-secondary-container fill-secondary-container" />
                <span className="text-xs font-black">{item.rating}</span>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-on-surface truncate pr-2 tracking-tight">{item.name}</h3>
                <div className={`w-4 h-4 border-2 rounded-sm ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'} flex items-center justify-center flex-shrink-0 mt-1`}>
                  <div className={`w-2 h-2 ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-snug">{item.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-primary font-bold text-xl tracking-tight">₹{item.price}</span>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAdd(item)}
                  className="bg-on-surface text-secondary-container px-6 py-2 rounded-xl font-black text-xs shadow-sm" 
                >
                  ADD
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ValueCombos = ({ combos, onAdd }: { combos: any[], onAdd: (item: any) => void }) => {
  const familyCombo = combos.find(c => c.type === 'family');
  const otherCombos = combos.filter(c => c.type !== 'family');

  return (
    <section className="px-6 mt-12 space-y-6">
      <h2 className="text-2xl font-bold text-on-surface tracking-tight">Value Combos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {familyCombo && (
          <motion.div 
            whileHover={{ y: -5 }}
            className="relative rounded-[32px] overflow-hidden h-[300px] md:col-span-2 bg-tertiary-container group shadow-lg" 
          >
            <img 
              src={familyCombo.image} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              alt={familyCombo.title} 
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{familyCombo.title}</h3>
              <p className="text-white/80 text-sm mb-5 font-medium">{familyCombo.subtitle}</p>
              <span 
                onClick={() => onAdd(familyCombo)}
                className="bg-primary-container text-white px-6 py-3 rounded-2xl font-black text-sm w-fit shadow-lg backdrop-blur-sm border border-white/10 cursor-pointer active:scale-95 transition-transform"
              >
                ₹{familyCombo.price} onwards
              </span>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 md:col-span-1 lg:col-span-1">
          {otherCombos.map((combo) => (
            <motion.div 
              key={combo.id}
              whileHover={{ x: 5 }}
              className={`p-7 rounded-[32px] flex flex-col justify-between shadow-sm border group ${combo.type === 'lunch' ? 'bg-[#FFE5B4]/30 border-[#FFE5B4]/50' : 'bg-primary/5 border-primary/10'}`} 
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${combo.type === 'lunch' ? 'bg-secondary-container/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                  {combo.type === 'lunch' ? <Box className="w-6 h-6" /> : <Flame className="w-6 h-6 fill-primary-container/20" />}
                </div>
                <h4 className="font-bold text-lg text-on-surface tracking-tight">{combo.title}</h4>
                <p className="text-sm mt-1.5 text-on-surface-variant/80 font-medium leading-relaxed">{combo.subtitle}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-bold text-2xl text-primary tracking-tight">₹{combo.price}</span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAdd(combo)}
                  className={`p-3 rounded-2xl shadow-lg active:scale-90 transition-all ${combo.type === 'lunch' ? 'bg-on-surface text-secondary-container' : 'bg-primary text-white shadow-primary/20'}`}
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HeatCustomizer = () => (
  <section className="px-6 mt-12 mb-20">
    <div className="bg-surface-container-highest/50 rounded-[40px] p-8 border border-outline-variant/30 flex flex-col items-center text-center gap-8 shadow-inner overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="space-y-2 relative z-10">
        <h3 className="text-3xl font-black text-on-surface tracking-tighter">Tailor Your Heat</h3>
        <p className="text-sm text-on-surface-variant/80 font-medium max-w-[280px]">From mild saffron aromas to the fiery kick of Guntur chilies.</p>
      </div>
      <div className="flex gap-6 relative z-10">
        {[
          { label: 'Mild', color: '#FFB700', icon: Flame, size: 24 },
          { label: 'Medium', color: '#E85D04', icon: Flame, size: 28 },
          { label: 'Spicy', color: '#9F3D00', icon: Flame, size: 32, active: true }
        ].map((level) => (
          <div key={level.label} className="flex flex-col items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-all duration-300 ${level.active ? 'scale-125 ring-4 ring-primary/20 bg-gradient-to-tr from-primary to-primary-container' : 'opacity-60 bg-white shadow-sm'}`}
              style={!level.active ? { color: level.color } : {}}
            >
              <level.icon 
                className={`transition-all duration-300 ${level.active ? 'fill-white' : ''}`} 
                size={level.size} 
              />
            </motion.div>
            <span className={`text-xs font-black uppercase tracking-widest ${level.active ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
              {level.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl flex justify-around items-center pt-4 pb-8 px-6 z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(159,61,0,0.08)] border-t border-outline-variant/10">
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center gap-1.5 text-primary" 
      id="nav-home"
    >
      <div className="bg-primary/10 px-6 py-2 rounded-2xl transition-all shadow-sm">
        <Home className="w-5 h-5 fill-primary" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
    </motion.div>
    
    <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1.5 text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer" id="nav-menu">
      <UtensilsCrossed className="w-6 h-6" />
      <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
    </motion.div>
    
    <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1.5 text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer" id="nav-offers">
      <Tag className="w-6 h-6" />
      <span className="text-[10px] font-black uppercase tracking-widest">Offers</span>
    </motion.div>
    
    <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1.5 text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer" id="nav-profile">
      <UserIcon className="w-6 h-6" />
      <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
    </motion.div>
  </nav>
);

const FloatingCart = ({ count }: { count: number }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.button 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-32 right-6 bg-primary text-white pl-6 pr-8 py-5 rounded-[32px] shadow-[0_15px_35px_rgba(159,61,0,0.3)] z-40 transition-all flex items-center gap-4 group" 
        id="floating-cart"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-white/20 rounded-full blur group-hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100" />
          <ShoppingBasket className="w-7 h-7 relative z-10" />
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-secondary-container rounded-full border-2 border-primary flex items-center justify-center animate-pulse" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">View Cart</span>
          <span className="text-base font-black tracking-tight">Cart ({count})</span>
        </div>
      </motion.button>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [dishes, setDishes] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Only attempt fetching/seeding once we know auth state
      fetchData(u);
    });

    const fetchData = async (currentUser: User | null) => {
      try {
        const d = await getDishes() || [];
        const c = await getCombos() || [];
        
        if (d.length === 0 && c.length === 0) {
          // Empty DB, check if current user is admin before seeding
          const adminEmail = 'lokeshnani8001@gmail.com';
          if (currentUser?.email === adminEmail && currentUser?.emailVerified) {
            console.log("Empty DB & Admin detected, seeding...");
            await seedInitialData();
          } else {
            console.log("Empty DB, waiting for admin to seed...");
            // Use local mock data for non-admin/logged-out users for demo purposes
            setDishes(getMockDishes());
            setCombos(getMockCombos());
          }
        } else {
          setDishes(d);
          setCombos(c);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    return () => unsubscribe();
  }, []);

  const getMockDishes = () => [
    {
      id: "mock-1",
      name: "Chicken Biryani",
      description: "Succulent chicken leg pieces layered with aromatic long-grain basmati rice.",
      price: 349,
      rating: 4.8,
      type: "non-veg",
      category: "Main Course",
      isBestseller: true,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "mock-2",
      name: "Mutton Biryani",
      description: "Heritage recipe featuring slow-cooked mutton pieces in a spicy blend.",
      price: 489,
      rating: 4.9,
      type: "non-veg",
      category: "Main Course",
      isBestseller: true,
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "mock-3",
      name: "Veg Biryani",
      description: "Garden-fresh vegetables slow-cooked with fragrant spices and basmati.",
      price: 279,
      rating: 4.6,
      type: "veg",
      category: "Main Course",
      isBestseller: true,
      image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const getMockCombos = () => [
    {
      id: "mock-c1",
      title: "Family Feast Pack",
      subtitle: "Feeds 3-4 People • Includes Starters & Drinks",
      price: 399,
      type: "family",
      image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "mock-c2",
      title: "Lunch Box Combo",
      subtitle: "Mini Biryani + Raita + Gulab Jamun",
      price: 249,
      type: "lunch",
    },
    {
      id: "mock-c3",
      title: "Spice Lover's Duo",
      subtitle: "Spicy Biryani + Cold Beverage",
      price: 299,
      type: "spice",
    }
  ];

  const seedInitialData = async () => {
    const initialDishes = getMockDishes().map(({ id, ...rest }) => rest);
    const initialCombos = getMockCombos().map(({ id, ...rest }) => rest);

    await seedDatabase(initialDishes, initialCombos);
    // Refresh state after seeding
    const d = await getDishes() || [];
    const c = await getCombos() || [];
    setDishes(d.length > 0 ? d : getMockDishes());
    setCombos(c.length > 0 ? c : getMockCombos());
  };

  const addToCart = (item: any) => {
    setCart((prev) => [...prev, item]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen-md mx-auto pb-32 bg-background selection:bg-primary/20">
      <Header user={user} />
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <HygieneBadge />
        <HeroBanner />
        <Bestsellers dishes={dishes.filter(d => d.isBestseller)} onAdd={addToCart} />
        <ValueCombos combos={combos} onAdd={addToCart} />
        <HeatCustomizer />
      </main>
      <FloatingCart count={cart.length} />
      <BottomNav />
    </div>
  );
}
