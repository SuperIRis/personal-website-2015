"use strict";
/* global $*/

;(function(){
	var page = window.location.pathname.substr(1).replace(/.html/g, "");
	var Aboutme = require("./sections/aboutme.js");
	var Contact = require("./sections/contact.js");
	var Home = require("./sections/home.js");
	//var ScrollMonitor = require("./vendor/scrollMonitor.js");
	function onToggleMobileMenu(e){
		$(e.currentTarget).toggleClass("active");
		$("#main-container").toggleClass("mobile-menu-on");
		$("#main-footer").toggleClass("mobile-menu-on");
	}
	function onOpenPopup(e){
		e.preventDefault();
		var url, width=500, height=400, top, left;
		if($(e.currentTarget).attr("href")){
			url = $(e.currentTarget).attr("href");
		}
		if($(e.currentTarget).attr("data-popup")==="twitter"){
			width = 550;
			height=320;
		}
		top = ($(window).height()/2)-(height/2);
		left = ($(window).width()/2)-(width/2);
		window.open(url, $(e.currentTarget).attr("data-popup"), "width="+width+", height="+height+", left="+left+", top="+top);
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
	$("[data-popup]").on("click", onOpenPopup);

})();

