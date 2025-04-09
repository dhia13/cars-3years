
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos Véhicules', path: '/vehicules' },
    { name: 'Services', path: '/services' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-mercedes-black/95 backdrop-blur-md py-2' : 'bg-mercedes-black/70 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-white rounded-full"></div>
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="text-white font-serif text-xl font-bold">3</div>
            </div>
          </div>
          <span className="text-white font-serif text-xl font-bold">-3ans DZ</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm uppercase tracking-wider transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-mercedes-blue font-medium'
                  : 'text-white hover:text-mercedes-blue'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-mercedes-black/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm uppercase tracking-wider transition-all px-2 py-3 duration-300 ${
                  isActive(item.path)
                    ? 'text-mercedes-blue font-medium border-l-2 border-mercedes-blue pl-4'
                    : 'text-white hover:text-mercedes-blue hover:border-l-2 hover:border-mercedes-blue hover:pl-4'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
