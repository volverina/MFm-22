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
		arToolkitSource.onResizeElement();
		arToolkitSource.copyElementSizeTo(renderer.domElement);
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)	
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

	let markerHiro = new THREE.Group();

	scene.add(markerHiro);

	let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerHiro, {
			type : 'pattern', patternUrl : "../assets/pattern-letterB.patt",
		});
	

	let markerKanji = new THREE.Group();

	scene.add(markerKanji);

	markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerKanji, {
			type : 'pattern', patternUrl : "../assets/pattern-kanji.patt",
		});
	

	// 6. Створення кубічної геометрії
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// 7. Створення матеріалу із власним зеленим кольором
	const material = [
		new THREE.MeshBasicMaterial( { //0
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //1
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //2
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //3
					color: 0xffffff,
					} ),
		new THREE.MeshBasicMaterial( { //4
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //5
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} )
	]

	const loader = new THREE.TextureLoader();

	const texture = loader.load( '../assets/petrykivka.png' );

	material[0].map = loader.load( '../assets/cube1.png' );
	material[1].map = loader.load( '../assets/cube2.png' );
	material[2].map = loader.load( '../assets/cube3.png' );
	//material[3].map = loader.load( '../assets/cube0.png' );
	material[4].map = loader.load( '../assets/cube4.png' );
	material[5].map = loader.load( '../assets/cube5.png' );

	// 8. Створення з кубічної геометрії та матеріалу із власним зеленим кольором 3D-об'єкту
	cube = new THREE.Mesh( geometry, material );

	cube.rotation.y = 45*Math.PI/180;
	cube.rotation.x = 15*Math.PI/180;

	// 9. Додавання 3D-об'єкту (кубу) до markerHiro
	markerHiro.add( cube );

	const geometryCapsule = new THREE.CapsuleGeometry( 0.5, 1, 4, 8 );
	const materialCapsule = new THREE.MeshPhongMaterial( {color: 0xff0000} );
	const capsule = new THREE.Mesh( geometryCapsule, materialCapsule );
	capsule.position.set(-0.3, 0, -0.2);
	markerHiro.add( capsule );


	const geometryTorus = new THREE.TorusGeometry( 3, 1.5, 16, 100 );
	const materialTorus = new THREE.MeshBasicMaterial();
	torus = new THREE.Mesh( geometryTorus, materialTorus );
	torus.scale.set(0.1,0.1,0.1);
	torus.rotation.x=Math.PI/2;
	torus.position.x=1.0;
	torus.position.z=-1.5;
	markerKanji.add(torus);

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


