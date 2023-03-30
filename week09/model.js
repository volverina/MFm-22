// 0. Підключення б-ки Three.js
import * as THREE from '../three/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// 1. Створення сцени
const scene = new THREE.Scene();

// 2. Створення перспективної камери
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// 3. Створення рендереру (полотно) з параметрами за замовчанням
const renderer = new THREE.WebGLRenderer({antialias: true});

// 4. Розтягування полотна до розміру вікна
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff,1);

// 5. Додавання полотна до тіла документа
document.body.appendChild( renderer.domElement );


var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightOne);

var lightTwo=new THREE.PointLight(0xffffff, 0.5);
scene.add(lightTwo);
lightTwo.position.set(-1.5, 0, -1);

const light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light3 );

camera.position.z = 3;

const loader = new GLTFLoader();

loader.load( '../assets/free_merc_hovercar.glb', function ( car ) {
	scene.add( car.scene );
//	car.scale.set(3, 3, 3);
//	car.rotation.set(0, -Math.PI/2, 0);

}, function ( xhr ) {
	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) {
	console.error( error );
} );

// 11. Створення функції animate

function animate() {
	//11.1 - запит, за можливості, знову викликати функцію animate
	requestAnimationFrame( animate );
	//11.2 - рендеринг сцени
	renderer.render( scene, camera );
}

// 12. Виклик функції animate
animate();


