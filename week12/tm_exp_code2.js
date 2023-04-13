    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image


    let model, webcam, labelContainer, detector;

    init();

    // Load the image model and setup the webcam
    async function init() {

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();

	const model = handPoseDetection.SupportedModels.MediaPipeHands;
	const detectorConfig = {
	  runtime: 'mediapipe', // or 'tfjs',
	  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
	  modelType: 'lite'//'full'
	}
	detector = await handPoseDetection.createDetector(model, detectorConfig);

        window.requestAnimationFrame(loop);
        // append elements to the DOM

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
    }

    let frameCount = 0;
    const skipCount = 5;

    async function loop() {
        webcam.update(); // update the webcam frame
	if(frameCount % skipCount == 0)
	{
		const hands = await detector.estimateHands(webcam.canvas);
		//console.log(hands);
		//labelContainer.innerHTML = "Бачу " + hands.length + " рук";
		if(hands.length == 0)
			labelContainer.innerHTML = "";

		if(hands.length == 1)
		{
			if(hands[0].handedness == "Right")
				labelContainer.innerHTML = "Піднято праву руку<br>";
			else
				labelContainer.innerHTML = "Піднято ліву руку<br>";
			for(let k=0;k<hands[0].keypoints.length;k++)
				labelContainer.innerHTML += hands[0].keypoints[k].name + " (" + hands[0].keypoints[k].x +
					", " + hands[0].keypoints[k].y + ")<br>";
		}

		/*
		// predict can take in an image, video or canvas html element
		const prediction = await model.predict(webcam.canvas);
		for (let i = 0; i < maxPredictions; i++) {
		    const classPrediction =
		        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
		    labelContainer.childNodes[i].innerHTML = classPrediction;
		}
		*/
	}
        window.requestAnimationFrame(loop);
	frameCount++;
    }


