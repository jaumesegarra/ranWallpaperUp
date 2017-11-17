var r = require('./index.js');

r.random().then(function (res) {
	console.log(res);
});

r.random(3840,2160).then(function (res) {
	console.log(res);
});