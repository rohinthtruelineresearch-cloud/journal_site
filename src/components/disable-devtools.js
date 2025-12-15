"use client";

import { useEffect } from 'react';

export default function DisableDevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Disable Right Click
      const handleContextmenu = (e) => {
        e.preventDefault();
      };
      document.addEventListener('contextmenu', handleContextmenu);

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      const handleKeyDown = (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      // Attempt to clear console and interfere with debugging
      const noop = () => {};
      const devtools = {
         isOpen: false,
         orientation: undefined,
      };
      
      // Periodic debugger check
      setInterval(() => {
          const widthThreshold = window.outerWidth - window.innerWidth > 160;
          const heightThreshold = window.outerHeight - window.innerHeight > 160;
          if (widthThreshold || heightThreshold) {
              // DevTools likely open
          }
      }, 1000);

      return () => {
        document.removeEventListener('contextmenu', handleContextmenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return null;
}
