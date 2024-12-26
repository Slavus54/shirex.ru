const CACHE_BASE_NAME = 'cache-v1'

self.addEventListener('install', e => {
    e.waitUntil((async () => {
        const cache = await caches.open(CACHE_BASE_NAME)

        await cache.add('/favicon.ico')
    })())
})

self.addEventListener('activate', async () => {
    let allCaches = await caches.keys()

    console.log('Service worker is activated...')

    await Promise.all(allCaches.map(async (cache) => {
        if (cache !== CACHE_BASE_NAME) {
            await caches.delete(cache)
        }
    }))
})

self.addEventListener('fetch', async (e) => {
    try {
        return await fetch(e.request)
    } catch (err) {
        return await caches.match(e.request)
    }
})