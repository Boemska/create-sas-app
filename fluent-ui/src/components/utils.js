export function getSelfUriFromLinks(body) {
	const self = body.links.find(link => link.method === 'GET' && link.rel === 'self');
	if (self) {
		return self.uri
	}
	return null
}

export function getSelfUri(links){
	return links
	.filter(e => e.rel === 'self')
	.map(e => e.uri)
	.shift();
}