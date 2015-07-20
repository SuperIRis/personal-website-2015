"use strict";
/* global $*/
;(function(){
	var Home = {};
	var AnimatedJsonSprite = require("../lib/AnimatedJsonSprite.js");
	var PROJECTS = require("../../data/projects.js");
	var ScrollMonitor = require("../vendor/scrollMonitor.js");
	var body = $("html, body");
	var projectsWatcher;
	

	function onScrollHomeDown(e){
		body.animate({scrollTop:$("#intro-container").height()}, "500", "swing");
	}
	function parseProjects(){
		//find home projects
		var projects = PROJECTS.projects;
		Home.projects = [];
		for(var i =0; i<projects.length; i++){
			if(projects[i].images && projects[i].images.home){
				Home.projects.push(projects[i]);
			}
		}
		
	}
	function setProjects(){
		var jProjects = $("#projects-preview-list").find("li");
		var loadedProjects = 0;
		for(var i = 0; i<jProjects.length; i++){
			$(jProjects[i]).find(".project-title").html(Home.projects[i].name);
			$(jProjects[i]).find(".project-tech").html(Home.projects[i].tech);
			$("<img/>").attr("data-index", i).attr("src", "images/projects/"+Home.projects[i].images.home).load(function() {
				$(this).remove();
				$(jProjects[$(this).attr("data-index")]).find(".project-preview-item").css("background-image", "url('images/projects/"+Home.projects[$(this).attr("data-index")].images.home+"')");
				$(jProjects[$(this).attr("data-index")]).removeClass("loading");
				loadedProjects++;
				if(loadedProjects === jProjects.length){
					setScrollMonitor();
				}
			});
		}

	}
	function setScrollMonitor(){
		projectsWatcher = ScrollMonitor.create($("#projects-preview-list")[0], -10);
		projectsWatcher.enterViewport(function(){
			$("#projects-preview-list").removeClass("unshown");
		});
		projectsWatcher.exitViewport(function(){
			$("#projects-preview-list").addClass("unshown");
		});
	}

	

	Home.init = function(){
		$("#home-down-btn").on("click", onScrollHomeDown);
		Home.homeMe = new AnimatedJsonSprite("spritesheets/homes-normal.png", document.getElementById("me"), {loop:true, frameRate:40});
		Home.homeMe.start();
		parseProjects();
		setProjects();


	};
	module.exports = Home;
})();