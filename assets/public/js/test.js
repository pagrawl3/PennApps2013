//GLOBALS
var songs = [],
	song_count = 2,
	ready = 0;


//FUNCTION DEFS
function createAudio(source, num, track) {
	var audio = new Audio();
	audio.src = source;
	audio.controls = true;
	audio.autoplay = false;
	document.body.appendChild(audio);

	var context = new webkitAudioContext();

	// Wait for window.onload to fire. See crbug.com/112368
	window.addEventListener('load', function(e) {
	  var source = context.createMediaElementSource(audio);
	  filterNode = context.createBiquadFilter();
	  // Specify this is a lowpass filter
	  filterNode.type = 0;
	  // Quieten sounds over 220Hz
	  filterNode.frequency.value = 220;
	  source.connect(filterNode);
	  // filterNode.connect(context.destination);
	  source.connect(context.destination);
	  songs[num] = {};
	  songs[num].source = source.mediaElement;
	}, false);

	fetchAJAX(track.artist, track.title, num);
}

function fetchAJAX(artist, title, num) {
	$.ajax({
		url		: 'http://developer.echonest.com/api/v4/song/search',
		data 	: {
			api_key : 'MYH0286UM2UX0WTYI',
			artist 	: artist,
			title 	: title,
			bucket	: 'audio_summary'
		},
		success	: function(data) {
			$.get(data.response.songs[0].audio_summary.analysis_url, function(details) {
				ready++;
				songs[num].details = details;
				songs[num].bpm = data.response.songs[0].audio_summary.tempo;
				if (ready === song_count) {
					final();
				}
			});
		}
	});
}

function final() {
	console.log(songs);
	// console.log(songs[1].source.playbackRate);
	songs[1].source.playbackRate = songs[0].bpm/songs[1].bpm;
	songs.forEach(function (song) {
		console.log(song.details.bars[0].start);
		song.source.currentTime = song.details.bars[0].start;
		song.source.play();
	});
}

//EXECS
createAudio('http://localhost:3000/bruno.mp3', 0, {
	artist: 'Bruno Mars',
	title: 'Just the way you are'
});

createAudio('http://localhost:3000/nelly.mp3', 1, {
	artist: 'Nelly',
	title: 'Just a dream'
});