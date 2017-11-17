# ranWallpaperUp

A node cli for get a random wallpaper from wallpaperup.com

## Install

```bash
npm install ranwallpaperup --save
```

## Usage

```js
const ranWallpaperUp = require('ranWallpaperUp')

var resolutionX = 1920; // optional
var resolutionY = 1080; // optional

ranWallpaperUp.random(resolutionX, resolutionY).then(wallpaper => {
	var id = wallpaper.id;
	var resolution = wallpaper.resolution;
	var thumb_url = wallpaper.thumb_url;
	var url = wallpaper.url;

	console.log(wallpaper);
});
```

