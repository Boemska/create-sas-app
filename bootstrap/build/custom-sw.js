importScripts("./precache-manifest.f8d6940e0bef60fb2f14a09b686b844c.js", "./workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "./workbox-v4.3.1"});
// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
// debugger;
workbox.setConfig({ debug: true });

//Manually changing the prefix will allow using multiple projects on localhost
workbox.core.setCacheNameDetails({
	prefix: 'seedapp',
	suffix: 'v1'
})

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest);

//Maybe will not be needed
workbox.precaching.addPlugins([
	new workbox.broadcastUpdate.Plugin('preacache-channel')
])

// app-shell

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

