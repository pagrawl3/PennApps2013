//GLOBALS
var songs = [],
	song_count = 2,
	ready = 0,
	context = new webkitAudioContext();

function createAudio(source, num, track) {
    // Note: this loads asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", source, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function() {
    	soundSource = context.createBufferSource();
    	soundBuffer = context.createBuffer(request.response, true);
    	soundSource.buffer = soundBuffer;

        var source = soundSource;
		songs[num] = {};
		songs[num].source = source;
		fetchAJAX(track.artist, track.title, num);
    };

    request.send();
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
	var back = 0,
		front = 1,
		faster, slower;
	if (getAverage(songs[0].details.segments, 50, 'loudness_max') > getAverage(songs[1].details.segments, 50, 'loudness_max')) {
		back = 1;
		front = 0;
	}

	if (songs[front].bpm > songs[back].bpm) {
		faster = front;
		slower = back;
	} else {
		faster = back;
		slower = front;
	}
	// adjust playback rate
	songs[slower].source.playbackRate.value = songs[faster].bpm/songs[slower].bpm;

	var gainNode_back 	= context.createGainNode(),
		gainNode_front 	= context.createGainNode(),
		delayNode_back 	= context.createDelay(),
		delayNode_front	= context.createDelay();

	// gainNode_back.gain.linearRampToValueAtTime(1, 0);
	// gainNode_back.gain.linearRampToValueAtTime(1, songs[front].details.sections[1].start - 1);
	// gainNode_back.gain.linearRampToValueAtTime(0.5, songs[front].details.sections[1].start);
	// gainNode_back.gain.linearRampToValueAtTime(0.5, songs[front].details.sections[2].start - 5);
	// gainNode_back.gain.linearRampToValueAtTime(1.5, songs[front].details.sections[2].start - 4);
	// songs[back].source.connect(gainNode_back);
	// gainNode_back.connect(delayNode_back);
	// delayNode_back.connect(context.destination);
	

	gainNode_front.gain.linearRampToValueAtTime(0.5, 0);
	gainNode_front.gain.linearRampToValueAtTime(0.5, songs[front].details.sections[1].start - 1);
	gainNode_front.gain.linearRampToValueAtTime(1, songs[front].details.sections[1].start);
	gainNode_front.gain.linearRampToValueAtTime(1, songs[front].details.sections[2].start + 6);
	gainNode_front.gain.linearRampToValueAtTime(0.2, songs[front].details.sections[2].start + 6.5);
	songs[front].source.connect(gainNode_front);
	// gainNode_front.connect(delayNode_front);
	// delayNode_front.connect(context.destination);

	// delayNode_back.delayTime.value = 5.5;
	// delayNode_front.delayTime.value = 5.5;

	// songs[back].source.loop = true;
	// songs[back].source.loopStart = songs[back].details.bars[0].start;
	// songs[back].source.loopEnd = songs[back].details.bars[5].start;
	console.log(songs[back].details.segments[0].pitches[0]);
	var pc = 0
	songs[back].details.segments.slice(1,100).forEach(function (p) {
		pc ++
		// console.log(pc, p.loudness_start, p.start, p)
	});
	// window.setTimeout(function () {
	// 	// songs[back].source.loop = false;
	// 	console.log('here');		// songs[back].source.stop();
	// 	songs[back].source.start(0, 100);
	// }, 5000);//songs[front].details.sections[2].start * 1000 - 8000)
	// // songs[1].source.connect(context.destination);
	var counter = 0,
		segs = songs[back].details.segments,
		segs_len = segs.length,
		prevLoud=0,
		currLoud,
		times = [],
		temp = [];

	segs.forEach(function (g) {
		temp.push(g);
	});

	temp.slice(0,segs_len/4).sort(function (a, b) {
		return (a.loudness_max+100) - (b.loudness_max+100);
	}).reverse().slice(0,2).forEach(function (c) {
		console.log('Amplitude: ', c.loudness_max + 100, ' Time: ', c.start);
		times.push(c.start);
	});

	temp.slice(segs_len/4, segs_len/2).sort(function (a, b) {
		return (a.loudness_max+100) - (b.loudness_max+100);
	}).reverse().slice(0,2).forEach(function (c) {
		console.log('Amplitude: ', c.loudness_max + 100, ' Time: ', c.start);
		times.push(c.start);
	});

	temp.slice(segs_len/2, 3*segs_len/4).sort(function (a, b) {
		return (a.loudness_max+100) - (b.loudness_max+100);
	}).reverse().slice(0,2).forEach(function (c) {
		console.log('Amplitude: ', c.loudness_max + 100, ' Time: ', c.start);
		times.push(c.start);
	});

	temp.slice(3*segs_len/4, segs_len).sort(function (a, b) {
		return (a.loudness_max+100) - (b.loudness_max+100);
	}).reverse().slice(0,2).forEach(function (c) {
		console.log('Amplitude: ', c.loudness_max + 100, ' Time: ', c.start);
		times.push(c.start);
	});

	for (var ic=0 ; ic < 8; ic++) {
		gainNode_back.gain.linearRampToValueAtTime(0.5, times[ic] - 16);
		gainNode_back.gain.linearRampToValueAtTime(1.5, times[ic] - 15);
		gainNode_back.gain.linearRampToValueAtTime(1.5, times[ic] + 15);
		gainNode_back.gain.linearRampToValueAtTime(0.5, times[ic] + 16);
	}
	songs[back].source.connect(gainNode_back);
	gainNode_back.connect(delayNode_back);
	delayNode_back.connect(context.destination);

	// temp.sort(function (a, b) {
	// 	return (a.loudness_max+100) - (b.loudness_max+100);
	// });
	// // temp.slice(0,5);
	// temp.reverse().slice(0,10).forEach(function (y) {
	// 	console.log(y.loudness_max + 100, y.start)
	// });
	// set required offsets and start playing
	songs.forEach(function (song, ind) {
		// console.log(ind, getAverage(song.details.segments, 50, 'loudness_max'));
		song.source.start(0, song.details.bars[0].start);
	});
}

function sum(arr) {
	var t = 0;
	arr.forEach(function (e) {
		t+=e
	});
	return t
}

function getAverage(arr, num, opt) {
	var total = 0;
	for (var i=0; i<=num; i++) {
		if (opt)
			total += arr[i][opt];
		else
			total += arr[i];
	}

	return total/num;
}

//EXECS
createAudio('http://localhost:3000/nelly.mp3', 0, {
	artist: 'Nelly',
	title: 'Just a dream'
});

createAudio('http://localhost:3000/adele.mp3', 1, {
	artist: 'Adele',
	title: 'Rolling in the Deep'
});