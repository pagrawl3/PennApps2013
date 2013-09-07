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
			analyser.smoothingTimeConstant = 0.9;
			analyser.fftSize = 512;

	        volumeNode = context.createGainNode();

	        //Set the volume
	        volumeNode.gain.value = 1.0;

	        // Wiring
	        soundSource.connect(volumeNode);
	        volumeNode.connect(context.destination);
	        soundSource.connect(analyser);

	        var avg = 0,
	        	count = 0,
	        	hits = 0,
	        	count_limit=1100,
	        	hit_limit=180,
	        	prev_count=0,
	        	check = false,
	        	chromeTime = window.performance.now(),
	        	bpm=0,
	        	num_thres = 0;

	        FFTData = new Uint8Array(analyser.frequencyBinCount);
	        setInterval(function(){
	        	count=window.performance.now() - chromeTime;
				analyser.getByteFrequencyData(FFTData);
				// analyser.getByteTimeDomainData(FFTData);
				// avg = getAvg(FFTData);
				avg = (FFTData[0]+FFTData[1])/2
				if (avg > hit_limit && (count - prev_count > count_limit)) {
					// console.log(count - prev_count);
					num_thres++;
					if (num_thres > 10) {
						prev_count = count;
						hits++;
						// console.log(hits, count);
						// $('.visualizer').css('width', avg);
						bpm = hits*60000/(count)
						console.log(bpm);
					}
					else {
						chromeTime = window.performance.now();
					}
				}
			},1);

	        // Finally
	        playSound(soundSource);
	        soundSource.playbackRate.value = 1.0;
	    }

	    function getAvg(arr) {
	    	var sum = 0,
	    		n = 8;
	    	for (var i=0; i < n; i++) {
	    		sum += arr[i];
	    	}
	    	return sum/n;
	    }


	    init();
}

loadSong('http://localhost:3000/addicted.mp3', '.play', '.stop');
loadSong('http://localhost:3000/lonely.mp3', '.play2', '.stop2');

function danceBitch() {
	console.log ('loaded');
	var dancer = new Dancer();

	// Using an audio object
	var a = new Audio();
	a.src = 'http://localhost:3000/lonely.mp3';
	dancer.load(a);

	document.querySelector('.play').addEventListener('click', function(){dancer.play()});
	document.querySelector('.stop').addEventListener('click', function(){dancer.pause()});

	var data = 0;
	var count = 0;
	setInterval(function(){
		if (dancer.isPlaying()) {
			dancer.source.playbackRate.value = 5.0
			count++
	        // data = (data*(count-1) + dancer.getFrequency(0,100))/count;
	        data += dancer.getFrequency(0,50);
	        // console.log(data/count, count);
	        console.log(dancer.context)
	    }
	},100);
}


// danceBitch();