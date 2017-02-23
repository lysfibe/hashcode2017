const getData = require('./parse')
const fs = require('fs-jetpack')

async function exec() {
	const [originalEndpoints, headers, sizes] = await getData()
	const caches = {}

	const getCache = id => {
		if (caches[id] != null) {
			return caches[id]
		} else {
			const newCache = {
				id,
				capacity: headers.fileSize,
				videos: [],
			}
			console.log(newCache)
			caches[id] = newCache
			return newCache
		}
	}

	const getMostRequested = (videos) => {
		let res = { id: null, requests: 0 }
		Object.entries(videos).forEach(([ id, reqs ]) => {
			if (res.requests < reqs) {
				res = { id, requests: reqs }
			}
		})
		return res
	}

	const getClosestCache = (size, datacentre, caches) => {
		let res = { id: null, distance: datacentre, c :null }
		Object.entries(caches).forEach(([id, d]) => {
			if (d.ping < res.distance) {
				const cache = getCache(id)
				if (cache.capacity > size) {
					res = { id, distance: d.ping, c: cache }
				}
			}
		})
		return res
	}

	const endpoints = Object.assign({}, originalEndpoints)

	Object.entries(endpoints).forEach(([endpointId, endpointData]) => {
		const mostRequested = getMostRequested(endpointData.requests)
		if (mostRequested.id == null) return
		console.log(mostRequested)
		delete endpointData[mostRequested.id]
		const cache = getClosestCache(mostRequested.requests, endpointData.datacenter, endpointData.connections)
		console.log(cache)
		if (cache.id != null) {
			cache.c.videos.push(mostRequested)
			cache.c.capacity -= mostRequested.requests
		}
	})

	fs.write('wut.json', caches)
}

exec()
