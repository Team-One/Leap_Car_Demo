

var root = this
var configData = null
var mouseX = 0;
var mouseY = 0;
var touchOffsetX = 0;
var touchOffsetY = 0;
var orbitSpeed = 0.1;
var container, scene, renderer, composer, camera, light, clock, loader;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

var frame = 0
var globalRX = 0
var globalRY = 0
var globalRXOffset = 0
var globalRYOffset = 0
var wf_bool = false
var rig = new THREE.Object3D();
var carRig = new THREE.Object3D();
var gui
var isDragging = false
var startX = 0;
var cameraDistZ = 700
var cameraDistY = 40
var cameraDistX = 0

var allMaterialsList = []
var allPaintMaterialsList = []
var currentPaintColor = "0xe6e6e6"

var cylinder
var boxFloor
var skyMaterials
var textureCube
var ambient
var pointLight


var composer

var showGUI = false
var defaultScene = 'white room'


var totalLoad
var loadCount = 0
var verticalCameraSway = 0


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD CONFIG
//////////////////////////////////////////////////////////////////////////////////////////////////////////
this.loadConfig = function(_url){
  $.getJSON(_url,
      {
        type:"json"
      },
      function(data) {
        root.loadConfigDone(data);
      }
   );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD CONFIG DONE
//////////////////////////////////////////////////////////////////////////////////////////////////////////
this.loadConfigDone = function(data){
  configData = data;
  setupScene()
  buildApp()
  totalLoad = configData.modelParts.length + configData.wheels.length
  loadModelData(configData.modelParts)
  loadWheelData(configData.wheels)

  swapTextures('black room');

  initLeap();

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILD APP
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function buildApp(){
  this.displayOutline = false;
  this.sceneSelect = defaultScene
  if(inIframe() == true){
    cameraDistZ = 700
    $("#ui-layer").css("display", "none")
    swapTextures('blank')
  }else{
    // currentPaintColor = "0xe6e6e6"
    if(showGUI == true){
      gui = new dat.GUI();
      gui.add(this, 'orbitSpeed', -1, 1);
      var controller =  gui.add(this, 'sceneSelect', [ 'white room', 'black room', 'city', 'desert', 'snow', 'warehouse'  ] );
      controller.onChange(function(value) {
        swapTextures(value)
      });
    }

    swapTextures(defaultScene)
  }


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP SCENE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setupScene(){
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;
  VIEW_ANGLE = 35,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 1,
  FAR = 3000;
  scene = new THREE.Scene();
  container = document.querySelector('.viewport');
  carRig.position.z = 250
  carRig.position.y = 10

  renderer = new THREE.WebGLRenderer({antialias: true, color:0xffffff});
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(WIDTH, HEIGHT);

  container.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  onWindowResize()
  camera.position.set(cameraDistX, cameraDistY, cameraDistZ);
  scene.add(camera);
  ambient = new THREE.AmbientLight( 0xeeeeee);
  scene.add(ambient);
  // pointLight = new THREE.SpotLight( 0xcceeff, 1 );
  // rig.add( pointLight );



  var r = "img/scenes/";
  var urls = [ r + "reflection.jpg", r + "reflection.jpg", r + "roof.jpg", r + "roof.jpg", r + "reflection.jpg", r + "reflection.jpg" ];
  textureCube = THREE.ImageUtils.loadTextureCube( urls );
  textureCube.format = THREE.RGBFormat;

  // loadCompleteCount = 10
  scene.add(rig);
  rig.add(carRig);
  render();
  $("#webgl-scene").mousemove(movingHandler)
  $("#webgl-scene").mousedown(startDrag)
  $("#webgl-scene").mouseup(endDrag)
  $(window).bind("touchstart", touchStart)
  $(window).bind("touchmove", touchScrollHandler)
  window.addEventListener( 'resize', onWindowResize, false );
  $(document).keydown(this.keyHandler)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RENDER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render() {

  frame += orbitSpeed/200

  var tRX = globalRX+ frame
  var tRY = globalRY
  //rig.rotation.y -= (rig.rotation.y-tRX)*.2
  rig.rotation.x -= (rig.rotation.x-tRY)*.2

  var yOffset =  (100-Math.cos(rig.rotation.y)*100)*verticalCameraSway
  camera.position.set(cameraDistX, cameraDistY+(yOffset), cameraDistZ+(tRY*100));
  var targetPos = rig.position
  targetPos.y = -100
  camera.lookAt(scene.position)
  // camera.rotation.x = de2ra(-5)
  renderer.render(scene, camera);
  // composer.render()
  requestAnimationFrame(render);
}











////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ON PROGRESS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var onProgress = function ( xhr ) {
  if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    //console.log( Math.round(percentComplete, 2) + '% downloaded' );
  }
};

var onError = function ( xhr ) {};
var loaderNEW = new THREE.OBJMTLLoader();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD MODEL DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadModelData(modelData){
  for(var i = 0; i<modelData.length; i++){
      var thisObj = modelData[i]
      setLoadItem(thisObj)
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD WHEEL DATA
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadWheelData(wheelData){
  for(var e = 1; e<5; e++){
    for(var i = 0; i<wheelData.length; i++){
      var thisObj = wheelData[i]
      var params = [e]
      setLoadItem(thisObj, loadWheelDone, params)
    }
  }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SET LOAD ITEM
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setLoadItem(thisObj, onComplete, onCompleteParams){

  loaderNEW.load( thisObj.obj, thisObj.mtl, function ( object ) {
    object.position.y =  -80;
    // TweenMax.to(object.position, 1.1, {y:-80, ease:Expo.easeInOut})
    treatMaterials(object, thisObj)
    if(onComplete){
      if(onCompleteParams){
        if(onComplete == loadWheelDone){
          onCompleteParams.push(object)
        }
        onComplete(onCompleteParams)
      }else{
        onComplete()
      }
    }
    carRig.add( object );
    checkLoadAllDone();
  }, onProgress, onError );
}


function checkLoadAllDone(){
  loadCount += 1;
  if(loadCount < totalLoad){

  }else{
    for(var i=0; i<allMaterialsList.length; i++){
      allMaterialsList[i].wireframe = false;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TREAT MATERIALS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function treatMaterials(object, thisObj){
   object.traverse( function ( child ) {
    if(child.material){
      child.material = new THREE.MeshPhongMaterial()
       if(thisObj.flip){
            child.geometry.applyMatrix(new THREE.Matrix4().makeScale( -1, 1, 1 ) );
            child.material.side = THREE.BackSide
            child.material.flipSide = true
      }else{
          child.material.side = 2
      }

      if(thisObj.smoothing == "true"){
        var modifier = new THREE.SubdivisionModifier(0.5);
        modifier.modify( child.geometry );
      }

      child.material.ambient.setHex("0x000000")
      child.material.color.setHex("0x000000")
      if(thisObj.color){
        child.material.color.setHex(thisObj.color)
      }
      if(thisObj.ambient){
        if( thisObj.ambient == "paint"){
            child.material.ambient.setHex(currentPaintColor)
            child.material.shininess = 300
            child.material.metal = true
            thisObj.reflectivity = .2
            allPaintMaterialsList.push(child.material)
        }else{
          if( thisObj.ambient == "chrome"){
              child.material.ambient.setHex("0x666666")
              thisObj.reflectivity = .5
          }else{
            child.material.ambient.setHex(thisObj.ambient)
          }

        }
      }
      if(thisObj.reflectivity){
        child.material.envMap = textureCube
        child.material.reflectivity = thisObj.reflectivity
        child.material.combine = THREE.MixOperation
        child.material.shininess = 30
      }

      // child.material.metal = true
      child.material.wireframe = true

      if(thisObj.opacity){
        child.material.opacity = thisObj.opacity
        child.material.transparent = true
      }

      if(thisObj.shininess){
        child.material.shininess = thisObj.shininess
      }

      if(thisObj.normalMap){
        child.material.normalMap = THREE.ImageUtils.loadTexture(thisObj.normalMap);
      }

      allMaterialsList.push(child.material)
    }
  });
}







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SWAP TEXTURES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function swapTextures(value){
  var paintColor
  var textureMaps
  var fogColor
  var ambientColor
  var directionalColor
  var textColor = "#ffffff"
  scene.fog = null
   if(value == "blank"){
      paintColor = currentPaintColor
      ambientColor = 0xFFFFFF
      directionalColor = 0xFFFFFF
      textureMaps = ['img/scenes/blank/wall.jpg', 'img/scenes/blank/wall2.jpg', 'img/scenes/blank/floor.jpg', "img/scenes/blank/reflection.jpg"]
      textColor = "#000000"
      // scene.fog = new THREE.Fog( fogColor, 1000, 2500 );
  }

   if(value == "white room"){
      paintColor = "0xececec"
      fogColor = 0x999999
      ambientColor = 0xeeeeee
      directionalColor = 0xFFFFFF
      textureMaps = ['img/scenes/white_room/wall.jpg', 'img/scenes/white_room/wall2.jpg', 'img/scenes/white_room/floor.jpg', "img/scenes/white_room/reflection.jpg"]
      textColor = "#000000"
      // scene.fog = new THREE.Fog( fogColor, 1000, 2500 );
  }
  if(value == "black room"){
      paintColor = "0x010101"
      fogColor = 0x000000
      ambientColor = 0xececec
      directionalColor = 0xececec
      textureMaps = ['img/scenes/black_room/wall.jpg', 'img/scenes/black_room/wall2.jpg', 'img/scenes/black_room/floor.jpg', "img/scenes/black_room/reflection.jpg"]
      // scene.fog = new THREE.Fog( fogColor, 1000, 2500 );
  }
  if(value == "city"){
       paintColor = "0x000000"
      fogColor = 0x1b4859
      ambientColor = 0xffffff
      directionalColor = 0x1b4859
      scene.fog = new THREE.Fog( fogColor, 1000, 4500 );
      textureMaps = ['img/scenes/city/wall.jpg', 'img/scenes/city/wall2.jpg', 'img/scenes/city/floor.jpg', "img/scenes/city/reflection.jpg", "img/scenes/city/floor_nrm.jpg"]
  }
  if(value == "desert"){
      paintColor = "0x000000"
      fogColor = 0x110011
      ambientColor = 0xffffff
      directionalColor = 0x1b4859
      // scene.fog = new THREE.Fog( fogColor, 200, 3500 );
      textureMaps = ['img/scenes/desert/wall.jpg', 'img/scenes/desert/wall2.jpg', 'img/scenes/desert/floor.jpg', "img/scenes/desert/reflection.jpg", "img/scenes/desert/floor_nrm.jpg"]
  }
  if(value == "snow"){
      paintColor = "0xe6eaf4"
      fogColor = 0xffffff
      ambientColor = 0xFFFFFF
      directionalColor = 0x405040
       // scene.fog = new THREE.Fog( fogColor, -1000, 3500 );
      textureMaps = ['img/scenes/snow/wall.jpg', 'img/scenes/snow/wall2.jpg', 'img/scenes/snow/floor.jpg', "img/scenes/snow/reflection.jpg", "img/scenes/snow/floor_nrm.jpg"]
  }
  if(value == "warehouse"){
      paintColor = "0xefefef"
      fogColor = 0xFFFFFF
      ambientColor = 0xFFFFFF
      directionalColor = 0xFFFFFF
      textureMaps = ['img/scenes/warehouse/wall.jpg', 'img/scenes/warehouse/wall2.jpg', 'img/scenes/warehouse/floor.jpg', "img/scenes/warehouse/reflection.jpg"]
      // scene.fog = new THREE.Fog( fogColor, 1000, 2500 );
  }



  $("#tag-line").css("color", textColor)


  try{
      rig.remove(boxFloor)
  }catch(e){

  }

  var floorTexture =   new THREE.MeshPhongMaterial({
          map: THREE.ImageUtils.loadTexture(textureMaps[2]),
          side: THREE.DoubleSide,
          color: "0xffffff"
     })

  floorTexture.shininess = 0
  if(textureMaps[4]){
       floorTexture.normalMap = THREE.ImageUtils.loadTexture(textureMaps[4]);
       floorTexture.normalScale = 1
       // floorTexture.shininess = 0
  }

  boxFloor =  new THREE.Mesh( new THREE.PlaneGeometry( 3000, 3000, 100, 100 ), floorTexture );
  boxFloor.rotation.x = this.de2ra(90);
  boxFloor.position.y = 0;
  rig.add(boxFloor)



  try{
     rig.remove(cylinder)
  }catch(e){

  }

  var geometry = new THREE.CylinderGeometry( 1500, 1500, 1000, 32 );
  var material = new THREE.MeshLambertMaterial( {
    map: THREE.ImageUtils.loadTexture(textureMaps[0]),
    side: THREE.BackSide
  } );
  cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.y = 499;
  rig.add( cylinder );



  var urls = [ textureMaps[3], textureMaps[3], textureMaps[3], textureMaps[3], textureMaps[3], textureMaps[3]];
  textureCube = THREE.ImageUtils.loadTextureCube( urls );

  for(var i=0; i<allMaterialsList.length; i++){
    var thisMat = allMaterialsList[i]
    thisMat.envMap = textureCube
  }


  setPaintColor(paintColor)


  scene.remove(ambient)
  ambient = new THREE.AmbientLight( ambientColor);
  scene.add(ambient)

  try{
     scene.remove(pointLight)
  }catch(e){

  }

  pointLight = new THREE.SpotLight( directionalColor , 6);

  pointLight.position.set(0, 2500, 200);

  pointLight.exponent = 100
  // pointLight.target.set(500, 0, 0)
  // pointLight.castShadow = true
  scene.add(pointLight)

}



function setPaintColor(paintColor){
  for(var i=0; i<allPaintMaterialsList.length; i++){
    var thisMat = allPaintMaterialsList[i]
    thisMat.ambient.setHex(paintColor)
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ON WINDOW RESIZE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function gotoChapter(index) {
   var R = 0
   var Z = 600
   switch (index){
    case 1:
      R = de2ra(10)
      Z = 700
      break;
    case 2:
      R = de2ra(10)

      Z = 400
      break;
    case 3:
      R = de2ra(30)
      Z = 500
      break;
    case 4:
      R = de2ra(60)
      Z = 300
      break;
    case 5:
      R = de2ra(90)
      Z = 500
      break;

    }

    // var rounded = Math.floor(globalRX/(Math.PI*2))
    // var actual = globalRX/(Math.PI*2)
    // var remainder = actual-rounded
    // globalRX  = remainder
    // render()
    // rig.rotation.y = globalRX
    // console.log(rounded, actual, remainder)

    TweenMax.to(this, .7, {globalRY:R,  cameraDistZ: Z, ease:Sine.easeInOut})
    globalRXOffset = 0
    // globalRYOffset = 0
    // orbitSpeed = 0
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD WHEEL DONE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadWheelDone(params) {
  var wheelNum = params[0]
  var geometry = params[1]
   switch (wheelNum){
    case 1:
      break;
    case 2:
        geometry.rotation.y = 3.14
        geometry.position.z = -200
      break;
    case 3:
        geometry.position.z = -280
      break;
    case 4:
        geometry.rotation.y = 3.14
        geometry.position.z = -480
      break;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ON WINDOW RESIZE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function onWindowResize() {
  var S = 1
  var maxW = 2600
  var maxH = 2000
  var W = $("#main").width()
  var H = $("#main").height()
  var targetW = W
  var targetH = H
  var ratioW = targetW/maxW
  var ratioH = targetH/maxH

  var ratio =  ratioW
  if(ratioH > ratioW){
    ratio = ratioH
  }
  S = Math.max(1, ratio)

  var maxW = W/S
  var maxH = H/S
  camera.aspect = maxW / maxH;
  camera.updateProjectionMatrix();
  TweenMax.to($("#webgl-scene canvas"), 0, {scale: S})
  renderer.setSize( maxW, maxH );
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MOVING HANDLER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function movingHandler(event){
    if(isDragging == true){
      var MX = (($(window).width()/2)-event.pageX)-touchOffsetX
      var MY = (($(window).height())-(event.pageY)-150)-touchOffsetY
      mouseX -= (mouseX-(MX*2))*1
      mouseY -= (mouseY-(MY))*1

      globalRY = globalRYOffset-(mouseY/500)
      globalRX = globalRXOffset-(mouseX/500)
      globalRY = Math.min(1.2, Math.max(0, globalRY))
    }

}
function startDrag(event){
    isDragging = true
    touchOffsetX = ($(window).width()/2)-event.pageX
    touchOffsetY = ($(window).height())-(event.pageY)-150
    globalRXOffset = globalRX
    globalRYOffset = globalRY
}
function endDrag(event){
   isDragging = false
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TOUCH SCROLL HANDLER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function touchScrollHandler(e){
    var touch = e.originalEvent.touches[0];
    var MX = (touch.pageX-touchOffsetX)
    var MY = (touch.pageY-touchOffsetY)
    mouseX -= (mouseX-(MX))*1
    mouseY -= (mouseY-(MY))*1
    globalRY = globalRYOffset+(mouseY/300)
    globalRX = globalRXOffset+(mouseX/300)
    globalRY = Math.min(1.2, Math.max(0, globalRY))
    e.preventDefault()
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TOUCH START
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function touchStart(e){
    var touch = e.originalEvent.touches[0];
    touchOffsetX = touch.pageX
    touchOffsetY = touch.pageY
    globalRXOffset = globalRX
    globalRYOffset = globalRY
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// KEY HANDLER
//////////////////////////////////////////////////////////////////////////////////////////////////////////
this.keyHandler = function(e){
    // alert(e.keyCode)
    switch(e.keyCode) {
      case 49:
        swapTextures('white room')
        break;
      case 50:
        swapTextures('black room')
        break;
      case 51:
        swapTextures('city')
        break;
      case 52:
        swapTextures('desert')
        break;
      case 53:
        swapTextures('snow')
        break;
      case 54:
        swapTextures('warehouse')
        break;
      case 87:
        toggleWireframe()
        break;

    }
}


function toggleWireframe(){
  if(wf_bool == true){
    wf_bool = false
  }else{
    wf_bool = true
  }
  for(var i=0; i<allMaterialsList.length; i++){
    allMaterialsList[i].wireframe = wf_bool;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

this.de2ra = function(degree){
  return degree*(Math.PI/180);
}

this.ra2de = function(radian){
  return radian/(Math.PI/180)
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START!
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





function initRX( ){

	cameraDistY:'-80';
	orbitSpeed:'0.2';
	globalRX = globalRXOffset = rig.rotation.y = de2ra(-90);

  loadConfig('json/site-data.json');

}

initRX();


