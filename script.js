var map;
var twenty;
var ten;
var sch;

//Initialise map
function loadMap()	{

	var attr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJpc3NoZWFyaW5nIiwiYSI6ImNraGJ6OHRqczAzMjUycnRnZjB1MG9rMXYifQ.0otmOontQxnYeggk-SKzKw',
		attrThun = 'Maps © Thunderforest, Data © OpenStreetMap contributors',
		thunUrl = 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=ce38d9691f0a40c4bef380aabdf6f277';
	
	//Define map layers
	var greyscale   = L.tileLayer(url, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: attr}),
		satellite = L.tileLayer(url, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: attr}),
		transport = L.tileLayer(thunUrl, {maxZoom: 18, attribution:attrThun});
	
	//Define center, zoom and style of map on load
	map = L.map('map', {
		center: [51.45297,-0.08568],
		zoom: 14,
		layers: [greyscale]
	});

	
	var baseLayers = {
		"Greyscale": greyscale,
		"Satellite": satellite,
		"Public Transport": transport
	};
	
	//Modal
	var modal = document.getElementById("myModal");

	//Button to open modal
	var btn = document.getElementById("modalButton");

	//Span element to close modal
	var span = document.getElementsByClassName("close")[0];

	//Button function
	btn.onclick = function() {
	  modal.style.display = "block";
	}

	//Close modal onclick 'x'
	span.onclick = function() {
	  modal.style.display = "none";
	}

	//Close modal onclick ouside the modal
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = "none";
	  }
	}
	
	//Add map legend 
	//The following code has been adapted from https://codepen.io/haakseth/pen/KQbjdO-->
	var legend = L.control({position: 'bottomright'});
	
	//DomUtil creates HTML element within Leaflet map structure
	legend.onAdd = function(map) {
		var div = L.DomUtil.create("div", "legend"); 
		
		div.innerHTML += '<img src="sch.png" width="15px";height="15px;"><span>   School</span><br>';
		div.innerHTML += '<img src="noentry.png" width="15px";height="15px;"><span>   No vehicles</span><br>';
		div.innerHTML += '<img src="busgate.png" width="15px";height="15px;"><span>   Bus Gate</span><br>';
		div.innerHTML += '<svg height="20" width="25"><g fill="none" stroke="#03a9fc" stroke-width="5"><path stroke-dasharray="5,5" d="M5 20 l215 0" /></g></svg><span>  Pedestrians Only</span><br>';
		div.innerHTML += '<svg height="20" width="25"><g fill="none" stroke="#55ff00" stroke-width="5"><path d="M5 20  l215 0" /></g></svg><span>  Pedestrians/cycles only</span><br>';
		div.innerHTML += '<svg height="20" width="25"><g fill="none" stroke="#ffff00" stroke-width="5"><path d="M5 20 l215 0" /></g></svg><span>  Low-traffic/School Street</span><br>';
		div.innerHTML += '<svg height="20" width="25"><g fill="none" stroke="#ffaa00" stroke-width="5"><path d="M5 20 l215 0" /></g></svg><span>  Timed low-traffic road</span><br>';
		div.innerHTML += '<svg height="20" width="25"><g fill="none" stroke="#f01f0c" stroke-width="3"><path d="M5 20 l215 0" /></g></svg><span>  High traffic road</span><br>';
		return div;
	};
	legend.addTo(map);

	//Style line dependant on CLA value and add to map
	var ro = L.geoJSON(routes,{
		style: function(feature){
			switch (feature.properties.CLA){
				case 1: return {
				 	color: "#03a9fc",
					weight: 5,
					opacity: 0.5,
					dashArray:'5,10'
				}; 
				case 2: return {
					color:"#55ff00", 
					weight:5,
					opacity: 0.5
				};
				case 3: return {
					color:"#ffff00", 
					weight:5,
					opacity: 0.5
				};
				case 4: return {
					color:"#ffaa00", 
					weight:5,
					opacity: 0.5
				};
				case 5: return {
					color:"#f01f0c", 
					weight:3,
					opacity: 0.5
				};
				default: return {color: "#000000"};
			}
		},
		//Add tooltip
		onEachFeature:onEachFeature,
	});
	
	//Set symbol icons
	var roadClosed = L.icon({
		iconUrl: 'noentry.png',
		iconSize: [12, 12],
	});	
	var busGate = L.icon({ 
		iconUrl: 'busgate.png',
		iconSize: [15, 15],
	});	
	
	//Display restriction icons dependant on restriction type
	var res = L.geoJSON(restrictions,{
		pointToLayer: function(feature, latlng){
			switch (feature.properties.RESTRICTIO){
				case "No Vehicles": return L.marker(latlng,{icon: roadClosed});
				case "Bus Gate": return L.marker(latlng,{icon: busGate});
				default: return {}
			}	
		},
		//Add Tooltip
		onEachFeature:onEachFeature,		
	});
	
	//Naming layers for layer control
	var features = {
			"Routes": ro,
			"Restrictions": res
		};	
	
	//Add layer control, not collapsed for easy visibility
	L.control.layers(baseLayers, features,{collapsed: false}).addTo(map); 
}



function school (){
	//Style isochrones and icon
	var tenMin = {
		color: 'none',
		fillColor: '#f788f1',
		fillOpacity: 0.2,
	};
	var twentyMin = {
		color: 'none',
		fillColor: '#f59df0',
		fillOpacity: 0.2,
	};
	var schoolIcon = L.icon({
		iconUrl:'sch.png',
		iconSize: [15,15],
	});	
	
	
	var twenty = L.geoJSON(dvisTwenty, {style: twentyMin}).bindTooltip("Area within a 20 min walk or 10 min cycle", {sticky:true});
	var ten = L.geoJSON(dvisTen, {style: tenMin}).bindTooltip("Area within a 10 min walk or 5 min cycle", {sticky:true});
	
	//Both isochrones into layerGroup
	var isochrones = L.layerGroup([twenty, ten]);

				

	L.geoJSON (schools,{
		pointToLayer: function(feature, latlng){
			//Add school markers 
			return L.marker(latlng,{icon: schoolIcon}).addTo(map).on('click', function (e) { 
				if (feature.properties.OBJECTID == 3 ){//Only available for one school currently
					//Remove isochrones if already present
					if(map.hasLayer(isochrones)) {
						map.removeLayer(isochrones);
					}
					//Add isochrones
					else {
						map.addLayer(isochrones); 
					}
				}
			});
		},
		//Add tooltip
		onEachFeature:onEachFeature, 
	})
}	

//Tooltip 
function onEachFeature(feature, layer) {
	var tooltipContent = feature.properties.popupConte 
	layer.bindTooltip(tooltipContent); 
		
}

	


