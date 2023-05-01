// get user's coordinates                                                                                                                        
async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

let coordinates = []
let myMap = {}

//build map
function buildMap(){
        myMap = L.map('map', {
		center: coordinates,
		zoom: 12,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(myMap)
        const marker = L.marker(coordinates)
		marker
		.addTo(myMap)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
}

function addMarkers(){
    for (var i = 0; i < businesses.length; i++) {
        markers = L.marker([
            businesses[i].lat,
            businesses[i].long,
        ])
        .bindPopup(`<p1>${businesses[i].name}</p1>`)
        .addTo(myMap)
    }
}

async function getFoursquare(business) {
    coordinates = await getCoords()
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: ''
        }
    };
	let lat = coordinates[0]
	let lon = coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = await JSON.parse(data)
	let businesses = await parsedData.results
	return businesses
}
//process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

window.onload = async () => {
	coordinates = await getCoords()
    buildMap()
}

document.getElementById('submit').addEventListener('click', async () => {
	let business = document.getElementById('business').value
    let data = await getFoursquare(business)
	businesses = processBusinesses(data)
	addMarkers()
})