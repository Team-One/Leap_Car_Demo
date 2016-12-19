/* global Power2, TweenMax, Expo */

var scrollKeys = [

	{
		selector: '#module-1-text',
		translateX: [300,0],
		translateY: [100,0],
		opacity: [0,1]
	},

	{
		selector: '#module-1-img',
		translateX: [-300,0],
		translateY: [100,0],
		opacity: [0,1]
	},

	{
		selector: '#module-1 .main-image-frame',
		translateX: [0,0],
		translateY: [0,0],
		opacity: [0,1]

	},

	{
		selector: '#module-2-text',
		translateX: [-300,0],
		translateY: [100,0],
		opacity: [0,1]
	},

	{
		selector: '#module-2-img',
		translateX: [300,0],
		translateY: [100,0],
		opacity: [0,1]
	},

	{
		selector: '#module-2 .main-image-frame',
		translateX: [0,0],
		translateY: [0,0],
		opacity: [0,1]
	},

	{
		selector: '#module-3-text',
		translateX: [300,0],
		translateY: [100,0],
		opacity: [0,1]
	},

	{
		selector: '#module-3-img',
		translateX: [-300,0],
		translateY: [100,0],
		opacity: [0,1]
	},

	{
		selector: '#module-3 .main-image-frame',
		translateX: [0,0],
		translateY: [0,0],
		opacity: [0,1]
	},


	{
		selector: '#dealer-1',
		translateX: [-100,0],
		translateY: [50,0],
		opacity: [0,1]
	},

	{
		selector: '#dealer-2',
		translateX: [100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-3',
		translateX: [-100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-4',
		translateX: [100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-5',
		translateX: [-100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-6',
		translateX: [100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-7',
		translateX: [-100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-8',
		translateX: [100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-9',
		translateX: [-100,0],
		translateY: [50,0],
		opacity: [0,1]
	},
	{
		selector: '#dealer-10',
		translateX: [100,0],
		translateY: [50,0],
		opacity: [0,1]
	},

];


var scrollEvents = [

	// {
	// 	selector: '#module-1-img',
	// 	func: function(){ TweenMax.fromTo('#module-1-img',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut});}
	// },

	// {
	// 	selector: '#module-1 .main-image-frame',
	// 	func: function(){ TweenMax.fromTo('#module-1 .main-image-frame',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut});}
	// },

	// {
	// 	selector: '#module-1-text',
	// 	func: function(){ TweenMax.fromTo('#module-1-text',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut, delay: 0.4});}
	// },

	//MODULE 2

	// {
	// 	selector: '#module-2-img',
	// 	func: function(){ TweenMax.fromTo('#module-2-img',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut});}
	// },

	// {
	// 	selector: '#module-2 .main-image-frame',
	// 	func: function(){ TweenMax.fromTo('#module-2 .main-image-frame',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut});}
	// },


	// {
	// 	selector: '#module-2-text',
	// 	func: function(){ TweenMax.fromTo('#module-2-text',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut,delay: 0.2});}
	// },

	{
		selector: '#heading-top-2',
		func: function(){ TweenMax.fromTo('#heading-top-2',1.6,{width: '0%'},
			{width: '100%', ease: Expo.easeInOut, delay: 0.4});}
	},

	//MODULE 3


	// {
	// 	selector: '#module-3-img',
	// 	func: function(){ TweenMax.fromTo('#module-3-img',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut});}
	// },

	// {
	// 	selector: '#module-3 .main-image-frame',
	// 	func: function(){ TweenMax.fromTo('#module-3 .main-image-frame',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut});}
	// },

	// {
	// 	selector: '#module-3-text',
	// 	func: function(){ TweenMax.fromTo('#module-3-text',1.6,{opacity:0},
	// 		{opacity:1, ease: Expo.easeOut,delay: 0.2});}
	// },

	{
		selector: '#heading-top-3',
		func: function(){ TweenMax.fromTo('#heading-top-3',1.6,{width: '0%'},
			{width: '100%', ease: Expo.easeInOut, delay: 0.4});}
	},


	//FAQ

	{
		selector: '#faq-header',
		func: function(){ TweenMax.fromTo('#faq-header',1.6,{opacity:0, y: 42},
			{opacity:1, ease: Expo.easeOut});}
	},

	//DEALERS

	{
		selector: '#dealers-top',
		func: function(){ TweenMax.fromTo('#dealers-top',1.6,{opacity:0, y: 50},
			{opacity:1, ease: Expo.easeOut});}
	},



];


