

"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Film, Home, ListMusic, Tv, PlusSquare, Search, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
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
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const NavItem = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <SidebarMenuItem>
      <Link href={href} passHref>
        <SidebarMenuButton asChild isActive={isActive} tooltip={children}>
          <>
            <Icon />
            <span>{children}</span>
          </>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

function MainSidebar() {
    return (
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <NavItem href="/" icon={Home}>Home</NavItem>
              <NavItem href="/movies" icon={Film}>Movies</NavItem>
              <NavItem href="/series" icon={Tv}>Series</NavItem>
              <NavItem href="/music" icon={ListMusic}>Music</NavItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <NavItem href="/add-content" icon={PlusSquare}>Add Content</NavItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
    )
}

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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {children}
            </Link>
        )
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
             <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Logo />
                    <span className="sr-only">Doby</span>
                </Link>
                <NavLink href="/" icon={Home}>Home</NavLink>
                <NavLink href="/movies" icon={Film}>Movies</NavLink>
                <NavLink href="/series" icon={Tv}>Series</NavLink>
                <NavLink href="/music" icon={ListMusic}>Music</NavLink>
                <NavLink href="/add-content" icon={PlusSquare}>Add Content</NavLink>
            </nav>
          </SheetContent>
        </Sheet>
    )
}


function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <MobileSidebar />
      <div className="w-full flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies, series, music..."
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
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted/40">
        <div className='flex'>
            <div className='hidden md:block border-r sticky top-0 h-screen'>
                <MainSidebar />
            </div>
            <div className="flex flex-col flex-1 w-full">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    </div>
  );
}
