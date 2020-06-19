export function getRequestsList(_requests) {
	const requests = Array.from(_requests.values()).reverse();

	let loading = false;
	for (let file of requests) {
		if (file.running) {
			loading = true;
			break;
		}
	}

	return {
		loading,
		requests
	}
}

export function getSelfUriFromLinks(body) {
	const self = body.links.find(link => link.method === 'GET' && link.rel === 'self');
	if (self) {
		return self.uri
	}
	return null
}