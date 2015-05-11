(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/* global $*/

;(function(){
	var page = window.location.pathname.substr(1).replace(/.html/g, "");
	var Aboutme = require("./sections/aboutme.js");
	var Contact = require("./sections/contact.js");
	var Home = require("./sections/home.js");
	var ScrollMonitor = require("./vendor/scrollMonitor.js");
	function onToggleMobileMenu(e){
		$(e.currentTarget).toggleClass("active");
		$("#main-container").toggleClass("mobile-menu-on");
	}
	
	
	switch(page){
		case "index":
		case "":
			Home.init();
			break;
		case "acerca":
			Aboutme.init();
			break;
		case "contacto":
			Contact.init();
			break;
		default:
			console.warn("Se desconoce el html:", page);
	}
	$("#mobile-menu").on("click", onToggleMobileMenu);

})();


},{"./sections/aboutme.js":4,"./sections/contact.js":5,"./sections/home.js":6,"./vendor/scrollMonitor.js":7}],2:[function(require,module,exports){
;(function(){
	"use strict";
	var ajaxLoad = function(url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = ensureState;
		function ensureState(){
			if(xhr.readyState === 4 && xhr.status===200){
				callback(xhr);
			}
		}
		xhr.open("GET", url, true);
		xhr.send();
	};

	//
	//
	//
	var AnimatedJsonSprite = function(spriteURL, div, settings){
		this.spriteURL = spriteURL;
		this.jsonURL = spriteURL.replace("png", "json");
		this.div = div;
		
		this.currentStep = 0;
		div.style.backgroundImage = "url("+spriteURL+")";
		
		this.containerHeight = this.div.offsetHeight;
		this.containerWidth = this.div.offsetWidth;
		this.animationStarted = false;
		this.settings = {
			loop:false,
			loopStartStep:0,
			loopEndStep:0,
			frameRate:40,
			scale:1
		};

		for(var a in settings){
			if(this.settings.hasOwnProperty(a)){
				this.settings[a] = settings[a];
			}
		}

		ajaxLoad(this.jsonURL, this._onSpriteReady.bind(this));

	};

	AnimatedJsonSprite.prototype.start = function(){
		if(!this.image || !this.image.complete){
			this._onLoad = this.start;
			return;
		}
		if(this.animationStarted){
			return;
		}

		this.animationStarted = true;
		if(this.currentStep<this.steps || this.settings.loop){
			this._animateToEnd();
		}
	};
	AnimatedJsonSprite.prototype.stop = function(restart){
		this.meantToStop = true;
		this.animationStarted = false;
		this.restart = restart ? restart : false;
		//this.currentStep = 0;
	};

	AnimatedJsonSprite.prototype.hoverIn = function(until){
		if(!this.image.complete){
			this._onLoad = this.hoverIn;
			return;
		}
		if(this.animationStarted){
			return;
		}
		this.animationStarted = true;
		clearInterval(this.mainInterval);
		this.stepToStopForward = !isNaN(until) && until < this.steps ? until : this.steps;
		this._animateToEnd();
	};
	AnimatedJsonSprite.prototype.hoverOut = function(from, until){
		if(!this.image.complete){
			this._onLoad = this.hoverOut;
			return;
		}
		if(this.endAnimationStarted){
			return;
		}
		this.endAnimationStarted = true;
		clearInterval(this.mainInterval);
		until = !isNaN(until) && until > 0 && until <= this.steps ? until : 0;
		this.stepToStopForward = this.steps;
		this.currentStep = !isNaN(from) && from > 0 && from <= this.steps ? from : this.currentStep;

		if(this.currentStep < until){
			console.log("current step < until");
			this.forceReset = true;
			this._animateToEnd();
		}
		else{
			this._animateToStart();
		}

		
	};
	AnimatedJsonSprite.prototype._onSpriteReady = function(e){
		var tempSpriteIndex/*, tempy=0, horizontalSteps=0, totalWidth, missingPixels*/;
		this.json = JSON.parse(e.response);
		this.spritesData = [];
		//converting object to array
		for(var a in this.json.frames){
			tempSpriteIndex = Number(a.substr(-4));
			this.spritesData[tempSpriteIndex] = this.json.frames[a];
		}
		/*for(var i = 0; i<this.spritesData.length; i++){
			if(tempy!=this.spritesData[i].frame.y){
				break;
			}
			horizontalSteps++;
			tempy = this.spritesData[i].frame.y;

		}
		totalWidth = this.json.meta.size.w;
		missingPixels = totalWidth - (this.spritesData[0].sourceSize.w*horizontalSteps);
		//missingPercentage = ((totalWidth*100)/(this.spritesData[0].sourceSize.w*horizontalSteps))/horizontalSteps;
		missingPercentage = Math.ceil(((missingPixels*100)/totalWidth)*horizontalSteps);
		*/
		this.steps = this.spritesData.length-1;
		if(this.settings.loopEndStep===0 && this.settings.loop){
			this.settings.loopEndStep = this.steps;
		}
		//
		this.image = new Image();
		var _this = this;
		this.image.onload = function(){
			_this._onLoad();
		};
		this.image.src = this.spriteURL;
		if(this.image.complete){
			this._onLoad();
		}
		this.div.style.width = (this.spritesData[0].sourceSize.w*this.settings.scale)+"px";
		this.div.style.height = (this.spritesData[0].sourceSize.h*this.settings.scale)+"px";
		//this.div.style.backgroundSize = (((horizontalSteps*100)+missingPercentage)*1)+"%";
	};
	AnimatedJsonSprite.prototype._onLoad = function(){};

	AnimatedJsonSprite.prototype._animateToEnd = function(){
		var moveForwardBinded = this._moveForward.bind(this);
		this.mainInterval = setInterval(moveForwardBinded, this.settings.frameRate);
	};
	AnimatedJsonSprite.prototype._animateToStart = function(){
		var moveBackwardsBinded = this._moveBackwards.bind(this);
		this.mainInterval = setInterval(moveBackwardsBinded, this.settings.frameRate);
	};
	AnimatedJsonSprite.prototype.reset = function(to){
		//return
		to = to ? to : 0;
		this.currentStep = to;
		this.animationStarted = false;
		this.endAnimationStarted = false;
		//this.div.style.backgroundPosition="0 -"+((this.containerHeight*this.currentStep))+"px";
	};

	AnimatedJsonSprite.prototype._moveBackwards = function(){
		var position = {};
		position.x = this.spritesData[this.currentStep].frame.x*this.settings.scale;
		position.y = this.spritesData[this.currentStep].frame.y*this.settings.scale;
		this.div.style.backgroundPosition="-"+position.x+"px -"+position.y+"px";
		if(this.currentStep<=0 || this.currentStep>=this.stepToStopBackwards){
			clearInterval(this.mainInterval);
			this.reset(0);
		}
		this.currentStep--;
	};

	AnimatedJsonSprite.prototype._moveForward = function(){
		var position = {};
		position.x = this.spritesData[this.currentStep].frame.x*this.settings.scale;
		position.y = this.spritesData[this.currentStep].frame.y*this.settings.scale;
		this.div.style.backgroundPosition="-"+position.x+"px -"+position.y+"px";
		if(this.meantToStop && this.currentStep>=this.steps){
			clearInterval(this.mainInterval);
			this.meantToStop=false;
			this.currentStep = 0;
			if(this.restart){
				this.restart = false;
				this.reset(0);
			}
		}
		else if(this.currentStep>=this.stepToStopForward || (this.settings.loop && this.currentStep>=this.settings.loopEndStep) && !this.meantToStop){
			clearInterval(this.mainInterval);		
			if(this.settings.loop){
				this.reset(this.settings.loopStartStep);
				this.start();
			}
			else if(this.forceReset){
				this.forceReset = false;
				this.reset();
			}
		}
		this.currentStep++;
		
	};
	module.exports = AnimatedJsonSprite;

})();




 

},{}],3:[function(require,module,exports){
;(function(){
	"use strict";
	function AnimatedNumber(domElement){
		this.domElement = domElement;
	}
	AnimatedNumber.prototype.init = function(){
		this.originalNumberString = this.domElement.innerHTML;
		this.originalNumber = Number(this.domElement.innerHTML.replace("+", ""));
		this.start();
	};
	AnimatedNumber.prototype.intervalExec = function(){
		this.tempNumber++;
		this.domElement.innerHTML = this.tempNumber;
		if(this.tempNumber>this.originalNumber){
			this.domElement.innerHTML = this.originalNumberString;
			clearInterval(this.interval);
		}
	};
	AnimatedNumber.prototype.start = function(){
		this.tempNumber = 0;
		this.interval = setInterval(this.intervalExec.bind(this), 200);
		this.domElement.innerHTML = "0";
	};
	module.exports = AnimatedNumber;
})();
},{}],4:[function(require,module,exports){
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


},{"../lib/AnimatedNumber.js":3}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
"use strict";
/* global $*/
;(function(){
	var Home = {};
	var AnimatedJsonSprite = require("../lib/AnimatedJsonSprite.js");
	var body = $("html, body");

	function onScrollHomeDown(e){
		body.animate({scrollTop:$("#intro-container").height()}, "500", "swing");
	}

	

	Home.init = function(){
		$("#home-down-btn").on("click", onScrollHomeDown);
		Home.homeMe = new AnimatedJsonSprite("spritesheets/homes-normal.png", document.getElementById("me"), {loop:true, frameRate:40});
		Home.homeMe.start();
	};
	module.exports = Home;
})();
},{"../lib/AnimatedJsonSprite.js":2}],7:[function(require,module,exports){
(function( factory ) {
	if (typeof define !== 'undefined' && define.amd) {
		define([], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory();
	} else {
		window.scrollMonitor = factory();
	}
})(function() {

	var scrollTop = function() {
		return window.pageYOffset ||
			(document.documentElement && document.documentElement.scrollTop) ||
			document.body.scrollTop;
	};

	var exports = {};

	var watchers = [];

	var VISIBILITYCHANGE = 'visibilityChange';
	var ENTERVIEWPORT = 'enterViewport';
	var FULLYENTERVIEWPORT = 'fullyEnterViewport';
	var EXITVIEWPORT = 'exitViewport';
	var PARTIALLYEXITVIEWPORT = 'partiallyExitViewport';
	var LOCATIONCHANGE = 'locationChange';
	var STATECHANGE = 'stateChange';

	var eventTypes = [
		VISIBILITYCHANGE,
		ENTERVIEWPORT,
		FULLYENTERVIEWPORT,
		EXITVIEWPORT,
		PARTIALLYEXITVIEWPORT,
		LOCATIONCHANGE,
		STATECHANGE
	];

	var defaultOffsets = {top: 0, bottom: 0};

	var getViewportHeight = function() {
		return window.innerHeight || document.documentElement.clientHeight;
	};

	var getDocumentHeight = function() {
		// jQuery approach
		// whichever is greatest
		return Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.documentElement.clientHeight
		);
	};

	exports.viewportTop = null;
	exports.viewportBottom = null;
	exports.documentHeight = null;
	exports.viewportHeight = getViewportHeight();

	var previousDocumentHeight;
	var latestEvent;

	var calculateViewportI;
	function calculateViewport() {
		exports.viewportTop = scrollTop();
		exports.viewportBottom = exports.viewportTop + exports.viewportHeight;
		exports.documentHeight = getDocumentHeight();
		if (exports.documentHeight !== previousDocumentHeight) {
			calculateViewportI = watchers.length;
			while( calculateViewportI-- ) {
				watchers[calculateViewportI].recalculateLocation();
			}
			previousDocumentHeight = exports.documentHeight;
		}
	}

	function recalculateWatchLocationsAndTrigger() {
		exports.viewportHeight = getViewportHeight();
		calculateViewport();
		updateAndTriggerWatchers();
	}

	var recalculateAndTriggerTimer;
	function debouncedRecalcuateAndTrigger() {
		clearTimeout(recalculateAndTriggerTimer);
		recalculateAndTriggerTimer = setTimeout( recalculateWatchLocationsAndTrigger, 100 );
	}

	var updateAndTriggerWatchersI;
	function updateAndTriggerWatchers() {
		// update all watchers then trigger the events so one can rely on another being up to date.
		updateAndTriggerWatchersI = watchers.length;
		while( updateAndTriggerWatchersI-- ) {
			watchers[updateAndTriggerWatchersI].update();
		}

		updateAndTriggerWatchersI = watchers.length;
		while( updateAndTriggerWatchersI-- ) {
			watchers[updateAndTriggerWatchersI].triggerCallbacks();
		}

	}

	function ElementWatcher( watchItem, offsets ) {
		var self = this;

		this.watchItem = watchItem;

		if (!offsets) {
			this.offsets = defaultOffsets;
		} else if (offsets === +offsets) {
			this.offsets = {top: offsets, bottom: offsets};
		} else {
			this.offsets = {
				top: offsets.top || defaultOffsets.top,
				bottom: offsets.bottom || defaultOffsets.bottom
			};
		}

		this.callbacks = {}; // {callback: function, isOne: true }

		for (var i = 0, j = eventTypes.length; i < j; i++) {
			self.callbacks[eventTypes[i]] = [];
		}

		this.locked = false;

		var wasInViewport;
		var wasFullyInViewport;
		var wasAboveViewport;
		var wasBelowViewport;

		var listenerToTriggerListI;
		var listener;
		function triggerCallbackArray( listeners ) {
			if (listeners.length === 0) {
				return;
			}
			listenerToTriggerListI = listeners.length;
			while( listenerToTriggerListI-- ) {
				listener = listeners[listenerToTriggerListI];
				listener.callback.call( self, latestEvent );
				if (listener.isOne) {
					listeners.splice(listenerToTriggerListI, 1);
				}
			}
		}
		this.triggerCallbacks = function triggerCallbacks() {

			if (this.isInViewport && !wasInViewport) {
				triggerCallbackArray( this.callbacks[ENTERVIEWPORT] );
			}
			if (this.isFullyInViewport && !wasFullyInViewport) {
				triggerCallbackArray( this.callbacks[FULLYENTERVIEWPORT] );
			}


			if (this.isAboveViewport !== wasAboveViewport &&
				this.isBelowViewport !== wasBelowViewport) {

				triggerCallbackArray( this.callbacks[VISIBILITYCHANGE] );

				// if you skip completely past this element
				if (!wasFullyInViewport && !this.isFullyInViewport) {
					triggerCallbackArray( this.callbacks[FULLYENTERVIEWPORT] );
					triggerCallbackArray( this.callbacks[PARTIALLYEXITVIEWPORT] );
				}
				if (!wasInViewport && !this.isInViewport) {
					triggerCallbackArray( this.callbacks[ENTERVIEWPORT] );
					triggerCallbackArray( this.callbacks[EXITVIEWPORT] );
				}
			}

			if (!this.isFullyInViewport && wasFullyInViewport) {
				triggerCallbackArray( this.callbacks[PARTIALLYEXITVIEWPORT] );
			}
			if (!this.isInViewport && wasInViewport) {
				triggerCallbackArray( this.callbacks[EXITVIEWPORT] );
			}
			if (this.isInViewport !== wasInViewport) {
				triggerCallbackArray( this.callbacks[VISIBILITYCHANGE] );
			}
			switch( true ) {
				case wasInViewport !== this.isInViewport:
				case wasFullyInViewport !== this.isFullyInViewport:
				case wasAboveViewport !== this.isAboveViewport:
				case wasBelowViewport !== this.isBelowViewport:
					triggerCallbackArray( this.callbacks[STATECHANGE] );
			}

			wasInViewport = this.isInViewport;
			wasFullyInViewport = this.isFullyInViewport;
			wasAboveViewport = this.isAboveViewport;
			wasBelowViewport = this.isBelowViewport;

		};

		this.recalculateLocation = function() {
			if (this.locked) {
				return;
			}
			var previousTop = this.top;
			var previousBottom = this.bottom;
			if (this.watchItem.nodeName) { // a dom element
				var cachedDisplay = this.watchItem.style.display;
				if (cachedDisplay === 'none') {
					this.watchItem.style.display = '';
				}

				var boundingRect = this.watchItem.getBoundingClientRect();
				this.top = boundingRect.top + exports.viewportTop;
				this.bottom = boundingRect.bottom + exports.viewportTop;

				if (cachedDisplay === 'none') {
					this.watchItem.style.display = cachedDisplay;
				}

			} else if (this.watchItem === +this.watchItem) { // number
				if (this.watchItem > 0) {
					this.top = this.bottom = this.watchItem;
				} else {
					this.top = this.bottom = exports.documentHeight - this.watchItem;
				}

			} else { // an object with a top and bottom property
				this.top = this.watchItem.top;
				this.bottom = this.watchItem.bottom;
			}

			this.top -= this.offsets.top;
			this.bottom += this.offsets.bottom;
			this.height = this.bottom - this.top;

			if ( (previousTop !== undefined || previousBottom !== undefined) && (this.top !== previousTop || this.bottom !== previousBottom) ) {
				triggerCallbackArray( this.callbacks[LOCATIONCHANGE] );
			}
		};

		this.recalculateLocation();
		this.update();

		wasInViewport = this.isInViewport;
		wasFullyInViewport = this.isFullyInViewport;
		wasAboveViewport = this.isAboveViewport;
		wasBelowViewport = this.isBelowViewport;
	}

	ElementWatcher.prototype = {
		on: function( event, callback, isOne ) {

			// trigger the event if it applies to the element right now.
			switch( true ) {
				case event === VISIBILITYCHANGE && !this.isInViewport && this.isAboveViewport:
				case event === ENTERVIEWPORT && this.isInViewport:
				case event === FULLYENTERVIEWPORT && this.isFullyInViewport:
				case event === EXITVIEWPORT && this.isAboveViewport && !this.isInViewport:
				case event === PARTIALLYEXITVIEWPORT && this.isAboveViewport:
					callback.call( this, latestEvent );
					if (isOne) {
						return;
					}
			}

			if (this.callbacks[event]) {
				this.callbacks[event].push({callback: callback, isOne: isOne||false});
			} else {
				throw new Error('Tried to add a scroll monitor listener of type '+event+'. Your options are: '+eventTypes.join(', '));
			}
		},
		off: function( event, callback ) {
			if (this.callbacks[event]) {
				for (var i = 0, item; item = this.callbacks[event][i]; i++) {
					if (item.callback === callback) {
						this.callbacks[event].splice(i, 1);
						break;
					}
				}
			} else {
				throw new Error('Tried to remove a scroll monitor listener of type '+event+'. Your options are: '+eventTypes.join(', '));
			}
		},
		one: function( event, callback ) {
			this.on( event, callback, true);
		},
		recalculateSize: function() {
			this.height = this.watchItem.offsetHeight + this.offsets.top + this.offsets.bottom;
			this.bottom = this.top + this.height;
		},
		update: function() {
			this.isAboveViewport = this.top < exports.viewportTop;
			this.isBelowViewport = this.bottom > exports.viewportBottom;

			this.isInViewport = (this.top <= exports.viewportBottom && this.bottom >= exports.viewportTop);
			this.isFullyInViewport = (this.top >= exports.viewportTop && this.bottom <= exports.viewportBottom) ||
								 (this.isAboveViewport && this.isBelowViewport);

		},
		destroy: function() {
			var index = watchers.indexOf(this),
				self  = this;
			watchers.splice(index, 1);
			for (var i = 0, j = eventTypes.length; i < j; i++) {
				self.callbacks[eventTypes[i]].length = 0;
			}
		},
		// prevent recalculating the element location
		lock: function() {
			this.locked = true;
		},
		unlock: function() {
			this.locked = false;
		}
	};

	var eventHandlerFactory = function (type) {
		return function( callback, isOne ) {
			this.on.call(this, type, callback, isOne);
		};
	};

	for (var i = 0, j = eventTypes.length; i < j; i++) {
		var type =  eventTypes[i];
		ElementWatcher.prototype[type] = eventHandlerFactory(type);
	}

	try {
		calculateViewport();
	} catch (e) {
		try {
			window.$(calculateViewport);
		} catch (e) {
			throw new Error('If you must put scrollMonitor in the <head>, you must use jQuery.');
		}
	}

	function scrollMonitorListener(event) {
		latestEvent = event;
		calculateViewport();
		updateAndTriggerWatchers();
	}

	if (window.addEventListener) {
		window.addEventListener('scroll', scrollMonitorListener);
		window.addEventListener('resize', debouncedRecalcuateAndTrigger);
	} else {
		// Old IE support
		window.attachEvent('onscroll', scrollMonitorListener);
		window.attachEvent('onresize', debouncedRecalcuateAndTrigger);
	}

	exports.beget = exports.create = function( element, offsets ) {
		if (typeof element === 'string') {
			element = document.querySelector(element);
		} else if (element && element.length > 0) {
			element = element[0];
		}

		var watcher = new ElementWatcher( element, offsets );
		watchers.push(watcher);
		watcher.update();
		return watcher;
	};

	exports.update = function() {
		latestEvent = null;
		calculateViewport();
		updateAndTriggerWatchers();
	};
	exports.recalculateLocations = function() {
		exports.documentHeight = 0;
		exports.update();
	};

	return exports;
});

},{}]},{},[1]);
