const { addonBuilder } = require('stremio-addon-sdk');
const manifest = {
id: 'com.mycustom.scraper',
version: '1.0.0',
name: 'My First Custom Add-on',
description: 'A custom server built by me.',
catalogs: [],
resources: ['stream'],
types: ['movie', 'series'],
idPrefixes: ['tt']
};
const builder = new addonBuilder(manifest);
builder.defineStreamHandler((args) => {
if (args.id === 'tt1254207') {
return Promise.resolve({
streams: [
{
title: "My Custom Server is Working!",
url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
]
});
}
return Promise.resolve({ streams: [] });
});
const { getRouter } = require('stremio-addon-sdk');
module.exports = getRouter(builder.getInterface());
