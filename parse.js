const fs = require('fs-jetpack')

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
			// Parsing block the middle block
			if (parsingRowData) {
				endpoints[focus].connections.push({ to: Number(x), ping: Number(y) })
				cur += 1
				if (total === cur) {
					parsingRowData = false
				}
			} else {
				endpoint += 1
				endpoints[endpoint] = { datacenter: Number(x), connections: [], requests: {} }
				focus = endpoint
				total = Number(y)
				cur = 0
				parsingRowData = true
			}
		} else {
			// Parsing request
			endpoints[y].requests[x] = z
		}
	})

	fs.write('./' + file + '.json', endpoints)

}

exec()