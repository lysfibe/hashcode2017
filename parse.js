const fs = require('fs-jetpack')

async function exec() {
	const data = fs.read('./kittens.in')
	const [headers, sizes, ...rows] = data.split('\n')
	const [noVideos, noEndpoints, noDescriptors, noServers, fileSize] = headers.split(' ')

	console.log(noVideos, 'videos')
	console.log(noEndpoints, 'endpoints')
	console.log(noDescriptors, 'request descriptors')
	console.log(noServers, 'cache servers')
	console.log(fileSize, 'server size')
}

exec()