"use strict";
/* global $*/
/* global Circles*/
;(function(){
	var page = window.location.pathname.substr(1).replace(/.html/g, "");
	var AnimatedJsonSprite = require("./lib/AnimatedJsonSprite.js");
	var AnimatedNumber = require("./lib/AnimatedNumber.js");
	var ScrollMonitor = require("./vendor/scrollMonitor.js");
	var body = $("html, body");
	var percentageColors = ["#9ac21e", "#ffd43d", "#00ccd3"];
	var homeMe, animatedStats=[];
	function onToggleMobileMenu(e){
		$(e.currentTarget).toggleClass("active");
		$("#main-container").toggleClass("mobile-menu-on");
	}
	function onScrollHomeDown(e){
		body.animate({scrollTop:$("#intro-container").height()}, "500", "swing");
	}
	function getIdByPercentage(percentage){
		if(percentage>90){
			return 0;
		}
		else if(percentage > 60){
			return 1;
		}
		else{
			return 2;
		}
	}
	
	function setAnimateStats(){
		var statsNumbers = $(".stats-number");
		for(var j = 0, limit2 = statsNumbers.length; j<limit2; j++){
			animatedStats.push(new AnimatedNumber(statsNumbers[j]));
			animatedStats[animatedStats.length-1].init();
		}
	}
	function animateStats(){
		for(var j = 0, limit2 = animatedStats.length; j<limit2; j++){
			animatedStats[j].start();
		}
	}
	//
	switch(page){
		case "index":
		case "":
			$("#home-down-btn").on("click", onScrollHomeDown);
			homeMe = new AnimatedJsonSprite("spritesheets/homes-normal.png", document.getElementById("me"), {loop:true, frameRate:40});
			homeMe.start();
			break;
		case "acerca":
			var graphs = $(".circle-graph"), circles = [], config;
			var graphsWatcher = ScrollMonitor.create($("#programming-skills")[0]);
			var statsWatcher = ScrollMonitor.create($("#stats")[0]);
			
			
			graphsWatcher.enterViewport(function(){
				for(var i = 0, limit = graphs.length; i<limit; i++){
					
					config = {
						id:			graphs[i].id,
						value: 		$(graphs[i]).attr("data-percentage"),
						radius: 	25,
						duration: 	1000,
						/* jshint ignore:start */
						text: 		function(value){return "";},
						/* jshint ignore:end */
						textClass: 	"circle-graph-"+getIdByPercentage($(graphs[i]).attr("data-percentage")),
						width: 		5,
						colors: 	["#e1e1e1", percentageColors[getIdByPercentage($(graphs[i]).attr("data-percentage"))]]
					};

					circles.push(Circles.create(config));
				}
			});
			statsWatcher.enterViewport(function(){
				animateStats();
			});
			setAnimateStats();
			break;
		default:
			console.warn("Se desconoce el html:", page);
	}
	$("#mobile-menu").on("click", onToggleMobileMenu);


})();