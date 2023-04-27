import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


window.addEventListener("DOMContentLoaded", async () => {

	const mindarThree = new MindARThree({
		container: document.body,
	});
 
	const {renderer, scene, camera} = mindarThree;

	var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(lightOne);

	const light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( light3 );

	const anchor = mindarThree.addAnchor(1);

	const loader = new THREE.TextureLoader();

	const geometry = new THREE.PlaneGeometry( 1, 1 );
	const material = new THREE.MeshBasicMaterial( {map: loader.load( '../assets/semerikov.png' )} );
	//const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
	const plane = new THREE.Mesh( geometry, material );
	//plane.position.x = -1.5;

	anchor.group.add(plane);

	const loaderGLTF = new GLTFLoader();

	const anchorHat = mindarThree.addAnchor(10);

	loaderGLTF.load( '../assets/police_hat.glb', function ( hat ) {
		anchorHat.group.add(hat.scene);
		console.log(hat);
		hat.scene.scale.set(0.75, 0.75, 0.75);
		hat.scene.rotation.set(0, -Math.PI/2, 0);
		hat.scene.position.y -= 0.2;
		hat.scene.position.z -= 0.2;

	}, function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded') ;
	}, function ( error ) {
		console.error( error );
	} );


	await mindarThree.start();

	renderer.setAnimationLoop(() => {
		renderer.render(scene, camera);
	});
});
