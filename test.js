const r = require('./index.js');

function printConsoleSpace(space = 1){
	for (let i = 0; i < space; i++) console.log('');
}

console.log('.:Testing ranWallpaperUp...');

r.random().then(res => {
	printConsoleSpace();
	console.info('Randow wallpaper: ');
	console.log(res);
});

r.random(3840,2160).then(res => {
	printConsoleSpace();
	console.info('Randow wallpaper with especifically resolution: ');
	console.log(res);
});