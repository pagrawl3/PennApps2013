exports.index = function (req, res) {
	res.render('index');
}

exports.test = function (req, res) {
	res.render('test');
}

exports.echo = function (req, res) {
	res.render('echo');
}