function loadSong(url, startDOM, stopDOM) {
		console.log(startDOM);
	    var context, soundSource, soundBuffer;

	    // Step 1 - Initialise the Audio Context
	    function init() {
	        if (typeof AudioContext !== "undefined") {
	            context = new AudioContext();
	        } else if (typeof webkitAudioContext !== "undefined") {
	            context = new webkitAudioContext();
	        } else {
	            throw new Error('AudioContext not supported. :(');
	        }
	    }

	    // Step 2: Load our Sound using XHR
	    function startSound() {
	        // Note: this loads asynchronously
	        var request = new XMLHttpRequest();
	        request.open("GET", url, true);
	        request.responseType = "arraybuffer";

	        // Our asynchronous callback
	        request.onload = function() {
	            var audioData = request.response;
	            audioGraph(audioData);
	        };

	        request.send();
	    }

	    // Finally: tell the source when to start
	    function playSound() {
	        // play the source now
	        soundSource.noteOn(context.currentTime);
	    }

	    function stopSound() {
	        // stop the source now
	        soundSource.noteOff(context.currentTime);
	    }

	    // Events for the play/stop bottons
	    document.querySelector(startDOM).addEventListener('click', startSound);
	    document.querySelector(stopDOM).addEventListener('click', stopSound);


	    // This is the code we are interested in:
	    function audioGraph(audioData) {
	        soundSource = context.createBufferSource();
	        soundBuffer = context.createBuffer(audioData, true);
	        soundSource.buffer = soundBuffer;

	        analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.3;
			analyser.fftSize = 1024;

	        volumeNode = context.createGainNode();

	        //Set the volume
	        volumeNode.gain.value = 1.0;

	        // Wiring
	        soundSource.connect(volumeNode);
	        volumeNode.connect(context.destination);

	        // Finally
	        playSound(soundSource);
	        soundSource.playbackRate.value = 1.0;
	    }


	    init();
}

loadSong('http://localhost:3000/addicted.mp3', '.play', '.stop');
loadSong('http://localhost:3000/lonely.mp3', '.play2', '.stop2');