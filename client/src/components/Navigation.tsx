import { Button } from "@/components/ui/button";
import { Github, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    console.log('Theme toggled to:', !isDark ? 'dark' : 'light');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">FloatChat</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#demo" className="text-foreground hover:text-primary transition-colors" data-testid="link-demo">
              Demo
            </a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors" data-testid="link-features">
              Features
            </a>
            <a href="#data" className="text-foreground hover:text-primary transition-colors" data-testid="link-data">
              Data
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors" data-testid="link-about">
              About
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log('GitHub clicked')}
              data-testid="button-github"
            >
              <Github className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="hidden sm:flex"
              onClick={() => console.log('Get Started clicked')}
              data-testid="button-get-started"
            >
              Get Started
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a href="#demo" className="text-foreground hover:text-primary transition-colors">Demo</a>
              <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
              <a href="#data" className="text-foreground hover:text-primary transition-colors">Data</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <Button variant="outline" className="w-full" onClick={() => console.log('Get Started clicked')}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}