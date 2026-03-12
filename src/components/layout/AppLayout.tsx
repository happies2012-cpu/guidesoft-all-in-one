import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { RightSidebar } from './RightSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border glass p-3 lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <BrandLogo imageClassName="h-8 w-8" textClassName="text-sm tracking-[0.2em]" />
      </div>

      {/* Main content */}
      <main className="lg:ml-64 xl:mr-80 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  );
}
