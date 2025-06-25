
import { useEffect } from 'react';

export const MobileOptimizations = () => {
  useEffect(() => {
    // Adicionar viewport meta tag se não existir
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );

    // Otimizações para iOS Safari
    const iosMeta = document.createElement('meta');
    iosMeta.setAttribute('name', 'apple-mobile-web-app-capable');
    iosMeta.setAttribute('content', 'yes');
    document.head.appendChild(iosMeta);

    const iosStatusBar = document.createElement('meta');
    iosStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    iosStatusBar.setAttribute('content', 'default');
    document.head.appendChild(iosStatusBar);

    // Prevenir zoom em inputs
    const style = document.createElement('style');
    style.textContent = `
      @media screen and (max-width: 768px) {
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="number"],
        textarea,
        select {
          font-size: 16px !important;
          transform: scale(1);
        }
        
        body {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        input, textarea, [contenteditable] {
          -webkit-user-select: auto;
          -khtml-user-select: auto;
          -moz-user-select: auto;
          -ms-user-select: auto;
          user-select: auto;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup se necessário
      document.head.removeChild(iosMeta);
      document.head.removeChild(iosStatusBar);
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
