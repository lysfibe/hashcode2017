const getData = require('./parse')
const fs = require('fs-jetpack')

async function exec() {
	const file = process.argv[2] || 'kittens'
	const [originalEndpoints, headers, sizes] = await getData(file)
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
			caches[id] = newCache
			return newCache
		}
	}

	const getMostRequested = (videos) => {
		let res = { id: null, requests: 0 }
		Object.entries(videos).forEach(([ id, reqs ]) => {
			if (res.requests < reqs) {
				res = { id, requests:reqs, size: sizes[id] }
			}
		})
		return res
	}

	const getClosestCache = (size, datacentre, caches) => {
		let res = { id: null, distance: datacentre, c :null }
		Object.entries(caches).forEach(([id, d]) => {
			if (d.ping < res.distance) {
				const cache = getCache(id)
				if (Number(cache.capacity) > Number(size)) {
					res = { id, distance: d.ping, c: cache }
				}
			}
		})
		return res
	}

	const endpoints = Object.assign({}, originalEndpoints)

	Object.entries(endpoints).forEach(([endpointId, endpointData]) => {
		if (endpointData == null) return
		const mostRequested = getMostRequested(endpointData.requests)
		if (mostRequested.id == null) return
		delete endpointData[mostRequested.id]
		const cache = getClosestCache(mostRequested.size, endpointData.datacenter, endpointData.connections)

		if (cache.id != null) {
			cache.c.videos = cache.c.videos.concat([mostRequested])
			cache.c.capacity -= mostRequested.size
		}
	})

	const second = Object.assign({}, caches)

	Object.entries(second).forEach(([id, data]) => {
		if (data.videos.length == 0) {
			delete caches[id]
		}
	})

	const number = Object.keys(caches).length

	let outfile = `${number}\n`

	const used = new Set()

	Object.entries(caches).forEach(([key, value]) => {
		if (used.has(String(key))) return

		outfile += String(key) + ' ' + value.videos.map(v => v.id).join(' ') + '\n'
		used.add(String(key))
	})

	fs.write(`${file}-results.out`, outfile)
}

exec()
