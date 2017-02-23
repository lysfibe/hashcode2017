const fs = require('fs-jetpack')
const { sortBy } = require('lodash')

async function exec() {

	const file = process.argv[2] || 'kittens'
	const endpoints = fs.read('./' + file + '.json', 'json')
	console.log("Noooooooooooooooooooooooo\n" +
		"She wasn't readyyyyyyyyy. PINEAPPLES")
	
	// for(i in endpoints) {
	// 	n = m = 0
	// 	console.log(i)
	// }
}

exec()