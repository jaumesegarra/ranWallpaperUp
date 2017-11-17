'use strict';

var https = require("https");
var _ = require("lodash");
var jsdom = require("jsdom").JSDOM;

var URL = "https://www.wallpaperup.com/random/remote?anticache=";
var DOWNLOAD_URL = "https://www.wallpaperup.com/wallpaper/download/";
var DIV_WALLS = ".thumb-adv";
var ATTEMPS_NUMBER = 5;
var resolution = [1920, 1080];

function stringToDOM(str) {
	return new jsdom('<!DOCTYPE html>'+str).window.document;
}

function DOMtoWallpapersArray(dom) {
	var walls = [];
	_.forEach(dom, function (element) {
		var el_id = element.querySelector(".thumb").getAttribute("data-wid");
		var el_resolution = (element.querySelector("span[title='Resolution']").innerHTML+"").split("x");
		var el_urlthumb = ( element.querySelector(".thumb").getAttribute("src") || element.querySelector(".thumb").getAttribute("data-src"));

		walls.push({
			'id': el_id,
			'resolution': el_resolution,
			'thumb_url': el_urlthumb
		});
	});

	return walls;
}

function getRandom(wallpapersArray) {
	var wall = _.sample(wallpapersArray);
	var url = DOWNLOAD_URL+wall.id;

	if(wall.resolution[0] < resolution[0] && wall.resolution[1] < resolution[1]){
		url+= "/"+wall.resolution[0]+"/"+wall.resolution[1];
	}else {
		url+= "/"+resolution[0]+"/"+resolution[1];
	}

	wall.url = url;

	return wall;
}

var num_petitions = 0;
function loadPage(resolve, reject){	
	num_petitions++;

	var r = parseInt(Math.random()*10000000);
	var url = URL+r;

	https.get(url, function(response) {
		var data = '';

		response.on('data', function (chunk){
			data += chunk;
		});

		response.on('end',function(){
			var html = stringToDOM(data).querySelectorAll(DIV_WALLS);
			var walls = DOMtoWallpapersArray(html);
			var resolution_walls = _.filter(walls, function (o) {
				return (o.resolution[0] >= resolution[0]-500 && o.resolution[1] >= resolution[1]-500)
			});

			if(resolution_walls.length == 0 && num_petitions<=ATTEMPS_NUMBER)
				loadPage(resolve, reject);
			else
				resolve(getRandom(((resolution_walls.length > 0) ? resolution_walls : walls)));
			
		});
	}).on('error', (e) => {
		console.log(e);

		reject(null);
	});
}

module.exports = {
	random : function (x, y) {
		if(x != null && y != null)
			resolution = [x,y];

		return new Promise(loadPage);
	}
}