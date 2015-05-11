/* global $*/
/* global Snap*/
/* global google*/
;(function(){
	"use strict";
	var Contact = {};
	var map, whereIAm;
	function svgAnimate(f){
		var computerScreen = f.select("#svg-screen"),
			arms = f.select("#svg-arms"),
			initialScreenColor="#fff",
			alternateScreenColor="#ccc",
			i=0;
		
		setInterval(function(){
			i++;
			computerScreen.animate({fill:i%2===0 ? initialScreenColor : alternateScreenColor}, 200);
			if(i%7===0){
				arms.removeClass("arms-down");
				arms.addClass("arms-up");
			}
			else{
				arms.removeClass("arms-up");
				arms.addClass("arms-down");
			}

		}, 700);
	}
	function setAvailability(f){
		var availability = 10-Math.round(Number($("#availability-percentage").attr("value"))/10);
		var papers = f.select("#papers");
		
		var i = 1;
		while(papers.select("rect:nth-child("+i+")")){
			papers.select("rect:nth-child("+i+")").addClass("paper-out");
			i++;
		}
		i=1;
		var papersInterval = setInterval(function(){
			if(!papers.select("rect:nth-child("+(i+10)+")") || i>availability){
				clearInterval(papersInterval);
				return;
			}
			papers.select("rect:nth-child("+i+")").removeClass("paper-out");
			papers.select("rect:nth-child("+i+")").addClass("paper-in");
			papers.select("rect:nth-child("+(i+10)+")").removeClass("paper-out");
			papers.select("rect:nth-child("+(i+10)+")").addClass("paper-in");
			i++;
		}, 200);
	}
	function resizeMap(){
		map.setCenter(whereIAm);
	}
	function addMarker(whereMarkerIs){
		var	icon = new google.maps.MarkerImage("images/marker.png", null, null, null, new google.maps.Size(144,192));
		var marker = new google.maps.Marker({
						position:whereMarkerIs,
						map:map,
						flat:true,
						title:"SuperIRis",
						icon:icon,
						optimized:false,
						animation: google.maps.Animation.DROP
					});
	}

	Contact.obfuscateMailTo = function(){
		// Email obfuscator script 2.1 by Tim Williams, University of Arizona
		// Random encryption key feature by Andrew Moulden, Site Engineering Ltd
		var coded = "MbyS@JOtlGQGQJ.ZbL",
			key = "stZ5MUTquSkAXVl2Q4J7RxnPF3OgBmdfyWrHjEIoDN1CzpcLhv80Ga9Y6beKiw",
			shift=coded.length,
			link="",
			ltr;
		for (var i=0; i<coded.length; i++) {
			if (key.indexOf(coded.charAt(i))===-1) {
			  ltr = coded.charAt(i);
			  link += (ltr);
			}
			else {     
			  ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length;
			  link += (key.charAt(ltr));
			}
		}
		$("#contact-mail").attr("href", "mailto:"+link);
	};
	Contact.setFreelanceStatusSVG = function(){
		if(typeof Snap !== "function"){
			console.error("No se encuentra la librería de Snap.svg");
			return;
		}
		var s = new Snap("#me-working-status");
		Snap.load("images/freelance-status.svg", function(f){
			svgAnimate(f);
			setAvailability(f);
			s.append(f);
		});
	};
	Contact.setMap = function(){
		console.log("set map");
		var whereMarkerIs = new google.maps.LatLng(19.368806, -99.134445),
			features = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#e3e3e3"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#cccccc"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#FFFFFF"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}],
			CUSTOM_STYLE_MAP = "custom_style",
			
			styledMapOptions = {
				name: "Custom Style"
			},
			customMapType = new google.maps.StyledMapType(features, styledMapOptions),
			mapOptions;
		whereIAm = new google.maps.LatLng(19.468806, -99.134445);
		mapOptions = {
				zoom:10,
				center:whereIAm,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, CUSTOM_STYLE_MAP]
				},
				mapTypeId: CUSTOM_STYLE_MAP,
				disableDefaultUI: true,
				draggable:false,
				backgroundColor:"#fff",
				disableDoubleClickZoom:true,
				scrollwheel: false,
				maxZoom:15
			};
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		map.mapTypes.set(CUSTOM_STYLE_MAP, customMapType);
		setTimeout(function(){
			addMarker(whereMarkerIs);
		}, 2000);
		

	};
	Contact.init = function(){
		Contact.obfuscateMailTo();
		Contact.setFreelanceStatusSVG();
		google.maps.event.addDomListener(window, "load", Contact.setMap);
		google.maps.event.addDomListener(window, "resize", resizeMap);
	};
	module.exports = Contact;

})();