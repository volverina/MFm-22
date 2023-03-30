// 0. Підключення б-ки Three.js
import * as THREE from '../three/three.module.js';

// Our Javascript will go here.

// let scene = new THREE.Scene();
// var scene = new THREE.Scene();
// scene = new THREE.Scene();

// 1. Створення сцени
const scene = new THREE.Scene();

// 2. Створення перспективної камери
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// 3. Створення рендереру (полотно) з параметрами за замовчанням
const renderer = new THREE.WebGLRenderer({antialias: true});

// 4. Розтягування полотна до розміру вікна
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xeeeeee,1);

// 5. Додавання полотна до тіла документа
document.body.appendChild( renderer.domElement );

// 6. Створення кубічної геометрії
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// 7. Створення матеріалу із власним зеленим кольором
const material = new THREE.MeshBasicMaterial( { 
				color: 0x00ff00,
				transparent: true,
				opacity: 0.7,
				wireframe: false
				} );
// 8. Створення з кубічної геометрії та матеріалу із власним зеленим кольором 3D-об'єкту
const cube = new THREE.Mesh( geometry, material );

cube.rotation.y = 45*Math.PI/180;
cube.rotation.x = 15*Math.PI/180;

// 9. Додавання 3D-об'єкту (кубу) до сцени
scene.add( cube );


const geometryCapsule = new THREE.CapsuleGeometry( 0.5, 1, 4, 8 );
const materialCapsule = new THREE.MeshPhongMaterial( {color: 0xff0000} );
const capsule = new THREE.Mesh( geometryCapsule, materialCapsule );
scene.add( capsule );
capsule.position.set(-3, 0, -2);

var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightOne);

var lightTwo=new THREE.PointLight(0xffffff, 0.5);
scene.add(lightTwo);
lightTwo.position.set(-1.5, 0, -1);


const geometryTorus = new THREE.TorusGeometry( 3, 0.5, 16, 100 );
const materialTorus = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh( geometryTorus, materialTorus );
scene.add( torus );
torus.position.x=10;
torus.position.z=-15;

const light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light3 );


// 10. Відсунути на 5 м камеру від початку координат
camera.position.z = 3;
//camera.position.x = -5;
//camera.position.y = -2;

/*
	const animate = () => {

	}
*/

// 11. Створення функції animate
var phi = 0;

function animate() {
	//11.1 - запит, за можливості, знову викликати функцію animate
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	const x = 1.5*Math.cos(phi)+(-3);
	const z = 1.5*Math.sin(phi)+(-2);
	lightTwo.position.set(x, 0, z);

	torus.position.set(15*Math.cos(phi), 15*Math.sin(phi), -15);
	torus.rotation.y += phi/100;

	phi += Math.PI/180;

//	camera.rotation.y += phi/100;
	//11.2 - рендеринг сцени
	renderer.render( scene, camera );
}

// 12. Виклик функції animate
animate();


