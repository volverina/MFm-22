var scene, camera, renderer;
var arToolkitSource, arToolkitContext;

document.addEventListener("DOMContentLoaded", initialize);

function initialize()
{
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});

	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////


	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
		sourceWidth: 1280,
		sourceHeight: 720,
		// resolution displayed for the source
		displayWidth: 1280,
		displayHeight: 720
	});

	function onResize()
	{
		arToolkitSource.onResize();
		arToolkitSource.copySizeTo(renderer.domElement);
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(onResize);
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize();
	});
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: '../assets/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(() => {
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	let loader = new THREE.TextureLoader();
	let texture = loader.load( '../assets/i_image.png' );
		
	let patternArray = ["letterA", "letterB", "letterC", "letterD", "letterF", "letterG", "hiro", "kanji"];
	let colorArray   = [0xff0000, 0xff8800, 0xffff00, 0x00cc00, 0x0000ff, 0xffffff, 0xcc00ff, 0xcccccc];
	for (let i = 0; i < patternArray.length; i++)
	{
		let markerRoot = new THREE.Group();
		scene.add(markerRoot);
		let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern', patternUrl : "../assets/pattern-" + patternArray[i] + ".patt",
		});
	
		let mesh = new THREE.Mesh( 
			new THREE.BoxGeometry(1,1,1), 
			new THREE.MeshBasicMaterial({color:colorArray[i], map:texture, transparent:true, opacity:0.5}) 
		);
		mesh.position.y = 1/2;
		markerRoot.add( mesh );
	}

	animate();
}


function animate()
{
	requestAnimationFrame(animate);
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
	renderer.render( scene, camera );
}


