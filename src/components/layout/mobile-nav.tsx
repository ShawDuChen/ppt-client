import * as React from 'react';
import Link from 'next/link';

import { MainNavItem } from '@/types';
import { cn, isActive } from '@/lib/utils';
import { useLockBody } from '@/lib/use-lock-body';
import { Icons } from '@/components/icons';

interface MobileNavProps {
  items: MainNavItem[];
  segments: string[];
  children?: React.ReactNode;
  hideNav: () => void;
}

interface MobileNavItemProps {
  item: MainNavItem;
  segments: string[];
  hideNav: () => void;
  level: number;
}

const MobileNavItem = ({
  item,
  segments,
  hideNav,
  level,
}: MobileNavItemProps) => {
  return item.children && item.children.length ? (
    <div className={cn('text-md flex w-full flex-col rounded-md font-medium')}>
      <Link
        href="#"
        className={cn(
          'cursor-default rounded-md py-2 font-medium',
          `px-${2 * (level + 1)}`,
        )}
      >
        {item.title}
      </Link>
      {item.children.map((child, cindex) => (
        <MobileNavItem
          key={cindex}
          item={child}
          segments={segments}
          hideNav={hideNav}
          level={level + 1}
        />
      ))}
    </div>
  ) : (
    <Link
      href={item.disabled ? '#' : item.href || '#'}
      className={cn(
        'text-md flex w-full items-center rounded-md py-2 font-medium hover:underline',
        item.disabled && 'cursor-not-allowed opacity-60 hover:no-underline',
        {
          'text-primary': isActive(item.href || '#', segments),
        },
        `px-${2 * (level + 1)}`,
      )}
      onClick={() => {
        !item.disabled && hideNav();
      }}
    >
      {item.title}
    </Link>
  );
};

export default function MobileNav({
  items,
  children,
  segments,
  hideNav,
}: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-2 pb-32 shadow-md animate-in slide-in-from-left-80 md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-end space-x-4">
          <Icons.logo className="w-32 text-primary" />
          <span className="text-xl font-bold">情报数据库</span>
        </Link>
        <nav className="text-md grid grid-flow-row auto-rows-max">
          {items.map((item, index) => (
            <MobileNavItem
              item={item}
              key={index}
              segments={segments}
              hideNav={hideNav}
              level={0}
            />
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
