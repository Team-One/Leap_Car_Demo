/* global window, Stats, $, _ , ATUtil, document, TimelineLite , TweenMax,
SplitText, Power0, Power2, requestAnimationFrame, scrollKeys, scrollEvents, Expo */

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
	var vidElem;

	var hasScrolled = false;

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

		//cache dom refs
		$window = $(window);
		vidElem = document.getElementById('video-player');

		$('#module-1-img').click(showVideoOverlay);
		$('#video-close-btn').click(hideVideoOverlay);

		$(window).resize(onResize);
		onResize();

		focusInit();
		faderInit();

		doIntroBuild();

		update();

		$('body').on('scroll mousewheel touchmove',showFirstModTop);

	}

	function showFirstModTop(){
		TweenMax.fromTo('#heading-top-1',1.6,{width: '0%'}, {width: '100%', ease: Expo.easeInOut});
		$('body').off('scroll mousewheel touchmove',showFirstModTop);
		hasScrolled = true;
	}


	function doIntroBuild(){

		//hero anim
		var tl = new TimelineLite();
		tl.to('.top-video', 1, {opacity:0.7,ease:Power0.easeNone});

		//line one
		TweenMax.set('.hero-line', {opacity:1});
		var split = new SplitText('#hero-line-1', {type:'words'});
		var words = split.words;
		tl.staggerFrom(words, 0.7, {opacity:0,  ease:Power0.easeNone}, 0.15);



		//line 3
		tl.fromTo('#hero-cross', 0.8, {opacity:0, rotation: 90, scale:0.6 }, {opacity:1, rotation: 0, scale:1, ease: Power2.easeInOut});
		tl.to('#hero-logo-text', 0.7, {opacity:1, x: 0, ease: Power2.easeOut,
				onComplete: function(){
					hasScrolled = true;
				}}, '-=0.4' );

		//module 1
		// tl.fromTo('#module-1 .main-image-frame',1.6,{opacity:0},{opacity:1, ease: Expo.easeOut});
		// tl.fromTo('#module-1-img',1.6,{opacity:0, y: 100},{opacity:1, y: 0, ease: Expo.easeOut}, '-=1');
		// tl.fromTo('#module-1-text',1.6,{opacity:0, y: 100},{opacity:1, y: 0, ease: Expo.easeOut}, '-=0.6');


	}

	function onResize(){
		winH = $window.height();
		winW = $window.width();

		//scale hero content to fit width


		var lineW = $('.hero-line').width();

		// if (winW > 960){
		// 	lineW = 1200;

		// }else{
		// 	lineW = 800;
		// }

		var overW = Math.min(winW - 100, lineW);
		TweenMax.set('#hero-overlay', {scale: overW/lineW});


		//TweenMax.set('.main-module', {scale: (winW - 100)/1300});



		//TweenMax.set('#container-outer', {scale: winW/1300});

	}

	function update(){

		//trace(hasScrolled);

		requestAnimationFrame( update );

		if (showDebug){
			stats.update();
		}

		//doScrollKeys();

		if (hasScrolled){

			doScrollEvents();

		}

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
			var $img = $('<img class="stack-img">');
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

	function faderInit(){
		//init module 3 slideshow / image fader
		faderInt = setInterval(fadeImg,3000);
		$('#module-3-img img:gt(0)').hide();
	}

	function fadeImg(){
		 $('#module-3-img :first-child').fadeOut(1200)
         .next('img').fadeIn(1200)
         .end().appendTo('#module-3-img');
	}

	function trace(text){
		if (showDebug){
			$('#debug').text(text);
		}
	}

	function showVideoOverlay(){

		console.log('pp');
		TweenMax.to('#video-overlay', 0.3,{autoAlpha:1});
		vidElem.currentTime = 0;
		vidElem.play();

		//$('body').addClass('stop-scrolling');

		$('body').on('scroll mousewheel touchmove',ignoreScroll);
	}

	function hideVideoOverlay(){
		vidElem.pause();
		TweenMax.to('#video-overlay', 0.3,{autoAlpha:0});

		//$('body').removeClass('stop-scrolling');

		$('body').off('scroll mousewheel touchmove',ignoreScroll);
	}

	function ignoreScroll(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	return {
		init:init,
	};


}();

$(document).ready(function() {
	LPMain.init();
});
