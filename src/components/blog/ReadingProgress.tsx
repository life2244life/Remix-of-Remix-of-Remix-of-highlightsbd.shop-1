import { useEffect, useState } from 'react';

// Sticky reading progress bar that tracks scroll position through the page.
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;