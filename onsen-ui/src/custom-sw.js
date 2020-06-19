// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
// debugger;
workbox.setConfig({ debug: true });
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
// workbox.core.setLogLevel(workbox.core.logLevel);

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest);


workbox.precaching.addPlugins([
	new workbox.broadcastUpdate.Plugin('preacache-channel')
])


workbox.routing.registerRoute(new RegExp('.+/files/files/.+'), new workbox.strategies.NetworkOnly({
		networkTimeoutSeconds: 10,
		fetchOptions: {
			cache: 'no-cache',
		}
	})
);

workbox.routing.registerRoute(new RegExp('.+/css/.+'), new workbox.strategies.StaleWhileRevalidate({
	plugins: [
		new workbox.broadcastUpdate.Plugin({

		})
	]
}))

workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|webp|svg)$/,
	new workbox.strategies.CacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	})
);
