'use client';

import { useRef, useState, useEffect } from 'react';

const defaultClasses = 'transition-all duration-[0.6s] ease-out';

/** direction: 'down' = отгоре надолу (по подразбиране), 'up' = отдолу нагоре */
export default function AnimateOnScroll({
  children,
  className = '',
  as: Tag = 'div',
  offset = 0,
  once = true,
  direction = 'down',
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: `${offset}px`, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [offset, once]);

  const fromBelow = direction === 'up';
  const visibleClasses = 'opacity-100 translate-y-0';
  const hiddenClasses = fromBelow
    ? 'opacity-0 translate-y-[50px]'
    : 'opacity-0 translate-y-[-50px]';

  return (
    <Tag
      ref={ref}
      className={`${defaultClasses} ${isVisible ? visibleClasses : hiddenClasses} ${className}`}
    >
      {children}
    </Tag>
  );
}
