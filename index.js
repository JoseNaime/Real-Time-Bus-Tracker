mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zZS1uYWltZSIsImEiOiJja3VzdjRkbmIwN2RrMzJwNjExMmptMWRlIn0.zSdaL0btq6geiGBnGOG3bQ';
const asideElement = document.getElementById("menu");
const routesList = document.getElementById("routes-list");
let selectedId = null;


function handleToggleAsideClick() {
    if (asideElement.classList.contains("hidden")) {
        asideElement.classList.add("show")
        asideElement.classList.remove("hidden")
    } else {
        asideElement.classList.add("hidden")
        asideElement.classList.remove("show")
    }
}

function handleBusRouteClick(ev) {
    selectedId = ev.target.innerHTML;
    console.log(selectedId)
}


let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104081, 42.365554],
    zoom: 14,
});

let marker = new mapboxgl.Marker()
    .setLngLat([0, 0])
    .addTo(map);

async function getData() {
    const response = await fetch("https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip")
    const routesArray = await response.json();

    let routesHTML = ""
    if (routesArray.data === undefined) return []
    routesArray.data.forEach(route => {
        routesHTML += `<li><p onclick="handleBusRouteClick(event)">${route.id}</p></li>`
    })

    routesList.innerHTML = routesHTML;
    return routesArray.data
}

async function updateTracker() {
    const routesArray = await getData();
    setTimeout(() => {
        if (selectedId !== null && routesArray.size !== 0) {
            const currentRoute = routesArray.filter(route => route.id.toString() === selectedId.toString())[0]
            if (!!currentRoute) {
                const lngLat = [currentRoute.attributes.longitude, currentRoute.attributes.latitude];
                map.panTo(lngLat);
                marker.setLngLat(lngLat);
            }
        }
        updateTracker()
    }, 2000);
}

updateTracker();

if (typeof module !== 'undefined') {
    module.exports = {move};
}