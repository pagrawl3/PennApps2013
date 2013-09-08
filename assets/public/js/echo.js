var api_key = 'MYH0286UM2UX0WTYI';

    // These are the things you need:  an API key, the track ID, and the path to the track
    var apiKey = 'MYH0286UM2UX0WTYI';
    var trackID_1 = 'TRTREAX140207A75DD';
    var trackURL_1 = 'http://localhost:3000/lonely.mp3';
    var trackID_2 = 'TRVQSFJ140F7FD27A1';
    var trackURL_2 = 'http://localhost:3000/nelly.mp3'

    // Set up the key variables
    var remixer;
    var player;
    var track;
    var remixed, remixed2;

// The main function.
function init() {

    // Make sure the browser supports Web Audio.
    if (window.webkitAudioContext === undefined) {
        error("Sorry, this app needs advanced web audio. Your browser doesn't"
            + " support it. Try the latest version of Chrome");
    } else {
        
        // These set up the WebAudio playback environment, and create the remixer and player.
        var context = new webkitAudioContext();
        remixer = createJRemixer(context, $, apiKey);
        player = remixer.getPlayer();
        $("#info").text("Loading analysis data...");

        // The key line.  This prepares the track for remixing:  it gets
        // data from the Echo Nest analyze API and connects it with the audio file.
        // All the remixing takes place in the callback function.
        remixer.remixTrackById(trackID_1, trackURL_1, function(t1, percent1) {
            track = t1;
            remixer.remixTrackById(trackID_2, trackURL_2, function(t2, percent2) {
            	track2 = t2;
            	var meter = parseInt(track.analysis.track.time_signature);
				var numberOfBeats = Math.min(track.analysis.beats.length, track2.analysis.beats.length);
            	if (track.status == 'ok' && track2.status == 'ok') {
            		remixed = new Array();
            		remixed2 = new Array();
            		console.log(track);
            		track.analysis.sections[0].duration *= 5;
            		remixed2.push(track.analysis.sections[0]);
            		console.log(remixed2);
            		for (var index=0; index<track2.analysis.bars.length/4; index++) {
            			remixed.push(track2.analysis.bars[0]);
            			remixed.push(track2.analysis.bars[1]);
            			remixed.push(track2.analysis.bars[2]);
            			remixed.push(track2.analysis.bars[3]);
            		}
            	}
            });
        });

        function sameBeat(b1, b2) {
        	if (Math.abs(b1.duration - b2.duration) < 0.10) {
        		console.log(b1.duration - b2.duration)
        		return true;
        	}
        	else
        		return false;
        }

        $(window).on('load', function () {
        	console.log('loaded');
        });
    }

    $('.play_btn').on('click', function(e) {
    	player.play(0, remixed);
    	player.play(0, remixed2);
	});
}

// Run the main function once the page is loaded.
window.onload = init;