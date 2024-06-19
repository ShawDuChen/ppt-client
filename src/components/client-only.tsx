'use client';

import { useIsClient } from '@uidotdev/usehooks';

const ClientOnly = ({
  children,
  placeholder,
}: {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}) => {
  const isClient = useIsClient();

  if (!isClient) {
    return placeholder || null;
  }

  return children;
};

export default ClientOnly;
