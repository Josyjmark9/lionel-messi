import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Type, 
  BookOpen, 
  Image as ImageIcon, 
  Trophy, 
  History, 
  BarChart3, 
  Users, 
  Share2, 
  Menu, 
  Palette, 
  Search, 
  Eye, 
  Download,
  X,
  Plus,
  Trash2,
  GripVertical,
  Star,
  Settings,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  heroData: any;
  setHeroData: (data: any) => void;
  quoteData: any;
  setQuoteData: (data: any) => void;
  footerData: any;
  setFooterData: (data: any) => void;
  photoStripData: any[];
  setPhotoStripData: (data: any[]) => void;
  socialPhotosData: string[];
  setSocialPhotosData: (data: string[]) => void;
  trophiesData: any[];
  setTrophiesData: (data: any[]) => void;
  timelineData: any[];
  setTimelineData: (data: any[]) => void;
  statsData: any[];
  setStatsData: (data: any[]) => void;
  seoData: any;
  setSeoData: (data: any) => void;
  achievementsData: any[];
  setAchievementsData: (data: any[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  heroData, 
  setHeroData, 
  quoteData, 
  setQuoteData,
  footerData,
  setFooterData,
  photoStripData,
  setPhotoStripData,
  socialPhotosData,
  setSocialPhotosData,
  trophiesData,
  setTrophiesData,
  timelineData,
  setTimelineData,
  statsData,
  setStatsData,
  seoData,
  setSeoData,
  achievementsData,
  setAchievementsData
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'footer') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'hero') {
          setHeroData({ ...heroData, bgImage: reader.result as string });
        } else {
          setFooterData({ ...footerData, bgImage: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoStripUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = [...photoStripData];
        newData[index] = { ...newData[index], image: reader.result as string };
        setPhotoStripData(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = [...socialPhotosData];
        newData[index] = reader.result as string;
        setSocialPhotosData(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { id: 'hero', label: 'Hero Section', icon: <Type size={14} /> },
    { id: 'story', label: 'Story / Bio', icon: <BookOpen size={14} /> },
    { id: 'photos', label: 'Photo Strip', icon: <ImageIcon size={14} /> },
    { id: 'trophies', label: 'Honours & Trophies', icon: <Trophy size={14} /> },
    { id: 'achievements', label: 'Individual Awards', icon: <Star size={14} /> },
    { id: 'timeline', label: 'Career Timeline', icon: <History size={14} /> },
    { id: 'stats', label: 'Stats Bar', icon: <BarChart3 size={14} /> },
    { id: 'partners', label: 'Partners & Brands', icon: <Users size={14} /> },
    { id: 'social', label: 'Social Media', icon: <Share2 size={14} /> },
    { id: 'nav-footer', label: 'Nav & Footer', icon: <Menu size={14} /> },
    { id: 'colours', label: 'Colours & Fonts', icon: <Palette size={14} /> },
    { id: 'seo', label: 'SEO & Meta', icon: <Search size={14} /> },
    { id: 'export', label: 'Export / Deploy', icon: <Download size={14} /> },
  ];

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-black flex"
    >
      {/* Sidebar */}
      <aside className="w-64 bg-dark border-r border-gold/15 flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-bottom border-gold/15">
          <div className="font-bebas text-2xl text-gold tracking-widest leading-none mb-1">LM · 10</div>
          <div className="text-[0.6rem] tracking-[0.2em] uppercase text-gray">Website Admin Panel</div>
        </div>

        <div className="flex-1 py-4">
          <div className="px-6 py-2 text-[0.5rem] tracking-[0.3em] uppercase text-gray">Main Pages</div>
          {tabs.slice(0, 7).map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="opacity-60">{tab.icon}</span>
              {tab.label}
            </div>
          ))}

          <div className="px-6 py-4 text-[0.5rem] tracking-[0.3em] uppercase text-gray border-t border-white/5">Site Elements</div>
          {tabs.slice(7, 10).map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="opacity-60">{tab.icon}</span>
              {tab.label}
            </div>
          ))}

          <div className="px-6 py-4 text-[0.5rem] tracking-[0.3em] uppercase text-gray border-t border-white/5">Design & Settings</div>
          {tabs.slice(10).map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="opacity-60">{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gold/15">
          <div className="text-[0.55rem] tracking-widest uppercase text-gray leading-relaxed">
            Website built by<br/>
            <strong className="text-gold text-[0.65rem] block">Josiah Johnmark</strong>
            <span className="text-albi">Creative Developer</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-dark border-b border-gold/15 px-8 py-4 flex justify-between items-center">
          <h2 className="font-anton text-lg tracking-wider uppercase text-white">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green/10 text-green border border-green/20 text-[0.55rem] tracking-widest uppercase rounded-sm">● Live</span>
            <button 
              onClick={onClose}
              className="p-2 text-gray hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-gold/5 border border-gold/20 p-6 rounded flex gap-4 items-start">
                  <Star className="text-gold shrink-0" size={18} />
                  <p className="text-[0.65rem] leading-relaxed text-white/80">
                    You are managing the <strong>Lionel Messi Official Website</strong>. Use the sidebar to navigate and edit each section. Changes apply site-wide instantly.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { val: '8', label: "Ballon d'Or" },
                    { val: '1', label: 'World Cup' },
                    { val: '12', label: 'Sections Live' },
                    { val: '6', label: 'Photo Slots' }
                  ].map(stat => (
                    <div key={stat.label} className="bg-mid border border-gold/15 p-4 text-center rounded">
                      <div className="font-anton text-2xl text-gold leading-none mb-1">{stat.val}</div>
                      <div className="text-[0.55rem] tracking-widest uppercase text-gray">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="admin-card">
                    <h3 className="admin-label text-gold mb-6 flex items-center gap-2">
                      <Eye size={12} /> Site Completion
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Hero Section', val: 100, color: 'bg-gold' },
                        { label: 'Photos', val: 20, color: 'bg-orange' },
                        { label: 'Trophy Cabinet', val: 100, color: 'bg-gold' },
                        { label: 'Social Links', val: 0, color: 'bg-red' }
                      ].map(item => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex justify-between text-[0.6rem]">
                            <span>{item.label}</span>
                            <span className="text-gold">{item.val}%</span>
                          </div>
                          <div className="h-1 bg-dark rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="admin-card">
                    <h3 className="admin-label text-gold mb-6 flex items-center gap-2">
                      <Plus size={12} /> Quick Actions
                    </h3>
                    <div className="grid gap-3">
                      <button onClick={() => setActiveTab('photos')} className="w-full bg-gold text-black py-2.5 text-[0.6rem] font-bold tracking-widest uppercase hover:bg-gold-light transition-colors">Upload Photos</button>
                      <button onClick={() => setActiveTab('social')} className="w-full border border-gold/40 text-gold py-2.5 text-[0.6rem] tracking-widest uppercase hover:bg-gold/5 transition-colors">Add Social Links</button>
                      <button onClick={() => setActiveTab('hero')} className="w-full border border-gold/40 text-gold py-2.5 text-[0.6rem] tracking-widest uppercase hover:bg-gold/5 transition-colors">Edit Hero Text</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'hero' && (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div className="admin-card">
                    <h3 className="admin-label text-gold mb-6">Name & Title</h3>
                    <div className="admin-field">
                      <label className="admin-label">Name — Line 1</label>
                      <input 
                        type="text" 
                        value={heroData.name1} 
                        onChange={(e) => setHeroData({ ...heroData, name1: e.target.value })}
                        className="admin-input" 
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Name — Line 2</label>
                      <input 
                        type="text" 
                        value={heroData.name2} 
                        onChange={(e) => setHeroData({ ...heroData, name2: e.target.value })}
                        className="admin-input" 
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Gold Tag Line</label>
                      <input 
                        type="text" 
                        value={heroData.tag} 
                        onChange={(e) => setHeroData({ ...heroData, tag: e.target.value })}
                        className="admin-input" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="admin-card">
                    <h3 className="admin-label text-gold mb-6">Main Vintage Image</h3>
                    <p className="text-[0.55rem] text-gray mb-4 italic">This is the large background image that appears on the first page with a smooth fade-in animation.</p>
                    <div className="admin-img-slot relative overflow-hidden group">
                      {heroData.bgImage ? (
                        <img src={heroData.bgImage} alt="Hero BG" className="w-full h-full object-cover opacity-50" />
                      ) : (
                        <>
                          <Plus size={20} className="opacity-40" />
                          <span>Main Messi Photo</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'hero')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="admin-field mt-4">
                      <label className="admin-label">Or paste image URL</label>
                      <input 
                        type="url" 
                        value={heroData.bgImage || ''}
                        onChange={(e) => setHeroData({ ...heroData, bgImage: e.target.value })}
                        placeholder="https://..." 
                        className="admin-input" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'story' && (
              <motion.div 
                key="story"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-8"
              >
                <div className="admin-card">
                  <h3 className="admin-label text-gold mb-6">Pull Quote</h3>
                  <div className="admin-field">
                    <label className="admin-label">Quote Text</label>
                    <textarea 
                      rows={4} 
                      value={quoteData.text}
                      onChange={(e) => setQuoteData({ ...quoteData, text: e.target.value })}
                      className="admin-input resize-none" 
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Attribution</label>
                    <input 
                      type="text" 
                      value={quoteData.attr}
                      onChange={(e) => setQuoteData({ ...quoteData, attr: e.target.value })}
                      className="admin-input" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'nav-footer' && (
              <motion.div 
                key="nav-footer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-8"
              >
                <div className="admin-card">
                  <h3 className="admin-label text-gold mb-6">Footer Background</h3>
                  <div className="admin-field">
                    <label className="admin-label">Upload from System</label>
                    <div className="relative">
                      <button className="w-full bg-mid border border-white/10 text-white p-3 font-mono text-[0.65rem] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                        <Upload size={14} /> Choose File
                      </button>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'footer')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="admin-field mt-4">
                    <label className="admin-label">Or paste image URL</label>
                    <input 
                      type="url" 
                      value={footerData.bgImage}
                      onChange={(e) => setFooterData({ ...footerData, bgImage: e.target.value })}
                      placeholder="https://..." 
                      className="admin-input" 
                    />
                    <p className="text-[0.55rem] text-gray mt-2 italic">Paste a link to a vintage Lionel Messi image here. The footer will apply a glossy, grayscale-to-color transition on hover.</p>
                  </div>
                  <div className="mt-4 aspect-video bg-mid border border-white/5 rounded overflow-hidden">
                    <img 
                      src={footerData.bgImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover opacity-50"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'photos' && (
              <motion.div 
                key="photos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-6"
              >
                {photoStripData.map((photo, i) => (
                  <div key={i} className="admin-card">
                    <h3 className="admin-label text-gold mb-4 flex items-center justify-between">
                      Slot {i + 1}: {photo.title}
                      <span className="text-[0.5rem] tracking-widest text-gray">{photo.year}</span>
                    </h3>
                    <div className="grid grid-cols-[100px_1fr] gap-4">
                      <div className="admin-img-slot h-24 relative overflow-hidden group">
                        {photo.image ? (
                          <img src={photo.image} alt={photo.title} className="w-full h-full object-cover opacity-50" />
                        ) : (
                          <Plus size={16} className="opacity-40" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePhotoStripUpload(e, i)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="admin-field">
                          <label className="admin-label">Image URL</label>
                          <input 
                            type="url" 
                            value={photo.image || ''}
                            onChange={(e) => {
                              const newData = [...photoStripData];
                              newData[i] = { ...newData[i], image: e.target.value };
                              setPhotoStripData(newData);
                            }}
                            placeholder="https://..." 
                            className="admin-input" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div 
                key="social"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-4"
              >
                {socialPhotosData.map((img, i) => (
                  <div key={i} className="admin-card">
                    <h3 className="admin-label text-gold mb-3">Post Slot {i + 1}</h3>
                    <div className="admin-img-slot aspect-square relative overflow-hidden group mb-3">
                      {img ? (
                        <img src={img} alt={`Social ${i}`} className="w-full h-full object-cover opacity-50" />
                      ) : (
                        <Plus size={16} className="opacity-40" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleSocialPhotoUpload(e, i)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <input 
                      type="url" 
                      value={img}
                      onChange={(e) => {
                        const newData = [...socialPhotosData];
                        newData[i] = e.target.value;
                        setSocialPhotosData(newData);
                      }}
                      placeholder="Image URL" 
                      className="admin-input text-[0.6rem]" 
                    />
                  </div>
                ))}
              </motion.div>
            )}
            {activeTab === 'trophies' && (
              <motion.div 
                key="trophies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="admin-label text-gold">Trophy Cabinet</h3>
                  <button 
                    onClick={() => setTrophiesData([...trophiesData, { count: '0', name: 'New Trophy', desc: 'Description', icon: '🏆' }])}
                    className="bg-gold/10 text-gold border border-gold/20 px-4 py-2 text-[0.6rem] tracking-widest uppercase hover:bg-gold/20 transition-colors flex items-center gap-2"
                  >
                    <Plus size={12} /> Add Trophy
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {trophiesData.map((trophy, i) => (
                    <div key={i} className="admin-card relative group">
                      <button 
                        onClick={() => setTrophiesData(trophiesData.filter((_, index) => index !== i))}
                        className="absolute top-4 right-4 text-red/40 hover:text-red transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-[80px_1fr] gap-4">
                          <div className="admin-field">
                            <label className="admin-label">Count</label>
                            <input 
                              type="text" 
                              value={trophy.count}
                              onChange={(e) => {
                                const newData = [...trophiesData];
                                newData[i] = { ...newData[i], count: e.target.value };
                                setTrophiesData(newData);
                              }}
                              className="admin-input" 
                            />
                          </div>
                          <div className="admin-field">
                            <label className="admin-label">Icon (Emoji)</label>
                            <input 
                              type="text" 
                              value={trophy.icon}
                              onChange={(e) => {
                                const newData = [...trophiesData];
                                newData[i] = { ...newData[i], icon: e.target.value };
                                setTrophiesData(newData);
                              }}
                              className="admin-input" 
                            />
                          </div>
                        </div>
                        <div className="admin-field">
                          <label className="admin-label">Trophy Name</label>
                          <input 
                            type="text" 
                            value={trophy.name}
                            onChange={(e) => {
                              const newData = [...trophiesData];
                              newData[i] = { ...newData[i], name: e.target.value };
                              setTrophiesData(newData);
                            }}
                            className="admin-input" 
                          />
                        </div>
                        <div className="admin-field">
                          <label className="admin-label">Description / Years</label>
                          <textarea 
                            rows={2}
                            value={trophy.desc}
                            onChange={(e) => {
                              const newData = [...trophiesData];
                              newData[i] = { ...newData[i], desc: e.target.value };
                              setTrophiesData(newData);
                            }}
                            className="admin-input resize-none" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div 
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="admin-label text-gold">Career Timeline</h3>
                  <button 
                    onClick={() => setTimelineData([...timelineData, { year: '2024', event: 'New Event', club: 'Club Name' }])}
                    className="bg-gold/10 text-gold border border-gold/20 px-4 py-2 text-[0.6rem] tracking-widest uppercase hover:bg-gold/20 transition-colors flex items-center gap-2"
                  >
                    <Plus size={12} /> Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {timelineData.map((item, i) => (
                    <div key={i} className="admin-card relative group">
                      <button 
                        onClick={() => setTimelineData(timelineData.filter((_, index) => index !== i))}
                        className="absolute top-4 right-4 text-red/40 hover:text-red transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-[100px_1fr_200px] gap-6">
                        <div className="admin-field">
                          <label className="admin-label">Year</label>
                          <input 
                            type="text" 
                            value={item.year}
                            onChange={(e) => {
                              const newData = [...timelineData];
                              newData[i] = { ...newData[i], year: e.target.value };
                              setTimelineData(newData);
                            }}
                            className="admin-input" 
                          />
                        </div>
                        <div className="admin-field">
                          <label className="admin-label">Event Description</label>
                          <input 
                            type="text" 
                            value={item.event}
                            onChange={(e) => {
                              const newData = [...timelineData];
                              newData[i] = { ...newData[i], event: e.target.value };
                              setTimelineData(newData);
                            }}
                            className="admin-input" 
                          />
                        </div>
                        <div className="admin-field">
                          <label className="admin-label">Club / Context</label>
                          <input 
                            type="text" 
                            value={item.club}
                            onChange={(e) => {
                              const newData = [...timelineData];
                              newData[i] = { ...newData[i], club: e.target.value };
                              setTimelineData(newData);
                            }}
                            className="admin-input" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="admin-label text-gold">Career Goals & Assists (Stats Bar)</h3>
                  <button 
                    onClick={() => setStatsData([...statsData, { num: '0', label: 'New Stat' }])}
                    className="bg-gold/10 text-gold border border-gold/20 px-4 py-2 text-[0.6rem] tracking-widest uppercase hover:bg-gold/20 transition-colors flex items-center gap-2"
                  >
                    <Plus size={12} /> Add Stat
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {statsData.map((stat, i) => (
                    <div key={i} className="admin-card relative group">
                      <button 
                        onClick={() => setStatsData(statsData.filter((_, index) => index !== i))}
                        className="absolute top-4 right-4 text-red/40 hover:text-red transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="space-y-4">
                        <div className="admin-field">
                          <label className="admin-label">Value (Number)</label>
                          <input 
                            type="text" 
                            value={stat.num}
                            onChange={(e) => {
                              const newData = [...statsData];
                              newData[i] = { ...newData[i], num: e.target.value };
                              setStatsData(newData);
                            }}
                            className="admin-input text-xl text-gold font-anton" 
                          />
                        </div>
                        <div className="admin-field">
                          <label className="admin-label">Label</label>
                          <input 
                            type="text" 
                            value={stat.label}
                            onChange={(e) => {
                              const newData = [...statsData];
                              newData[i] = { ...newData[i], label: e.target.value };
                              setStatsData(newData);
                            }}
                            className="admin-input" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'seo' && (
              <motion.div 
                key="seo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl space-y-6"
              >
                <div className="admin-card">
                  <h3 className="admin-label text-gold mb-6">Search Engine Optimization</h3>
                  <div className="space-y-6">
                    <div className="admin-field">
                      <label className="admin-label">Meta Title</label>
                      <input 
                        type="text" 
                        value={seoData.title}
                        onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                        className="admin-input" 
                      />
                      <p className="text-[0.5rem] text-gray mt-1">Appears in browser tabs and search results.</p>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Meta Description</label>
                      <textarea 
                        rows={3}
                        value={seoData.description}
                        onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                        className="admin-input resize-none" 
                      />
                      <p className="text-[0.5rem] text-gray mt-1">Short summary for search engines.</p>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Keywords</label>
                      <input 
                        type="text" 
                        value={seoData.keywords}
                        onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                        className="admin-input" 
                      />
                      <p className="text-[0.5rem] text-gray mt-1">Comma separated (e.g. Messi, Football, GOAT).</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div 
                key="achievements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="admin-label text-gold">Individual Achievements</h3>
                  <button 
                    onClick={() => setAchievementsData([...achievementsData, { year: '2024', title: 'New Award', desc: 'Description' }])}
                    className="bg-gold/10 text-gold border border-gold/20 px-4 py-2 text-[0.6rem] tracking-widest uppercase hover:bg-gold/20 transition-colors flex items-center gap-2"
                  >
                    <Plus size={12} /> Add Achievement
                  </button>
                </div>
                <div className="space-y-4">
                  {achievementsData.map((item, i) => (
                    <div key={i} className="admin-card relative group">
                      <button 
                        onClick={() => setAchievementsData(achievementsData.filter((_, index) => index !== i))}
                        className="absolute top-4 right-4 text-red/40 hover:text-red transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-[100px_1fr] gap-6">
                        <div className="admin-field">
                          <label className="admin-label">Year</label>
                          <input 
                            type="text" 
                            value={item.year}
                            onChange={(e) => {
                              const newData = [...achievementsData];
                              newData[i] = { ...newData[i], year: e.target.value };
                              setAchievementsData(newData);
                            }}
                            className="admin-input" 
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="admin-field">
                            <label className="admin-label">Award Title</label>
                            <input 
                              type="text" 
                              value={item.title}
                              onChange={(e) => {
                                const newData = [...achievementsData];
                                newData[i] = { ...newData[i], title: e.target.value };
                                setAchievementsData(newData);
                              }}
                              className="admin-input" 
                            />
                          </div>
                          <div className="admin-field">
                            <label className="admin-label">Description</label>
                            <textarea 
                              rows={2}
                              value={item.desc}
                              onChange={(e) => {
                                const newData = [...achievementsData];
                                newData[i] = { ...newData[i], desc: e.target.value };
                                setAchievementsData(newData);
                              }}
                              className="admin-input resize-none" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Placeholder for other tabs */}
            {!['dashboard', 'hero', 'story', 'nav-footer', 'photos', 'social', 'trophies', 'achievements', 'timeline', 'stats', 'seo'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-64 text-gray">
                <Settings size={48} className="opacity-10 mb-4 animate-spin-slow" />
                <p className="text-[0.7rem] tracking-widest uppercase">This section is ready for content integration</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Bar */}
        <footer className="bg-dark border-t border-gold/15 px-8 py-4 flex justify-between items-center">
          <div className="text-[0.6rem] text-gray tracking-widest">
            Admin Panel — LM10 Website · Built by <strong>Josiah Johnmark</strong>
          </div>
          <button 
            onClick={onClose}
            className="bg-gold text-black px-6 py-2 text-[0.6rem] font-bold tracking-widest uppercase hover:bg-gold-light transition-colors"
          >
            Save All Changes
          </button>
        </footer>
      </main>
    </motion.div>
  );
};

export default AdminPanel;
