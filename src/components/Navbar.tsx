
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Menu, X, Home, ChefHat, LayoutGrid, Clock, CreditCard } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Orders', path: '/orders', icon: ChefHat },
  { name: 'Tables', path: '/tables', icon: LayoutGrid },
  { name: 'History', path: '/history', icon: Clock },
  { name: 'Checkout', path: '/checkout', icon: CreditCard },
];

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <span className="text-xl font-medium">TastePOS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center space-x-1.5">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Mobile Menu Trigger */}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col pt-16">
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "relative px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-3",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
