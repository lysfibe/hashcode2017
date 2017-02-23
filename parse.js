const fs = require('fs-jetpack')
const { sortBy } = require('lodash')

async function exec() {
	const file = process.argv[2] || 'kittens'
	const data = fs.read('./' + file + '.in')
	const [headers, sizes, ...rows] = data.split('\n')
	const [noVideos, noEndpoints, noDescriptors, noServers, fileSize] = headers.split(' ')
	const sizeList = sizes.split(' ')

	console.log('Parsing file: ...',file)
	console.log(noVideos, 'videos')
	console.log(noEndpoints, 'endpoints')
	console.log(noDescriptors, 'request descriptors')
	console.log(noServers, 'cache servers')
	console.log(fileSize, 'server size')

	// guards
	if (noVideos === 0 || noVideos > 10000 || noEndpoints === 0 || noEndpoints > 1000 || noDescriptors === 0 || noDescriptors > 1000000 || noServers === 0 || noServers > 1000 || fileSize === 0 || fileSize > 500000) {
		console.log('input file contains invalid values.')
		return(false)
	}

	let endpoints = {}
	let videoData = {}

	let cur = 0
	let total = 0
	let focus = 0

	let endpoint = -1

	let videoCount = 0

	let parsingRowData = false

	rows.forEach(row => {
		const [x, y, z] = row.split(' ')
		// console.log(total, cur)

		if (z == null) {
			// Parsing the middle block
			if (parsingRowData) {
				endpoints[focus].connections.push({ to: Number(x), ping: Number(y) })
				cur += 1
				if (total === cur) {
					parsingRowData = false
					// sorting connections by latency (ping)
					endpoints[focus].connections = sortBy(endpoints[focus].connections, 'ping')
				}

			} else {
				endpoint += 1
				endpoints[endpoint] = { datacenter: Number(x), connections: [], requests: [] }
				focus = endpoint
				total = Number(y)
				cur = 0
				parsingRowData = true
			}
		} else {
			// Parsing request
			endpoints[y].requests.push({requestID: x,
				hits: z
			})
			// sorting requests by hits for endpoint
			endpoints[y].requests = sortBy(endpoints[y].requests, 'hits')
		}
	})

	for(i in endpoints) {
		n = m = 0
		console.log(i)
	}

	fs.write('./' + file + '.json', endpoints)

}

exec()