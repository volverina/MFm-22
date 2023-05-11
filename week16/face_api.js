import * as THREE from 'three';
import * as faceapi from "face-api";
import { MindARThree } from 'mindar-face-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


window.addEventListener("DOMContentLoaded", async () => {

	const mindarThree = new MindARThree({
		container: document.body,
	});
 
	const {renderer, scene, camera} = mindarThree;


	const loader = new THREE.TextureLoader();

	const textures = {};

    	const expressions = [
		"neutral",
		"happy",
		"sad",
		"angry",
		"fearful",
		"disgusted",
		"surprised"
	];


	let lastExpression = "neutral", newExpression = "neutral";

        textures["neutral"] = loader.load( '../assets/neutral-face_1f610.png');
        textures["happy"] = loader.load( '../assets/hugging-face_1f917.png');
        textures["sad"] = loader.load( '../assets/sad-but-relieved-face_1f625.png');
        textures["angry"] = loader.load( '../assets/angry-face_1f620.png');
        textures["fearful"] = loader.load( '../assets/face-screaming-in-fear_1f631.png');
        textures["disgusted"] = loader.load( '../assets/nauseated-face_1f922.png');
        textures["surprised"] = loader.load( '../assets/hushed-face_1f62f.png');

	const anchor = mindarThree.addAnchor(1);

	const geometry = new THREE.PlaneGeometry( 0.5, 0.5 );
	const material = new THREE.MeshBasicMaterial( {map: textures[lastExpression], transparent: true} );
	const plane = new THREE.Mesh( geometry, material );
	plane.position.y = 0.75;

	anchor.group.add(plane);

	const modelPath="../assets/model";
	const optionsTinyFace = new faceapi.TinyFaceDetectorOptions({inputSize: 128, scoreThreshold: 0.3});
	await faceapi.nets.tinyFaceDetector.load(modelPath);
	await faceapi.nets.faceLandmark68Net.load(modelPath);
	await faceapi.nets.faceExpressionNet.load(modelPath);
	await faceapi.nets.ageGenderNet.load(modelPath);

        let label = document.getElementById("age");


	await mindarThree.start();

	renderer.setAnimationLoop(() => {
		renderer.render(scene, camera);
	});

//	const field = document.querySelector ( 'video' );
//	field.style.display="none";

//	console.log("video = ",field);
	const video = mindarThree.video;
	//console.log(video);


	const detect = async() => {
		//console.log(video);
		if(video !== undefined)
		{
			const detection = await faceapi.detectSingleFace(video, optionsTinyFace).withFaceExpressions().withAgeAndGender();
			if(detection && detection.expressions && detection.age && detection.gender && detection.genderProbability)
			{
				for(let i=0;i<expressions.length;i++)
					if(detection.expressions[expressions[i]]>0.5)
						newExpression = expressions[i];
				if(newExpression !== lastExpression)
				{
					material.map = textures[newExpression];
					material.needsUpdate = true;
					lastExpression = newExpression;
				}
				//console.log(detection);
				const age = Math.round(detection.age);
				let gender = (detection.gender === "male") ? "чоловіча" : "жіноча";
			
				label.innerHTML = "Вік: " + age + ", стать: " + gender + " з імовірністю " + detection.genderProbability;
			}

			//const expressionFace =  detection.withFaceExpressions();
			//const ageFace =  await detection.withAgeAndGender();
			//console.log(expressionFace);
			//console.log(ageFace);
		}
		window.requestAnimationFrame(detect);
	}

	window.requestAnimationFrame(detect);

});
