/* global $*/
/* global Circles*/
/* global Snap*/

;(function(){
	"use strict";

	var Aboutme = {};
	
	//var ScrollMonitor = require("../vendor/scrollMonitor.js");
	
	var AnimatedNumber = require("../lib/AnimatedNumber.js");
	var percentageColors = ["#9ac21e", "#ffd43d", "#00ccd3"];
	var graphs = $(".circle-graph"), circles = [], config;
	//var graphsWatcher = ScrollMonitor.create($("#programming-skills")[0]);
	//var statsWatcher = ScrollMonitor.create($("#stats")[0]);
	var animatedStats=[];
	function svgAnimate(f){
		console.log("svg animate");
		var leftEye = f.select("#left-eye");
		var rightEye = f.select("#right-eye");
		var leftEyeClosed = f.select("#left-eye-closed");
		var rightEyeClosed = f.select("#right-eye-closed");
		leftEyeClosed.addClass("hidden");
		rightEyeClosed.addClass("hidden");
		setInterval(function(){
			leftEye.addClass("hidden");
			rightEye.addClass("hidden");
			leftEyeClosed.removeClass("hidden");
			rightEyeClosed.removeClass("hidden");
			setTimeout(function(){
				leftEye.removeClass("hidden");
				rightEye.removeClass("hidden");
				leftEyeClosed.addClass("hidden");
				rightEyeClosed.addClass("hidden");
			}, 300);
		}, 4000);
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
		console.log("animate stats");
		for(var j = 0, limit2 = animatedStats.length; j<limit2; j++){
			animatedStats[j].start();
		}
	}
	function createGraphs(){
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
	}
	function animateRandomFacts(){
		var factToGo, factToAppear;
		var factsInterval = setInterval(function(){			
			factToAppear = $("#random-facts").find(".active").next().length===0 ? $("#random-facts").find("li:nth-child(1)") :  $("#random-facts").find(".active").next();
			factToGo = $("#random-facts").find(".active").addClass("unshown").removeClass("active");
			factToAppear.removeClass("hidden").addClass("active").addClass("unshown");
			setTimeout(function(){
				factToGo.addClass("hidden");
				factToAppear.removeClass("unshown");
			}, 400);
		},5000);
	}
	
	/*graphsWatcher.enterViewport(function(){
		
	});
	statsWatcher.enterViewport(function(){
		animateStats();
	});*/
	
	Aboutme.setSVG = function(){
		if(typeof Snap !== "function"){
			console.error("No se encuentra la librería de Snap.svg");
			return;
		}
		var s = new Snap("#me-about");
		Snap.load("images/aboutme-me.svg", function(f){
			svgAnimate(f);
			s.append(f);
		});
	};
	Aboutme.init = function(){
		setAnimateStats();
		createGraphs();
		animateRandomFacts();
		Aboutme.setSVG();
	};

	module.exports = Aboutme;
})();
