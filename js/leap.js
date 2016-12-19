/* global THREE, Stats , Leap, ATUtil, dat, $ , scene , rig */

var stats;
//var controls;
// var worldHolder, spinnerHolder;
var $trace;
var handMesh;
var pointer;
var vel = new THREE.Vector3();
var dir = new THREE.Vector3();
var hRotSpeed = 0;
var yRotSpeed = 0;

var guiParams = {
	verticalTilt: true,
	showHandMesh: true,
	damping: 0.5
};


function initLeap() {

	//trace
	$trace = $('#trace');

	var gui = new dat.GUI();
	gui.domElement.style.zIndex = 2;
	gui.add(guiParams, 'verticalTilt', true);
	gui.add(guiParams, 'showHandMesh', true);
	gui.add(guiParams, 'damping', 0, 1,true);

	//add hand
	var handGeometry = new THREE.BoxGeometry( 10, 10, 10 );
	var handMaterial = new THREE.MeshBasicMaterial({
		blending:THREE.AdditiveBlending,
		//transparent:true,
		depthtest:true,
		wireframe: true,
		depthWrite:true,
		color: 0xFF0000
	});
	handMesh = new THREE.Mesh( handGeometry, handMaterial );
	scene.add( handMesh );
	handMesh.position.z = 300;
	handMesh.visible = false;

	//add pointer
	var dir = new THREE.Vector3( 1, 0, 0 );
	var origin = new THREE.Vector3( 0, 0, 0 );
	var length = 50;
	var hex = 0xff0000;
	pointer = new THREE.ArrowHelper( dir, origin, length, hex );
	handMesh.add( pointer );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );

	// window.addEventListener( 'resize', onWindowResize, false );

	// //INIT LEAP
	initLeap2();

	 animate();

}

function animate() {

	requestAnimationFrame( animate );

	//damping

	var damp = ATUtil.lerp(guiParams.damping,1, 0.9);
	hRotSpeed *= damp;

	//minimum rot speed
	var baselineRot = 0.007;

	//rotate rxScene rig
	rig.rotation.y += hRotSpeed + baselineRot;

	stats.update();
	//controls.update();

}

function onParamsChange(){

	//handMesh.visible = guiParams.showHandMesh;


}

function initLeap2(){

	console.log('LeapJS v' + Leap.version.full);

	var controller = new Leap.Controller({enableGestures:true});
	controller.connect();

	controller.loop(function(frame) {

		handMesh.visible = false;
		var scl;

		for ( var hand of frame.hands ) {

			//$trace.text(hand.palmPosition[0] + ', ' + hand.palmPosition[1] + ', ' + hand.palmPosition[2]);
			handMesh.position.fromArray(hand.palmPosition);

			handMesh.position.y -= 100;

			if (guiParams.showHandMesh){
				handMesh.visible = true;
			}

			//handMesh.position.multiplyScalar(0.2);

			//set rotation speed to x component of hand velocity
			vel.fromArray(hand.palmVelocity);
			scl = vel.length()*0.002 ;
			pointer.scale.set(scl,scl,scl);
			dir.copy(vel).normalize();
			pointer.setDirection(dir);
			hRotSpeed = vel.x*0.0002;


			// //move vertical postion based on hand pos y
			if (guiParams.verticalTilt){
				var vertPos = ATUtil.norm(hand.palmPosition[1],80,250);
				vertPos = ATUtil.clamp(vertPos,0,1);
				var rotAmt = Math.PI/4;
				rig.rotation.x = -(vertPos * rotAmt) + rotAmt;
			}

		}

	});

}
