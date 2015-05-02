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