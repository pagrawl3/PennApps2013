var a, b, song1, song2


function loadSong(url, startDOM, stopDOM, artist, title, callback, bpm, sp, final) {
		var song_bpm, start_point, offset, song_data;

		$.ajax({
			url		: 'http://developer.echonest.com/api/v4/song/search',
			data 	: {
				api_key : 'MYH0286UM2UX0WTYI',
				artist 	: artist,
				title 	: title,
				bucket	: 'audio_summary'
			},
			success	: function(data) {
				song_bpm = data.response.songs[0].audio_summary.tempo
				console.log(data);
				$.get(data.response.songs[0].audio_summary.analysis_url, function(data) {

					console.log(data);
					song_data = data;
					start_point = data.bars[0].start;
					if (callback) {
						song1 = [soundSource, data];
						var conf = 0;
						start_point = data.bars[3].start;
						a = start_point;
						// for (var i=1; i< 5; i++) {
						// 	if (data.bars[i].confidence > conf) {
						// 		conf = data.bars[i].confidence;
						// 		start_point = data.bars[i].start;
						// 	}
						// }
						console.log('start', start_point);
						callback(song_bpm, start_point);
					}
					if (bpm) {
						b = start_point;
						offset = data.bars[0].start;
					}

					if (final) {
						song2 = [soundSource, data];
						final();
					}
				});
			}
		})



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
	    	console.log(a, b)
	        // play the source now
	        // soundSource.noteOn(context.currentTime + 1);
	        if (!callback)
	        	soundSource.start(start_point, b);
	        else
	        	soundSource.start(0, a);
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

	        // Finally
	        playSound(soundSource);
	        soundSource.playbackRate.value = 1.0;
	        if (bpm) {
	        	soundSource.playbackRate.value = bpm/song_bpm;
	        	console.log(soundSource.playbackRate.value);
	        }
	    }


	    init();
	    console.log(soundSource, song_data);
}
	loadSong('http://localhost:3000/bruno.mp3', '.play', '.stop', 'Bruno Mars', 'Just the way you are', function(bpm, start_point){
		console.log('callback success');
		console.log(start_point);
		console.log(song1, song2);
		loadSong('http://localhost:3000/nelly.mp3', '.play', '.stop2', 'Nelly', 'Just a dream', null, bpm, start_point, function(){
	});

});