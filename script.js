var map;
var alleynsISO;
var bessemerISO;
var dulwichISO;
var hamletISO;
var prepISO;
var dvisISO;
var woodISO;
var herneISO;
var jagsISO;
var kerrISO;
var kingsdaleISO;
var oakfieldISO;
var rosemeadISO;
var rosendaleISO;
var charterISO;
var sch;
var schoolsISO;

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
		center: [51.449216,-0.085156],
		zoom: 14,
		layers: [greyscale]
	});

	
	var baseLayers = {
		"Greyscale": greyscale,
		"Satellite": satellite,
		"Public Transport": transport
	};
	
	//Modal
	//var modal = document.getElementById("myModal");

	//Button to open modal
	//var btn = document.getElementById("modalButton");

	//Span element to close modal
	//var span = document.getElementsByClassName("close")[0];

	//Button function
	//btn.onclick = function() {
	  //modal.style.display = "block";
	//}

	//Close modal onclick 'x'
	//span.onclick = function() {
	  //modal.style.display = "none";
	//}

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
		//div.innerHTML += '<svg height="20" width="25"><g fill="none" stroke="#f01f0c" stroke-width="3"><path d="M5 20 l215 0" /></g></svg><span>  High traffic road</span><br>';
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
				//case 5: return {
					//color:"#f01f0c", 
					//weight:3,
					//opacity: 0.5
				//};
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
	
	//Add layer control
	L.control.layers(baseLayers, features,{collapsed: true}).addTo(map); 
}



function school (){
	//Style isochrones and icon
	var iso = {
		color: 'none',
		fillColor: '#f788f1',
		fillOpacity: 0.2,
	};

	var schoolIcon = L.icon({
		iconUrl:'sch.png',
		iconSize: [15,15],
	});	
	

	
	var alleyns = L.geoJSON(alleynsISO, {style: iso}).bindTooltip(function (alleynsISO) {return alleynsISO.feature.properties.AA_METERS;}, {sticky:true});
	var bessemer = L.geoJSON(bessemerISO, {style: iso}).bindTooltip(function (bessemerISO) {return bessemerISO.feature.properties.AA_METERS;}, {sticky:true});
	var dulwich = L.geoJSON(dulwichISO, {style: iso}).bindTooltip(function (dulwichISO) {return dulwichISO.feature.properties.AA_METERS;}, {sticky:true});
	var hamlet = L.geoJSON(hamletISO, {style: iso}).bindTooltip(function (hamletISO) {return hamletISO.feature.properties.AA_METERS;}, {sticky:true});
	var prep = L.geoJSON(prepISO, {style: iso}).bindTooltip(function (prepISO) {return prepISO.feature.properties.AA_METERS;}, {sticky:true});
	var dvis = L.geoJSON(dvisISO, {style: iso}).bindTooltip(function (dvisISO) {return dvisISO.feature.properties.AA_METERS;}, {sticky:true});
	var charter = L.geoJSON(charterISO, {style: iso}).bindTooltip(function (charterISO) {return charterISO.feature.properties.AA_METERS;}, {sticky:true});
	var wood = L.geoJSON(woodISO, {style: iso}).bindTooltip(function (woodISO) {return woodISO.feature.properties.AA_METERS;}, {sticky:true});
	var herne = L.geoJSON(herneISO, {style: iso}).bindTooltip(function (herneISO) {return herneISO.feature.properties.AA_METERS;}, {sticky:true});
	var jags = L.geoJSON(jagsISO, {style: iso}).bindTooltip(function (jagsISO) {return jagsISO.feature.properties.AA_METERS;}, {sticky:true});
	var kerr = L.geoJSON(kerrISO, {style: iso}).bindTooltip(function (kerrISO) {return kerrISO.feature.properties.AA_METERS;}, {sticky:true});
	var kingsdale = L.geoJSON(kingsdaleISO, {style: iso}).bindTooltip(function (kingsdaleISO) {return kingsdaleISO.feature.properties.AA_METERS;}, {sticky:true});
	var oakfield = L.geoJSON(oakfieldISO, {style: iso}).bindTooltip(function (oakfieldISO) {return oakfieldISO.feature.properties.AA_METERS;}, {sticky:true});
	var rosemead = L.geoJSON(rosemeadISO, {style: iso}).bindTooltip(function (rosemeadISO) {return rosemeadISO.feature.properties.AA_METERS;}, {sticky:true});
	var rosendale = L.geoJSON(rosendaleISO, {style: iso}).bindTooltip(function (rosendaleISO) {return rosendaleISO.feature.properties.AA_METERS;}, {sticky:true});
	var charter = L.geoJSON(charterISO, {style: iso}).bindTooltip(function (charterISO) {return charterISO.feature.properties.AA_METERS;}, {sticky:true});

	
	var schoolsISO = L.layerGroup([alleyns, bessemer, dulwich, hamlet, prep, dvis, charter, wood, herne, jags, kerr, kingsdale, oakfield, rosemead, rosendale, charter]);
    
    

	L.geoJSON (schools,{
		pointToLayer: function(feature, latlng){
        		
			//Add school markers 
			return L.marker(latlng,{icon: schoolIcon}).addTo(map).on('click', function (e) {
    			
                //if(map.hasLayer([alleyns, bessemer, dulwich, hamlet, prep, dvis, charter, wood, herne, jags, kerr, kingsdale, oakfield, rosemead, rosendale, charter])) {
        			//map.removeLayer([alleyns, bessemer, dulwich, hamlet, prep, dvis, charter, wood, herne, jags, kerr, kingsdale, oakfield, rosemead, rosendale, charter]);
            	//}	
            	
    			if (feature.properties.SCHOOL_NAM == "Alleyn's School" ){
    				if(map.hasLayer(alleyns)) {
            			map.removeLayer(alleyns);
                	}	
            	    else {
                    	map.addLayer(alleyns);
            		}			
    			    			
        		}	
				if (feature.properties.SCHOOL_NAM == "Bessemer Grange Primary School" ){
					//Remove isochrones if already present
					if(map.hasLayer(bessemer)) {
						map.removeLayer(bessemer);
					}
					//Add isochrones
					else {
						map.addLayer(bessemer); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Dulwich College" ){
					//Remove isochrones if already present
					if(map.hasLayer(dulwich)) {
						map.removeLayer(dulwich);
					}
					//Add isochrones
					else {
						map.addLayer(dulwich); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Dulwich Hamlet Junior School" ){
					//Remove isochrones if already present
					if(map.hasLayer(hamlet)) {
						map.removeLayer(hamlet);
					}
					//Add isochrones
					else {
						map.addLayer(hamlet); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Dulwich Prep London" ){
					//Remove isochrones if already present
					if(map.hasLayer(prep)) {
						map.removeLayer(prep);
					}
					//Add isochrones
					else {
						map.addLayer(prep); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Dulwich Village Church of England Infants' School" ){
					//Remove isochrones if already present
					if(map.hasLayer(dvis)) {
						map.removeLayer(dvis);
					}
					//Add isochrones
					else {
						map.addLayer(dvis); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Dulwich Wood Primary School" ){
					//Remove isochrones if already present
					if(map.hasLayer(wood)) {
						map.removeLayer(wood);
					}
					//Add isochrones
					else {
						map.addLayer(wood); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Herne Hill School" ){
					//Remove isochrones if already present
					if(map.hasLayer(herne)) {
						map.removeLayer(herne);
					}
					//Add isochrones
					else {
						map.addLayer(herne); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "James Allen's Girls' School" ){
					//Remove isochrones if already present
					if(map.hasLayer(jags)) {
						map.removeLayer(jags);
					}
					//Add isochrones
					else {
						map.addLayer(jags); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Judith Kerr Primary School" ){
					//Remove isochrones if already present
					if(map.hasLayer(kerr)) {
						map.removeLayer(kerr);
					}
					//Add isochrones
					else {
						map.addLayer(kerr); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Kingsdale Foundation School" ){
					//Remove isochrones if already present
					if(map.hasLayer(kingsdale)) {
						map.removeLayer(kingsdale);
					}
					//Add isochrones
					else {
						map.addLayer(kingsdale); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Oakfield Preparatory School" ){
					//Remove isochrones if already present
					if(map.hasLayer(oakfield)) {
						map.removeLayer(oakfield);
					}
					//Add isochrones
					else {
						map.addLayer(oakfield); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Rosemead Preparatory School" ){
					//Remove isochrones if already present
					if(map.hasLayer(rosemead)) {
						map.removeLayer(rosemead);
					}
					//Add isochrones
					else {
						map.addLayer(rosemead); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "Rosendale Primary School" ){
					//Remove isochrones if already present
					if(map.hasLayer(rosendale)) {
						map.removeLayer(rosendale);
					}
					//Add isochrones
					else {
						map.addLayer(rosendale); 
					}
				}
				if (feature.properties.SCHOOL_NAM == "The Charter School North Dulwich" ){
					//Remove isochrones if already present
					if(map.hasLayer(charter)) {
						map.removeLayer(charter);
					}
					//Add isochrones
					else {
						map.addLayer(charter); 
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

	


