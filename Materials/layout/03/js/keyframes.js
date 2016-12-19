/* global Power2, TweenMax, Expo */

var scrollKeys = [

	// {
	// 	selector: '#module-1-text',
	// 	translateX: [100,0],
	// 	opacity: [0,1]
	// },

	// {
	// 	selector: '#module-1-img',
	// 	translateX: [-100,0],
	// 	opacity: [0,1]
	// },

	// {
	// 	selector: '#module-2-text',
	// 	translateX: [-100,0],
	// 	opacity: [0,1]
	// },

	// {
	// 	selector: '#module-2-img',
	// 	translateX: [100,0],
	// 	opacity: [0,1]
	// },

	// {
	// 	selector: '#module-3-text',
	// 	translateX: [100,0],
	// 	opacity: [0,1]
	// },

	// {
	// 	selector: '#module-3-img',
	// 	translateX: [-100,0],
	// 	opacity: [0,1]
	// },

];


var scrollEvents = [

	{
		selector: '#heading-top-1',
		func: function(){ TweenMax.fromTo('#heading-top-1',1.6,{width: '0%'},
			{width: '100%', ease: Expo.easeInOut, delay: 1});}
	},
	{
		selector: '#heading-top-2',
		func: function(){ TweenMax.fromTo('#heading-top-2',1.6,{width: '0%'},
			{width: '100%', ease: Expo.easeInOut, delay: 1});}
	},
	{
		selector: '#heading-top-3',
		func: function(){ TweenMax.fromTo('#heading-top-3',1.6,{width: '0%'},
			{width: '100%', ease: Expo.easeInOut, delay: 1});}
	},

	{
		selector: '#module-1-img',
		func: function(){ TweenMax.fromTo('#module-1-img',1.6,{opacity:0, y: 100},
			{opacity:1, y: 0, ease: Expo.easeOut});}
	},

	{
		selector: '#module-1 .main-image-frame',
		func: function(){ TweenMax.fromTo('#module-1 .main-image-frame',1.6,{opacity:0},
			{opacity:1, ease: Expo.easeOut});}
	},

	{
		selector: '#module-1-text',
		func: function(){ TweenMax.fromTo('#module-1-text',1.6,{opacity:0, y: 100},
			{opacity:1, y: 0, ease: Expo.easeOut, delay: 0.4});}
	},

	{
		selector: '#module-2-img',
		func: function(){ TweenMax.fromTo('#module-2-img',1.6,{opacity:0, y: 100},
			{opacity:1, y: 0, ease: Expo.easeOut});}
	},

	{
		selector: '#module-2 .main-image-frame',
		func: function(){ TweenMax.fromTo('#module-2 .main-image-frame',1.6,{opacity:0},
			{opacity:1, ease: Expo.easeOut});}
	},


	{
		selector: '#module-2-text',
		func: function(){ TweenMax.fromTo('#module-2-text',1.6,{opacity:0, y: 100},
			{opacity:1, y: 0, ease: Expo.easeOut,delay: 0.4});}
	},


	{
		selector: '#module-3-img',
		func: function(){ TweenMax.fromTo('#module-3-img',1.6,{opacity:0, y: 100},
			{opacity:1, y: 0, ease: Expo.easeOut});}
	},

	{
		selector: '#module-3 .main-image-frame',
		func: function(){ TweenMax.fromTo('#module-3 .main-image-frame',1.6,{opacity:0},
			{opacity:1, ease: Expo.easeOut});}
	},

	{
		selector: '#module-3-text',
		func: function(){ TweenMax.fromTo('#module-3-text',1.6,{opacity:0, y: 100},
			{opacity:1, y: 0, ease: Expo.easeOut,delay: 0.4});}
	},

	{
		selector: '#dealers-top',
		func: function(){ TweenMax.fromTo('#dealers-top',1.6,{opacity:0, y: 50},
			{opacity:1, y: 0, ease: Expo.easeOut});}
	},

	{
		selector: '#faq-header',
		func: function(){ TweenMax.fromTo('#faq-header',1.6,{opacity:0, y: 50},
			{opacity:1, y: 0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-1',
		func: function(){ TweenMax.fromTo('#dealer-1',1.6,{opacity:0, x: -100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-2',
		func: function(){ TweenMax.fromTo('#dealer-2',1.6,{opacity:0, x: 100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-3',
		func: function(){ TweenMax.fromTo('#dealer-3',1.6,{opacity:0, x: -100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-4',
		func: function(){ TweenMax.fromTo('#dealer-4',1.6,{opacity:0, x: 100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-5',
		func: function(){ TweenMax.fromTo('#dealer-5',1.6,{opacity:0, x: -100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-6',
		func: function(){ TweenMax.fromTo('#dealer-6',1.6,{opacity:0, x: 100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-7',
		func: function(){ TweenMax.fromTo('#dealer-7',1.6,{opacity:0, x: -100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-8',
		func: function(){ TweenMax.fromTo('#dealer-8',1.6,{opacity:0, x: 100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-9',
		func: function(){ TweenMax.fromTo('#dealer-9',1.6,{opacity:0, x: -100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	},

	{
		selector: '#dealer-10',
		func: function(){ TweenMax.fromTo('#dealer-10',1.6,{opacity:0, x: 100, y:50},
			{opacity:1, x: 0, y:0, ease: Expo.easeOut});}
	}

];


