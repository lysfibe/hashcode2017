const fs = require('fs-jetpack')

async function exec() {
	const file = process.argv[2] || 'kittens'
	const data = fs.read('./' + file + '.in')
	const [headers, sizes, ...rows] = data.split('\n')
	const [noVideos, noEndpoints, noDescriptors, noServers, fileSize] = headers.split(' ')

	console.log(noVideos, 'videos')
	console.log(noEndpoints, 'endpoints')
	console.log(noDescriptors, 'request descriptors')
	console.log(noServers, 'cache servers')
	console.log(fileSize, 'server size')

	let id = {}

	let cur = 0
	let total = 0
	let focus = 0

	let parsingRowData = false

	rows.forEach(row => {
		const [x, y] = row.split(' ')
		// console.log(total, cur)
		if (parsingRowData) {
			id[focus].push({ to: Number(x), ping: Number(y) })
			cur += 1
			if (total === cur) {
				parsingRowData = false
			}
		} else {
			id[Number(x)] = []
			focus = Number(x)
			total = Number(y)
			cur = 0
			parsingRowData = true
		}
	})

	fs.write('./' + file + '.json', id)

}

exec()