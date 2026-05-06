import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        inline-flex items-center justify-center
        w-9 h-9 rounded-lg
        text-text-muted hover:text-text-secondary
        hover:bg-accent-blue/5 dark:hover:bg-white/5
        transition-colors duration-200
        focus-visible:shadow-focus
      "
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
