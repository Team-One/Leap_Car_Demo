/* global window, Stats, $, _ , ATUtil, document, TimelineLite , TweenMax, SplitText, Power0, Power2, requestAnimationFrame, scrollKeys */

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
	var $window;

	function init() {

		console.log('lolo');

		showDebug = window.location.href.indexOf('?dev')  > -1;

		if (showDebug){
			stats = new Stats();
			stats.domElement.style.position = 'fixed';
			stats.domElement.style.top = '0px';
			stats.domElement.style.left = '0px';
			$('body').append( stats.domElement );
		}

		isMobile = !!('ontouchstart' in window); //true for android or ios, false for MS surface
		$(window).resize(onResize);

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

		update();


	}

	function onResize(){


	}


	function update(){

		requestAnimationFrame( update );

		if (showDebug){
			stats.update();
		}

		doScrollAnims();

		//trace($window.scrollTop());
		//trace($('.scroll-anim').offset().top);


	}

	function doScrollAnims() {

		// var window_height = $window.height();
		// var window_top_position = $window.scrollTop();
		// var window_bottom_position = (window_top_position + window_height);

		// $.each($animElems, function() {
		// 	var $element = $(this);
		// 	var element_height = $element.outerHeight();
		// 	var element_top_position = $element.offset().top;
		// 	var element_bottom_position = (element_top_position + element_height);

		// 	//check to see if this current container is within viewport
		// 	if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {

		// 		$element.addClass('in-view');

		// 		//console.log('IN VIEW');
		// 	} else {

		// 		$element.removeClass('in-view');

		// 		//console.log('IN VIEW');

		// 	}
		// });

		var h = $window.height();

		scrollKeys.forEach(function(key, i) {

			//TODO - cache these?
			var elem = document.querySelector(key.selector);

			//pixels from bottom of VP
			var vptop = h - elem.getBoundingClientRect().top;

			// 0 = bottom of VP. 1 = top of VP.
			//max out relTop at 50% up the window
			var scrollTopFactor = 0.5;
			var relTop = _.clamp(vptop / (h * scrollTopFactor) , 0, 1);

			if (i === 0) trace(relTop);

			elem.style.translateX =  ATUtil.lerp(relTop, key.translateX[0], key.translateX[1] )+ 'px';

			elem.style.transform =  'translate(' + ATUtil.lerp(relTop, key.translateX[0], key.translateX[1] )+ 'px,0)';

			elem.style.opacity =  ATUtil.lerp(relTop, key.opacity[0], key.opacity[1] );

		});
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
