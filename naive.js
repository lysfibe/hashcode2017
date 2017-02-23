const getData = require('./parse')

async function exec() {
	const [originalEndpoints, headers, sizes] = await getData()
	const caches = {}
	const initCache = () => ({
		usage: 0,
		size: headers.fileSize,
		videos: [],
	})
	const getMostRequested = (videos) => {
		let res = { id: null, requests: 0 }
		Object.entries(([id, reqs]) => {
			if (res.requests > reqs) {
				res = { id, requests: reqs}
			}
		})
		return videos
	}

	const endpoints = Object.assign({}, originalEndpoints)

	Object.entries(endpoints).forEach(([endpointId, endpointData]) => {

	})
}

exec()
