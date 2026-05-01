"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ConciergeBell, 
  Briefcase, 
  Package,
  FileText, 
  Quote, 
  Mail, 
  Settings, 
  LogOut,
  Laptop,
  Target,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: ConciergeBell },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Insights & News', href: '/admin/insights', icon: FileText },
  { name: 'Strategy & Sectors', href: '/admin/sectors', icon: Target },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { name: 'Submissions', href: '/admin/contact', icon: Mail },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!pathname.includes('/admin/login') && !token) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/admin/login');
  };

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-brand-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/admin" className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
             <Laptop size={18} />
           </div>
           <span className="font-display font-bold text-sm tracking-tight uppercase">CMS PANEL</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar (Desktop) & Drawer (Mobile) */}
      <aside className={cn(
        "bg-brand-black text-white flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform md:translate-x-0 md:w-64",
        isMobileMenuOpen ? "translate-x-0 w-full" : "-translate-x-full"
      )}>
        <div className="hidden md:block p-8">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <Laptop size={18} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight uppercase">CMS PANEL</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 md:mt-0">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-4 md:py-3 rounded-xl transition-all",
                  active 
                    ? "bg-brand-blue text-white" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span className="font-medium text-lg md:text-base">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mb-20 md:mb-0">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center space-x-3 px-4 py-4 md:py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium"
           >
             <LogOut size={20} />
             <span className="text-lg md:text-base">Logout</span>
           </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-brand-black/50 backdrop-blur-sm z-30" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
