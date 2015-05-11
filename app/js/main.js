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

