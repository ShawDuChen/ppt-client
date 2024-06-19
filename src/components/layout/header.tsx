import { FC } from 'react';

import { getCurrentUser } from '@/lib/session';
import Link from 'next/link';
import { Button } from '../ui/button';
import { UserAccountNav } from '../user-account-nav';
import MainNav from './main-nav';

const Header: FC = async () => {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 z-50 bg-background shadow-md">
      <header className="container">
        <div className="flex h-16 items-center">
          <div className="flex h-10 flex-1 justify-between gap-6 md:gap-10">
            <MainNav
              items={[
                { title: 'AI Chat', href: '/chat' },
                {
                  title: '数据库导航',
                  children: [
                    { title: '药物遴选', href: '/drugs' },
                    { title: '靶点评估', href: '/targets' },
                    { title: '临床试验', href: '/clinical-trials' },
                  ],
                },
                { title: '工作空间', href: '/workspace' },
                { title: '数据定制', href: '/customization', disabled: true },
              ]}
            />
            <div className="flex items-center gap-2">
              {user ? (
                <UserAccountNav
                  user={{
                    name: user?.name,
                    email: user?.email || '',
                  }}
                />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="px-2 text-base text-gray-900/60 hover:bg-inherit hover:text-gray-900"
                    asChild
                  >
                    <Link href="/auth/login">
                      {/* <User2Icon className="mr-2 h-5 w-5" /> */}
                      登录
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register">申请试用</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
