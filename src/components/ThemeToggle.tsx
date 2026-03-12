import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const sys = getSystemTheme();
    root.classList.toggle('dark', sys === 'dark');
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

export function ThemeToggle({ variant = 'icon' }: { variant?: 'icon' | 'full' }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('gs-theme') as Theme) || 'system';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('gs-theme', theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const icons: Record<Theme, React.ReactNode> = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={variant === 'icon' ? 'icon' : 'sm'} className="h-9 w-9">
          {icons[theme]}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
          <Sun className="h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
          <Moon className="h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
          <Monitor className="h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
