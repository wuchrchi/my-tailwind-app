import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Briefcase, User, Mail, Linkedin, Figma, Code, Search, Palette, Instagram, Globe } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import './App.css';
import logo from './assets/logo.png';
import selfy from './assets/selfy.jpg';


/* === 資料 === */
const portfolioItems = [
  { id: 1, title: '沐霖實業官方網站', description: '為沐霖實業設計的官方網站，注重使用者體驗與品牌形象。', imageUrl: 'https://placehold.co/400x300/1e293b/a8a8a8?text=Muulin+Web', link: 'https://wuchrchi.github.io/muulin-web/' },
  { id: 2, title: '數位產品原型開發', description: '從概念到原型，將創新想法轉化為可互動的數位產品。', imageUrl: 'https://placehold.co/400x300/1e293b/a8a8a8?text=Prototype', link: '#' },

];

const skills = [
  { name: 'Figma', icon: <Figma size={24} /> },
  { name: 'UI/UX Design', icon: <Palette size={24} /> },
  { name: 'Wireframing', icon: <Search size={24} /> },
  { name: 'Prototyping', icon: <Code size={24} /> },
  { name: 'User Research', icon: <User size={24} /> },
];

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showHeader, setShowHeader] = useState(false);
  const [introReveal, setIntroReveal] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);
  const [headerLogoHidden, setHeaderLogoHidden] = useState(false);

  const splashLogoRef = useRef(null); // 中央大 LOGO
  const headerLogoRef = useRef(null); // Navbar 小 LOGO

  /* === 滾動偵測（header 顯示、activeSection、自動觸發變形） === */
  useEffect(() => {
    const sections = ['home', 'intro', 'portfolio', 'about', 'contact'];
    let lastY = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      // Header 顯示門檻
      const shouldShow = y > vh * 0.2;
      if (showHeader !== shouldShow) setShowHeader(shouldShow);

      // 估算哪個區塊在中線
      let current = 'home';
      for (const id of sections) {
        const s = document.getElementById(id);
        if (!s) continue;
        const rect = s.getBoundingClientRect();
        const mid = window.innerHeight / 2;
        if (rect.top <= mid && rect.bottom >= mid) { current = id; break; }
      }
      if (current !== activeSection) setActiveSection(current);

      // 自動觸發：往下超過 25% vh → forward
      if (!isMorphing && current === 'home' && y > vh * 0.25) {
        morphForward();
      }
      // 自動觸發：接近頂部且往上（< 15% vh）→ reverse
      if (!isMorphing && current !== 'home' && y < vh * 0.15 && lastY > y) {
        morphReverse();
      }

      lastY = y;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, showHeader, isMorphing]);

  /* === 粒子設定 === */
  const particlesInit = useCallback(async (engine) => { await loadSlim(engine); }, []);
  const particlesLoaded = useCallback(async () => { }, []);
  const particlesOptions = {
    background: { color: { value: '#0D0C0C' } },
    fpsLimit: 120,
    interactivity: {
      events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: ['#00FFFF', '#00BFFF', '#8A2BE2'] },
      links: { color: '#00FFFF', distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  /* === 精準變形：大 LOGO → Navbar 小 LOGO === */
  const morphForward = async () => {
    if (isMorphing) return;
    const srcEl = splashLogoRef.current;
    const dstEl = headerLogoRef.current;
    if (!srcEl || !dstEl) return;

    setIsMorphing(true);
    setShowHeader(true);        // 先讓 header 出現
    setHeaderLogoHidden(true);  // 等合體完成再顯示小 logo

    await new Promise(r => requestAnimationFrame(r)); // 等一幀
    const src = srcEl.getBoundingClientRect();
    const dst = dstEl.getBoundingClientRect();

    // 建 clone 固定定位在原位
    const clone = srcEl.cloneNode(true);
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${src.left}px`,
      top: `${src.top}px`,
      width: `${src.width}px`,
      height: `${src.height}px`,
      margin: '0',
      zIndex: 60, // 高於 header(z-50)
      pointerEvents: 'none',
      transformOrigin: 'top left',
      filter: 'drop-shadow(0 12px 36px rgba(0,255,255,.35))',
    });
    document.body.appendChild(clone);
    srcEl.style.visibility = 'hidden';

    const dx = dst.left - src.left;
    const dy = dst.top - src.top;
    const scale = dst.width / src.width;

    const anim = clone.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.98 }
      ],
      { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
    );

    // 中途開始滾到 intro
    setTimeout(() => {
      document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    anim.onfinish = () => {
      clone.remove();
      setHeaderLogoHidden(false); // 顯示 navbar 小logo
      setIntroReveal(true);       // 讓 intro 漸入
      setIsMorphing(false);
    };
  };

  /* === 反向變形：Navbar 小 LOGO → 中央大 LOGO === */
  const morphReverse = async () => {
    if (isMorphing) return;
    const srcEl = headerLogoRef.current;
    const dstEl = splashLogoRef.current;
    if (!srcEl || !dstEl) return;

    setIsMorphing(true);
    setHeaderLogoHidden(true);   // 暫藏小 logo
    dstEl.style.visibility = 'hidden';

    await new Promise(r => requestAnimationFrame(r));
    const src = srcEl.getBoundingClientRect();
    const dst = dstEl.getBoundingClientRect();

    const clone = srcEl.cloneNode(true);
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${src.left}px`,
      top: `${src.top}px`,
      width: `${src.width}px`,
      height: `${src.height}px`,
      margin: '0',
      zIndex: 60,
      pointerEvents: 'none',
      transformOrigin: 'top left',
    });
    document.body.appendChild(clone);

    const dx = dst.left - src.left;
    const dy = dst.top - src.top;
    const scale = dst.width / src.width;

    const anim = clone.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 1 }
      ],
      { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
    );

    // 同步滾回頂部
    setTimeout(() => {
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    anim.onfinish = () => {
      clone.remove();
      dstEl.style.visibility = 'visible';
      setHeaderLogoHidden(false);
      setIntroReveal(false); // 下次回來再重新 reveal
      setShowHeader(false);  // 收起 header
      setIsMorphing(false);
    };
  };

  /* === 一般滾動（不觸發變形） === */
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter relative overflow-hidden">
      {/* 粒子背景：放在背景上方、內容下方（不會被遮） */}
      <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={particlesOptions} className="absolute inset-0 z-0" />

      {/* Header（滑過門檻或變形時顯示） */}
      <nav className={`fixed top-0 left-0 right-0 z-50 p-4 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-lg rounded-b-xl transition-all duration-300 ${showHeader ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 -translate-y-2 pointer-events-none delay-0'}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Header 小 LOGO（點它 → 反向變形） */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); if (!isMorphing) morphReverse(); }}
            className="flex items-center space-x-2"
          >
            <img
              ref={headerLogoRef}
              src={logo}
              alt="Logo"
              className={`h-10 w-auto object-contain transition-opacity duration-200 ${headerLogoHidden ? 'opacity-0' : 'opacity-100'}`}
            />
          </a>

          {/* 導覽 */}
          <div className="flex space-x-6">
            <NavItem icon={<Home size={18} />} text="首頁" sectionId="intro" active={activeSection === 'intro'} onClick={() => scrollToSection('intro')} />
            <NavItem icon={<Briefcase size={18} />} text="作品集" sectionId="portfolio" active={activeSection === 'portfolio'} onClick={() => scrollToSection('portfolio')} />
            <NavItem icon={<User size={18} />} text="關於我" sectionId="about" active={activeSection === 'about'} onClick={() => scrollToSection('about')} />
            <NavItem icon={<Mail size={18} />} text="聯絡我" sectionId="contact" active={activeSection === 'contact'} onClick={() => scrollToSection('contact')} />
          </div>
        </div>
      </nav>

      {/* 內容 */}
      <main className="relative z-10 pt-0 pb-12">
        {/* Splash：全螢幕大 LOGO */}
        <section id="home" className="min-h-[100svh] flex items-center justify-center relative text-center px-4">
          <img
            ref={splashLogoRef}
            src={logo}
            alt="Logo"
            className="w-[220px] md:w-[320px] lg:w-[420px] h-auto drop-shadow-2xl animate-fade-in-up"
          />
          <button
            onClick={() => { if (!isMorphing) morphForward(); }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-300 hover:text-cyan-400 transition-colors"
            aria-label="Scroll down"
          >
            <div className="text-sm tracking-widest mb-2 opacity-80">SCROLL</div>
            <div className="animate-bounce">▾</div>
          </button>
        </section>

        {/* Intro：首頁主視覺（含階層淡入） */}
        <section id="intro" className="min-h-[calc(100vh-6rem)] flex items-center justify-center text-center px-4">
          <div className={`max-w-4xl mx-auto intro-reveal ${introReveal ? 'show' : ''}`}>
            <h1 className="intro-title text-6xl md:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg">
              你的名字
            </h1>
            <p className="intro-sub mt-4 text-3xl md:text-4xl font-light text-white opacity-90">
              Digital Product & <span className="text-cyan-400">UI Designer</span>
            </p>
            <p className="intro-desc mt-6 text-xl text-gray-300">
              致力於打造直觀、美觀且具影響力的數位體驗。
            </p>
            <div className="intro-cta mt-10">
              <button
                onClick={() => scrollToSection('portfolio')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                瀏覽我的作品集
              </button>
            </div>
          </div>
        </section>

        {/* 作品集 */}
        <section id="portfolio" className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold text-center text-cyan-400 mb-16 animate-fade-in-up">精選專案</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
              {portfolioItems.map((item) => (<PortfolioCard key={item.id} {...item} />))}
            </div>
          </div>
        </section>

        {/* 關於我 */}
        <section id="about" className="py-20 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
              <h2 className="text-5xl font-bold text-cyan-400 mb-6">關於我</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                我是夾子，一位熱衷於創造直觀且美觀使用者介面的 UI 設計師。
                我在沐霖實業有限公司擔任 UI 設計師，負責公司官方網站的設計與優化，
                致力於將複雜的資訊轉化為清晰易懂的視覺體驗。
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                我對 Web3 技術及其帶來的去中心化未來充滿好奇與熱情，
                並持續探索如何在區塊鏈應用中實現卓越的 UI/UX 設計。
                我相信設計不僅是美學，更是解決問題、提升使用者體驗的關鍵。
              </p>
              <h3 className="text-3xl font-bold text-blue-400 mb-4">我的技能</h3>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-lg text-white hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-cyan-500/30">
                    {skill.icon}<span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center animate-fade-in-up delay-300">
              <img src={selfy} alt="你的個人照片" className="rounded-full border-4 border-cyan-500 shadow-2xl shadow-cyan-500/40 transform hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </section>

        {/* 聯絡我 */}
        <section id="contact" className="py-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-5xl font-bold text-center text-cyan-400 mb-12 animate-fade-in-up">聯絡我</h2>
            <form className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10 shadow-lg animate-fade-in-up delay-300">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-300 text-lg font-medium mb-2">姓名</label>
                <input type="text" id="name" name="name" className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="你的姓名" />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 text-lg font-medium mb-2">電子郵件</label>
                <input type="email" id="email" name="email" className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="你的電子郵件" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-300 text-lg font-medium mb-2">訊息</label>
                <textarea id="message" name="message" rows="5" className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="你的訊息"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
                  發送訊息
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* 頁腳 */}
      <footer className="relative z-10 py-8 text-center text-gray-400 border-t border-gray-800">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} 夾子版權所有.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://www.linkedin.com/in/%E4%BD%B3%E8%87%B4-%E5%90%B3-727934225/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
            <a href="https://www.instagram.com/kevinwu37/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href="https://www.cake.me/wuclips" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300" aria-label="CakeResume">
              <Globe size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* === 小元件 === */
const NavItem = ({ icon, text, sectionId, active, onClick }) => (
  <a
    href={`#${sectionId}`}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${active ? 'text-cyan-400 bg-white/10 shadow-md shadow-cyan-500/20' : 'text-gray-300 hover:text-cyan-400 hover:bg-white/5'}`}
  >
    {icon}<span className="font-medium">{text}</span>
  </a>
);

const PortfolioCard = ({ title, description, imageUrl, link }) => (
  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg transform hover:scale-[1.02] transition-all duration-300 hover:shadow-cyan-500/50">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700" />
    <h3 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h3>
    <p className="text-gray-300 text-base mb-4">{description}</p>
    <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-purple-500/50 transition-all duration-300">
      了解更多
    </a>
  </div>
);

export default App;
