
var dataBar = document.getElementById("data_bar")
var map = L.map('map',{zoomControl:false}).setView([42.056, -87.678], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

//Pin Color Settings
var geojsonMarkerOptions = {
	radius: 5,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};

//Add Popup Info
function onEachFeature(feature, layer) {
	// does this feature have a property named popupContent?
	if (feature.properties && feature.properties.location) {
		var str = feature.properties.location;
		layer.bindPopup(str,{offset:new L.Point(0,0)});

	}
}


function updateDataBar(marker){
	incident_count = 0;
		console.log(marker);
		dataBar.innerHTML = "";
		var type = "for all crime";
		var theftChecked = document.getElementById("t4").checked;
		console.log(theftChecked);
		var noFilter = true;
		if(theftChecked){
			console.log("checked");
			type = "for Theft";
			noFilter = false;
		}

		var details = marker.feature.properties.details;
		$("#data_bar").append(' \
		<div> \
		<!-- Default panel contents --> \
		<div class= "data-header"> \
		<div id="data-header">'+details.length +' Results </div>\
		<div class = "subtitle">' + type + ' at '+marker.feature.properties.location+'</div> \
		</div><div class = "date"><h6>September 2013 - Today</h6></div> \
		</div> ')
		for(incident in details){
			if(noFilter || details[incident].type.indexOf("Theft") > -1 || details[incident].type.indexOf("Burglary") > -1 ){
				incident_count++;
				$("#data_bar").append(
					'<div class="list-group"> \
					<div class = "hline"> </div> \
					<div class="crime-instance"> \
					<div class = "crimetitle">'
					+details[incident].date+
					'</div> \
					<div>'
					+details[incident].type+" <br>"+ details[incident].offense+
					'</div>\
					</div>'
				)
			}
		}

		$("#data-header").text(incident_count+" Results");

}


document.getElementById("t4").addEventListener("click",
	function(){
		console.log("CLICKED YAH");
		updateDataBar(currChecked);
	});


var currChecked;
L.geoJson(sites,
	{

		pointToLayer: function (feature, latlng) {
			console.log("mapping yo");
			var marker = L.circleMarker(latlng, geojsonMarkerOptions);
			marker.on('click', function(){
				updateDataBar(marker)
				currChecked = marker;
			})
            marker.on('mouseover', function(){
				this.openPopup();
			})
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
			return marker;

		},
		onEachFeature: onEachFeature,
    

	}).addTo(map);

$('#map').on('click', '.leaflet-popup-content-wrapper', function() {
    alert('Hello from Toronto!');
});

	function getVals(){
		// Get slider values
		var parent = this.parentNode;
		var slides = parent.getElementsByTagName("input");
		var slide1 = parseFloat( slides[0].value );
		var slide2 = parseFloat( slides[1].value );
		// Neither slider will clip the other, so make sure we determine which is larger
		if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }

		var displayElement = parent.getElementsByClassName("rangeValues")[0];
		displayElement.innerHTML = slide1 + " - " + slide2;
	}


function loadRecent(){
    $("#data_bar").append(' \
		<div> \
		<!-- Default panel contents --> \
		<div class= "data-header"> \
		<div id="data-header">'+' Recent Results </div>\
		</div><div class = "date"><h6>January 2016 - Today</h6></div> \
		</div> ')
        console.log(recent)
		for(var incident in recent['features']){
                var properties = recent['features'][incident]['properties'];
            $("#data_bar").append(
					'<div class="list-group"> \
					<div class = "hline"> </div> \
					<div class="crime-instance"> \
					<div class = "crimetitle">'
					+properties['details'][0]['date']+
					'</div> \
					<div>'
					+properties['details'][0]['type']+" <br>"+ properties['details'][0]['offense']+' at '+properties['location']+
					'</div>\
					</div>'
				)
		}

    
}

	window.onload = function(){
		// Initialize Sliders
		var sliderSections = document.getElementsByClassName("range-slider");
		for( var x = 0; x < sliderSections.length; x++ ){
			var sliders = sliderSections[x].getElementsByTagName("input");
			for( var y = 0; y < sliders.length; y++ ){
				if( sliders[y].type ==="range" ){
					sliders[y].oninput = getVals;
					// Manually trigger event first time to display values
					sliders[y].oninput();
				}
			}
		}
        loadRecent();
	}
