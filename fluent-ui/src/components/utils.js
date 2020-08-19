export function getSelfUriFromLinks(body) {
	const self = body.links.find(link => link.method === 'GET' && link.rel === 'self');
	if (self) {
		return self.uri
	}
	return null
}