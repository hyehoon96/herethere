const cacheName = "cache"; 
const precacheResources = ["/", "index.html", "favicon.ico"];
const version = 'updatedAt6.23'; // 프로젝트 수정시 배포 하기 전에 반드시 이 값을 바꿔주세요.

self.addEventListener('install', res => {
  caches.open(version).then(cache => {
    cache.addAll(precacheResources);
  });
  self.skipWaiting(); //  active 상태의 서비스 워커가 이미 존재하는지의 여부에 관계없이, 새로 설치된 서비스 워커가  activating 상태로 진행
});

self.addEventListener('activate', event => {
  caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      if (cacheName !== version) {
        caches.delete(cacheName);
      }
    });
  });
})

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

