/* global window, Stats, $, _ , ATUtil, document, TimelineLite , TweenMax,
SplitText, Power0, Power2, requestAnimationFrame, scrollKeys, scrollEvents */

/**
	Lexus Plus Layout Test 01
**/

//Global Config
// var LPConfig = {

// };

var LPMain = function() {

	var stats;
	var isMobile = false;
	var showDebug = false;
	var winH, winW;
	var $window;

	//focus
	var $focusImgs =[];
	var focusImgNames = ['01.jpg','30.jpg','60.jpg','70.jpg'];
	var numFocusImgs = focusImgNames.length;

	function init() {

		console.log('lolo');

		showDebug = window.location.href.indexOf('?dev')  > -1;

		if (showDebug){
			stats = new Stats();
			stats.domElement.style.position = 'fixed';
			stats.domElement.style.top = '0px';
			stats.domElement.style.left = '0px';
			$('body').append( stats.domElement );
			$('#debug').css('display','block');
		}

		isMobile = !!('ontouchstart' in window); //true for android or ios, false for MS surface

		//hero anim
		var tl = new TimelineLite();
		tl.to('.top-video', 1, {opacity:0.7,ease:Power0.easeNone});

		//line one
		//tl.to('#hero-line-1', 1, {opacity:1, ease:Power0.easeNone});
		TweenMax.set('.hero-line', {opacity:1});
		var split = new SplitText('#hero-line-1', {type:'words'});
    	var words = split.words; //an array of all the divs that wrap each character
		tl.staggerFrom(words, 1, {opacity:0,  ease:Power0.easeNone}, 0.15);

		//line 2
		//tl.to('#hero-line-2', 1, {opacity:1, ease:Power0.easeNone}, '+=0.3');
		split = new SplitText('#hero-line-2', {type:'words'});
    	words = split.words; //an array of all the divs that wrap each character
		tl.staggerFrom(words, 1, {opacity:0,  ease:Power0.easeNone}, 0.15);

		//line 3
		//tl.to('#hero-cross', 0.7, {opacity:1, rotation: 0, ease: Power2.easeInOut});
		tl.fromTo('#hero-cross', 0.8, {opacity:0, rotation: 90, scale:0.6 }, {opacity:1, rotation: 0, scale:1, ease: Power2.easeInOut});
		tl.to('#hero-logo-text', 0.7, {opacity:1, x: 0, ease: Power2.easeOut}, '-=0.4');

		//init scroll anim
		//$animElems = $('.scroll-anim');
		$window = $(window);

		$(window).resize(onResize);
		onResize();

		focusInit();

		update();

	}

	function onResize(){
		winH = $window.height();
		winW = $window.width();

		//'responsive design'

		//scale hero content to fit width

		var overW = Math.min(winW - 100, 1200);
		TweenMax.set('#hero-overlay', {scale: overW/1200});


	}

	function update(){

		requestAnimationFrame( update );

		if (showDebug){
			stats.update();
		}

		//doScrollKeys();

		doScrollEvents();

		focusUpdate();

	}

	function doScrollKeys() {

		scrollKeys.forEach(function(key, i) {

			//TODO - cache these?
			var elem = document.querySelector(key.selector);

			//pixels from botton of VP
			var vptop = winH - elem.getBoundingClientRect().top;

			// 0 = bottom of VP. 1 = top of VP.
			//max out relTop at 50% up the window
			var scrollTopFactor = 0.5;

			var relTop = _.clamp(vptop / (winH * scrollTopFactor) , 0, 1);

			if (i === 0) trace(relTop);

			//elem.style.translateX =  ATUtil.lerp(relTop, key.translateX[0], key.translateX[1] )+ 'px';
			elem.style.transform =  'translate(' + ATUtil.lerp(relTop, key.translateX[0], key.translateX[1] )+ 'px,0)';
			elem.style.opacity =  ATUtil.lerp(relTop, key.opacity[0], key.opacity[1] );


		});
	}

	function doScrollEvents() {

		scrollEvents.forEach(function(event) {

			if (!event.done) {

				var elem = document.querySelector(event.selector);
				//pixels from botton of VP
				var vptop = winH - elem.getBoundingClientRect().top;
				//percentage of VP height from bottom to trigger event
				var scrollTopFactor = 0.2;

				//var relTop = _.clamp(vptop / (winH * scrollTopFactor) , 0, 1);

				var inView = (vptop / (winH * scrollTopFactor)) >= 1;

				if (inView){

					//hit event trigger posn
					console.log('TRIGGER');
					event.done = true;
					event.func();
				}
			}

		});
	}



	function focusInit(){

		for (var i = 0; i < numFocusImgs; i++) {
			var $img = $('<img class="focus-img">');
			$img.attr('src', '../res/img/focus/' + focusImgNames[i]);
			$img.attr('id','img' + i);
			$('#module-2-img').append($img);
			//$img.css('top', i * 10 + 'px');
			//$img.css('left', i * 10 + 'px');
			$img.css('zindex', i );
			$focusImgs.push($img);
		}
	}

	function focusUpdate(){

		//fade between focus images based on focus image Y pos within VP
		var elem = document.querySelector('#module-2-img');

		//pixels from botton of VP
		var vptop = winH - elem.getBoundingClientRect().top;
		var imgH = elem.getBoundingClientRect().height;
		var imgId = _.clamp(ATUtil.map(vptop, imgH, winH, 1,numFocusImgs),1,numFocusImgs);
		var curImg = Math.floor(imgId);

		for (var i = 0; i < numFocusImgs; i++) {
			$focusImgs[i].css('display', imgId > i ? 'block' : 'none');
			if ( curImg === i){
				$focusImgs[i].css('opacity',imgId % 1  );
			}
		}
	}


	function trace(text){
		if (showDebug){
			$('#debug').text(text);
		}
	}


	return {
		init:init,
	};


}();

$(document).ready(function() {
	LPMain.init();
});
