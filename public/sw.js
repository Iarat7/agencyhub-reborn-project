
const CACHE_NAME = 'agencyhub-v1';
const STATIC_CACHE = 'agencyhub-static-v1';
const DYNAMIC_CACHE = 'agencyhub-dynamic-v1';

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// URLs da API que devem ser cacheadas
const API_CACHE_PATTERNS = [
  '/rest/v1/clients',
  '/rest/v1/opportunities',
  '/rest/v1/tasks'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Recursos estáticos cacheados');
        return self.skipWaiting();
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Removendo cache antigo', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Ativo');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Cache First para recursos estáticos
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
    return;
  }
  
  // Network First para API calls com fallback para cache
  if (API_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cachear resposta da API se for bem-sucedida
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache se a rede falhar
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Retornar uma resposta offline padrão
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'Dados não disponíveis offline',
                  data: [] 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 200
                }
              );
            });
        })
    );
    return;
  }
  
  // Para outras requisições, tentar rede primeiro
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Fallback para página offline se disponível
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503 });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Sincronização em background');
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implementar lógica de sincronização de dados offline
  console.log('Sincronizando dados offline...');
}
