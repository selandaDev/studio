
"use client";

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Film, Home, ListMusic, Tv, PlusSquare, Search, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';


function MobileSidebar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const NavLink = ({ href, icon: Icon, children }: { href: string, icon: React.ElementType, children: React.ReactNode}) => {
        const isActive = pathname === href;
        return (
            <Link
              href={href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary whitespace-nowrap",
                isActive && "bg-muted text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              {children}
            </Link>
        )
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú de navegación</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <SheetHeader>
                <SheetTitle className="text-left">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Logo />
                        <span className="">Doby</span>
                    </Link>
                </SheetTitle>
            </SheetHeader>
             <nav className="grid gap-2 text-lg font-medium">
                <NavLink href="/" icon={Home}>Inicio</NavLink>
                <NavLink href="/movies" icon={Film}>Películas</NavLink>
                <NavLink href="/series" icon={Tv}>Series</NavLink>
                <NavLink href="/music" icon={ListMusic}>Música</NavLink>
                <NavLink href="/add-content" icon={PlusSquare}>Añadir Contenido</NavLink>
            </nav>
          </SheetContent>
        </Sheet>
    )
}


function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else if (searchQuery === '' && searchParams.get('q')) {
         router.push('/search');
      }
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, router, searchParams]);


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <MobileSidebar />
      <div className="w-full flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar películas, series, música..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="sr-only">Alternar menú de usuario</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
        <div className="flex flex-col flex-1 w-full">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                {children}
            </main>
        </div>
    </div>
  );
}
