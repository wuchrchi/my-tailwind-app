import React, { useState, useEffect } from 'react';
import { Home, Briefcase, User, Mail, Linkedin, Dribbble, Figma, Code, Search, Palette } from 'lucide-react';

// 假設這些是你的作品集資料
const portfolioItems = [
    {
        id: 1,
        title: '沐霖實業官方網站',
        description: '為沐霖實業設計的官方網站，注重使用者體驗與品牌形象。',
        imageUrl: 'https://placehold.co/400x300/1e293b/a8a8a8?text=Muulin+Web', // 請替換為你的作品圖片
        link: 'https://wuchrchi.github.io/muulin-web/', // 你的網站連結
    },
    {
        id: 2,
        title: 'Web3 互動介面設計',
        description: '探索區塊鏈應用中的使用者介面設計，強調去中心化與安全性。',
        imageUrl: 'https://placehold.co/400x300/1e293b/a8a8a8?text=Web3+UI',
        link: '#', // 替換為你的連結
    },
    {
        id: 3,
        title: '數位產品原型開發',
        description: '從概念到原型，將創新想法轉化為可互動的數位產品。',
        imageUrl: 'https://placehold.co/400x300/1e293b/a8a8a8?text=Prototype',
        link: '#', // 替換為你的連結
    },
    {
        id: 4,
        title: '品牌識別與視覺系統',
        description: '為新創公司建立獨特的品牌識別系統，包含 Logo、色彩與字體規範。',
        imageUrl: 'https://placehold.co/400x300/1e293b/a8a8a8?text=Branding',
        link: '#', // 替換為你的連結
    },
];

// 假設這是你的技能資料
const skills = [
    { name: 'Figma', icon: <Figma size={24} /> },
    { name: 'UI/UX Design', icon: <Palette size={24} /> },
    { name: 'Wireframing', icon: <Search size={24} /> },
    { name: 'Prototyping', icon: <Code size={24} /> },
    { name: 'User Research', icon: <User size={24} /> },
];

const App = () => {
    const [activeSection, setActiveSection] = useState('home');

    // 滾動到指定區塊
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    // 監聽滾動事件，更新 activeSection
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'portfolio', 'about', 'contact'];
            let currentActive = 'home';
            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        currentActive = sectionId;
                        break;
                    }
                }
            }
            setActiveSection(currentActive);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        // 主容器，設定深色背景和 Inter 字體
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter relative overflow-hidden">
            {/* 導覽列 - 毛玻璃效果 */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-white bg-opacity-5 backdrop-blur-lg border-b border-white border-opacity-10 shadow-lg shadow-cyan-500/10 rounded-b-xl">
                <div className="container mx-auto flex justify-between items-center px-4">
                    {/* 品牌名稱 */}
                    <a href="#home" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                        你的名字.UI
                    </a>
                    {/* 導覽連結 */}
                    <div className="flex space-x-6">
                        <NavItem icon={<Home size={18} />} text="首頁" sectionId="home" active={activeSection === 'home'} onClick={() => scrollToSection('home')} />
                        <NavItem icon={<Briefcase size={18} />} text="作品集" sectionId="portfolio" active={activeSection === 'portfolio'} onClick={() => scrollToSection('portfolio')} />
                        <NavItem icon={<User size={18} />} text="關於我" sectionId="about" active={activeSection === 'about'} onClick={() => scrollToSection('about')} />
                        <NavItem icon={<Mail size={18} />} text="聯絡我" sectionId="contact" active={activeSection === 'contact'} onClick={() => scrollToSection('contact')} />
                    </div>
                </div>
            </nav>

            {/* 粒子背景效果 (簡化版，實際可替換為更複雜的 WebGL 動畫) */}
            <div className="absolute inset-0 z-0 opacity-20">
                {/* 簡單的圓點粒子模擬 */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-slow"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse-slow delay-2000"></div>
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow delay-3000"></div>
            </div>

            {/* 內容區塊 */}
            <main className="relative z-10 pt-24 pb-12">
                {/* 首頁區塊 */}
                <section id="home" className="min-h-[calc(100vh-6rem)] flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg animate-fade-in-up">
                            你的名字
                        </h1>
                        <p className="mt-4 text-3xl md:text-4xl font-light text-white opacity-90 animate-fade-in-up delay-300">
                            Digital Product & <span className="text-cyan-400">UI Designer</span>
                        </p>
                        <p className="mt-6 text-xl text-gray-300 animate-fade-in-up delay-600">
                            致力於打造直觀、美觀且具影響力的數位體驗。
                        </p>
                        <div className="mt-10 animate-fade-in-up delay-900">
                            <button
                                onClick={() => scrollToSection('portfolio')}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                            >
                                瀏覽我的作品集
                            </button>
                        </div>
                    </div>
                </section>

                {/* 作品集區塊 */}
                <section id="portfolio" className="py-20 px-4">
                    <div className="container mx-auto">
                        <h2 className="text-5xl font-bold text-center text-cyan-400 mb-16 animate-fade-in-up">精選專案</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {portfolioItems.map((item) => (
                                <PortfolioCard key={item.id} {...item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* 關於我區塊 */}
                <section id="about" className="py-20 px-4">
                    <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
                            <h2 className="text-5xl font-bold text-cyan-400 mb-6">關於我</h2>
                            <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                我是 [你的名字]，一位熱衷於創造直觀且美觀使用者介面的 UI 設計師。
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
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-20 text-lg text-white hover:bg-opacity-20 transition-all duration-300 shadow-md hover:shadow-cyan-500/30"
                                    >
                                        {skill.icon}
                                        <span>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 flex justify-center animate-fade-in-up delay-300">
                            {/* 請替換為你的個人照片 */}
                            <img
                                src="https://placehold.co/400x400/0f172a/a8a8a8?text=Your+Photo"
                                alt="你的個人照片"
                                className="rounded-full border-4 border-cyan-500 shadow-2xl shadow-cyan-500/40 transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>
                </section>

                {/* 聯絡我區塊 */}
                <section id="contact" className="py-20 px-4">
                    <div className="container mx-auto max-w-2xl">
                        <h2 className="text-5xl font-bold text-center text-cyan-400 mb-12 animate-fade-in-up">聯絡我</h2>
                        <form className="bg-white bg-opacity-5 backdrop-blur-lg p-8 rounded-xl border border-white border-opacity-10 shadow-lg shadow-cyan-500/10 animate-fade-in-up delay-300">
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-300 text-lg font-medium mb-2">
                                    姓名
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full p-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="你的姓名"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-gray-300 text-lg font-medium mb-2">
                                    電子郵件
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="你的電子郵件"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-gray-300 text-lg font-medium mb-2">
                                    訊息
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    className="w-full p-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="你的訊息"
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                                >
                                    發送訊息
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            {/* 頁腳 */}
            <footer className="py-8 text-center text-gray-400 border-t border-gray-800">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} 你的名字.UI. 版權所有.</p>
                    <div className="flex justify-center space-x-6 mt-4">
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://dribbble.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                            <Dribbble size={24} />
                        </a>
                        {/* 可以添加更多社群連結 */}
                    </div>
                </div>
            </footer>
        </div>
    );
};

// 導覽列項目元件
const NavItem = ({ icon, text, sectionId, active, onClick }) => (
    <a
        href={`#${sectionId}`}
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${active ? 'text-cyan-400 bg-white bg-opacity-10 shadow-md shadow-cyan-500/20' : 'text-gray-300 hover:text-cyan-400 hover:bg-white hover:bg-opacity-5'
            }`}
    >
        {icon}
        <span className="font-medium">{text}</span>
    </a>
);

// 作品集卡片元件
const PortfolioCard = ({ title, description, imageUrl, link }) => (
    <div className="bg-white bg-opacity-5 backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-10 shadow-lg shadow-cyan-500/10 transform hover:scale-102 transition-all duration-300 hover:shadow-cyan-500/50">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700" />
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-300 text-base mb-4">{description}</p>
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-purple-500/50 transition-all duration-300"
        >
            了解更多
        </a>
    </div>
);

export default App;
