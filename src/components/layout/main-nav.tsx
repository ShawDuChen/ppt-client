'use client';

import { cn, isActive } from '@/lib/utils';
import { MainNavItem } from '@/types/navigation';
import { MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import SiteLogo from './PharmaExplorer-logo.svg';
import MobileNav from './mobile-nav';

interface MainNavProps {
  items?: MainNavItem[];
}

export default function MainNav({ items }: MainNavProps) {
  const segments = useSelectedLayoutSegments();

  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  return (
    <div className="flex flex-1 justify-start gap-6 md:gap-10">
      <Link href="/" className="hidden space-x-2 md:flex md:items-center">
        <Image src={SiteLogo} width={200} alt="site logo" />
      </Link>
      {items?.length ? (
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-4 lg:space-x-6 xl:space-x-10">
            {items?.map((item, index) => {
              if (item.children) {
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger
                      // prevent hover to open menu
                      onPointerEnter={(event) => event.preventDefault()}
                      onPointerLeave={(event) => event.preventDefault()}
                      onPointerMove={(event) => event.preventDefault()}
                      className="p-0 text-lg font-medium text-gray-900/60 hover:bg-background focus:bg-background data-[state=open]:bg-inherit sm:text-base"
                    >
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="-left-4 z-10">
                      <ul className="min-w-60 p-1">
                        {item.children.map((child, index) => (
                          <li
                            key={index}
                            className="flex w-full px-4 hover:bg-gray-50"
                          >
                            {child.href && (
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.disabled ? '#' : child?.href}
                                  className={cn(
                                    'relative flex w-full items-center py-2 text-lg font-medium text-gray-900/60 transition-colors hover:text-gray-900/80 sm:text-base',
                                    {
                                      'text-primary': isActive(
                                        child?.href,
                                        segments,
                                      ),
                                      'cursor-not-allowed text-[#BCBCBC] hover:text-[#BCBCBC]':
                                        child.disabled,
                                    },
                                  )}
                                >
                                  {child.title}
                                </Link>
                              </NavigationMenuLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              } else if (item.href) {
                return (
                  <NavigationMenuItem
                    key={index}
                    className={cn({
                      'after:absolute after:-bottom-5 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]':
                        isActive(item?.href, segments),
                    })}
                  >
                    <Link
                      href={item.disabled ? '#' : item?.href}
                      className={cn(
                        'relative flex items-center text-lg font-medium text-gray-900/60 transition-colors hover:text-gray-900/80 sm:text-base',
                        {
                          'cursor-not-allowed text-[#BCBCBC] hover:text-[#BCBCBC]':
                            item.disabled,
                        },
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuItem>
                );
              }
            })}
          </NavigationMenuList>
        </NavigationMenu>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <XIcon /> : <MenuIcon />}
      </button>
      {showMobileMenu && items && (
        // <MobileNav items={items}>{children}</MobileNav>
        <MobileNav
          items={items}
          segments={segments}
          hideNav={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
}
