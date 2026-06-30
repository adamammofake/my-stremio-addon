const { addonBuilder, getRouter } = require('stremio-addon-sdk');
const manifest = {
id: 'com.mycustom.scraper',
version: '1.0.0',
name: 'My Dynamic Web Scraper',
description: 'A server that searches the web for actual links.',
catalogs: [],
resources: ['stream'],
types: ['movie'],
idPrefixes: ['tt']
};
const builder = new addonBuilder(manifest);
builder.defineStreamHandler(async (args) => {
// 1. Stremio tells the server what movie you clicked (e.g., 'tt1254207')
const imdbId = args.id;
try {
// 2. THE SCRAPER: We reach out to a public movie database API to find the link.
// To use SkyStream logic in the future, you would replace this URL with the
// website the SkyStream plugin is trying to scrape.
const response = await fetch(⁠[https://yts.mx/api/v2/list_movies.json?query_term=$](https://yts.mx/api/v2/list_movies.json?query_term=$){imdbId}⁠);
const data = await response.json();
// 3. We check if the website actually found a video link for that movie
if (data.data.movies && data.data.movies.length > 0) {
const movie = data.data.movies[0];
const torrent = movie.torrents[0]; // We grab the first available video quality
// 4. We send that scraped link straight to your iPad screen
return {
streams: [
{
title: ⁠Scraped from Web: ${torrent.quality}⁠,
infoHash: torrent.hash // Stremio uses 'infoHash' for torrents, or 'url' for direct mp4s
}
]
};
}
} catch (error) {
console.log("The scraper failed to connect to the website.");
}
// If the scraper couldn't find the movie, it sends back an empty list
return { streams: [] };
});
const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);
module.exports = function(req, res) {
router(req, res, function() {
res.statusCode = 404;
res.end();
});
};
