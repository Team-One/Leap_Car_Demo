/**

SpinControls

Rotate object on mouse drag or touch swipe, mouse wheel zoom
Smoothing

TODO refactor - set doc size on resize

**/

/* global THREE, ATUtil */


SpinControls = function (  object, camera, domElement ) {

	//console.log(options);

	//API
	this.object  = object;//object to rotate

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.camera =  camera ;
	this.mouseDown = false;

	//internal
	var DOLLY_AMOUNT = 200;
	var rotateSpeed = 1.0;
	var scope = this;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();
	var startAngle = new THREE.Vector3();

	var EARTH_ROT_X_MAX = Math.PI;// * 0.285;

	var SMOOTHING = 0.1;
	var smoothedDX = 0;
	var smoothedDY = 0;

	this.update = function(){

		// Note: X mouse movement rotates earth on Y axis
		var deltaX = rotateDelta.x/window.innerHeight * Math.PI;
		var deltaY = rotateDelta.y/window.innerWidth * Math.PI;

		//add smoothing inertia
		smoothedDX += (deltaX  - smoothedDX) * SMOOTHING;
		smoothedDY += (deltaY  - smoothedDY) * SMOOTHING;

		//don't update rotation if intertia is very small
		//this allows auto rotate to work
		if (Math.abs(smoothedDY -   deltaY) < 0.0001){
			return;
		}

		//HORIZONTAL ROTATION
		object.rotation.y =  startAngle.y + (smoothedDX * rotateSpeed);
		object.rotation.y %= Math.PI*2;

		//VERTICAL ROTATION
		//clamp in range
		object.rotation.x = ATUtil.clamp(startAngle.x + (smoothedDY* rotateSpeed),-EARTH_ROT_X_MAX,EARTH_ROT_X_MAX);

	};

	this.onZoomIn = function() {

		//reduce rot speed
		//rotateSpeed = 0.15;
		rotateSpeed = 0.2;

		//allow more vertical freedom when zoomed in?
		//rotXMin = -Math.PI/3;
		//rotXMax = Math.PI/3;

	};

	this.onZoomOut = function(){

		rotateSpeed = 1.0;

		//vert rot
		//rotXMin = -Math.PI * .3;
		//rotXMax = Math.PI * .3;
	};

	function onDocumentMouseDown(event) {

		scope.mouseDown = true;
		event.preventDefault();

		//save initial angle
		smoothedDX = 0;
		smoothedDY = 0;
		rotateDelta.set(0,0);
		startAngle.copy(scope.object.rotation);
		rotateStart.set( event.clientX, event.clientY );
		rotateEnd.set( event.clientX, event.clientY );

	}

	function onDocumentMouseUp() {
		scope.mouseDown = false;
	}

	function onDocumentMouseOut(event) {

		//stop dragging when mouse dragged outside of browser
		//if (  event.toElement === null || event.toElement === document.getElementById('html') ){ //FIXME????
			scope.mouseDown = false;
		//}

	}

	function onDocumentMouseMove(event) {

		if (!scope.mouseDown) return;

		rotateEnd.set( event.clientX, event.clientY );
		rotateDelta.subVectors( rotateEnd, rotateStart );
		//scope.update();
	}

	//TOUCH
	function touchstart( event ) {

		switch ( event.touches.length ) {

			case 1:

				// one-fingered touch: rotate
				//save initial angle
				smoothedDX = 0;
				smoothedDY = 0;
				rotateDelta.set(0,0);
				startAngle.copy(scope.object.rotation);
				rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;
		}

	}

	function touchmove( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {
			case 1: // one-fingered touch: rotate
				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateDelta.subVectors( rotateEnd, rotateStart );
				//scope.update();
				break;
		}

	}

	function touchend( /* event */ ) {
	}


	//////////////////
	//Debug wheel zoom
	function onMouseWheel( event ) {

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta;
		} else if ( event.detail !== undefined ) { // Firefox
			delta = - event.detail;
		}

		if ( delta > 0 ) {
			scope.dollyOut();
		} else {
			scope.dollyIn();
		}
		//scope.update();
	}

	this.dollyIn = function(){
		this.camera.position.z += DOLLY_AMOUNT;
	};

	this.dollyOut = function(){
		this.camera.position.z -= DOLLY_AMOUNT;
	};

	//////////////////


	//init handlers

	this.onZoomOut();

	this.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
	this.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
	this.domElement.addEventListener('mouseup',   onDocumentMouseUp, false);
	this.domElement.addEventListener('mouseout', onDocumentMouseOut, false );


	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox


	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

};
