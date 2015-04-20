"use strict";
/* global $*/
;(function(){
	var AnimatedJsonSprite = require("./lib/AnimatedJsonSprite.js");
	var body = $("html, body");
	var homeMe = new AnimatedJsonSprite("spritesheets/homes-normal.png", document.getElementById("me"), {loop:true, frameRate:40});
	function onToggleMobileMenu(e){
		$(e.currentTarget).toggleClass("active");
		$("#main-container").toggleClass("mobile-menu-on");
	}
	function onScrollHomeDown(e){
		body.animate({scrollTop:$("#intro-container").height()}, "500", "swing");
	}
	//
	$("#mobile-menu").on("click", onToggleMobileMenu);
	$("#home-down-btn").on("click", onScrollHomeDown);
	
	homeMe.start();


})();