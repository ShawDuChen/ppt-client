import { useEffect, useState } from 'react';

const useScrollPosition = ({ el }: { el?: HTMLElement }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const element = el || document.documentElement;

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(element.scrollTop);
    };
    element.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => element.removeEventListener('scroll', updatePosition);
  }, [element]);

  return scrollPosition;
};

export default useScrollPosition;
