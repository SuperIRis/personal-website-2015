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