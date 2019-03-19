'use strict';

const request = require('request');
const _ = require("lodash");
const jsdom = require("jsdom").JSDOM;

const URL = "http://www.wallpaperup.com/random/remote?anticache=";
const DOWNLOAD_URL = "https://www.wallpaperup.com/wallpaper/download/";
const DIV_WALLS = ".thumb-adv";
const ATTEMPS_NUMBER = 5;

let resolution = [1920, 1080];

function stringToDOM(str) {
	return new jsdom('<!DOCTYPE html>'+str).window.document;
}

function DOMtoWallpapersArray(dom) {
	let walls = [];
	_.forEach(dom, function (element) {
		const thumbElement = element.querySelector(".thumb");
		const resolutionSpan = element.querySelector("span[title='Resolution']");

		let id = thumbElement.getAttribute("data-wid");
		let resolution = (resolutionSpan.innerHTML+"").split("x");
		let thumbUrl = (thumbElement.getAttribute("src") || thumbElement.getAttribute("data-src"));

		walls.push({
			'id': id,
			'resolution': resolution,
			'thumbUrl': thumbUrl
		});
	});

	return walls;
}

function getRandom(wallpapersArray) {
	let wall = _.sample(wallpapersArray);

	let url = DOWNLOAD_URL+wall.id;
	url+= "/"+resolution[0]+"/"+resolution[1];

	wall.url = url;

	return wall;
}

function loadPage(resolve, reject, petitionNumber = 1){	

	const ANTICACHE_NUMBER = parseInt(Math.random()*10000000);

	request(URL+ANTICACHE_NUMBER, function (error, response, body) {

		const HTML = stringToDOM(body).querySelectorAll(DIV_WALLS);
		const WALLS = DOMtoWallpapersArray(HTML);

		const RESOLUTION_WALLS = _.filter(WALLS, w => {
			return (w.resolution[0] >= resolution[0] && w.resolution[1] >= resolution[1])
		});

		if(RESOLUTION_WALLS.length == 0 && petitionNumber < ATTEMPS_NUMBER)
			loadPage(resolve, reject, petitionNumber+1);
		else
			resolve(getRandom(((RESOLUTION_WALLS.length > 0) ? RESOLUTION_WALLS : WALLS)));

	});
}

module.exports = {
	random : function (x, y) {
		if(x != null && y != null)
			resolution = [x,y];

		return new Promise(loadPage);
	}
}