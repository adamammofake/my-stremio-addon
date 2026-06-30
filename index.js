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
    const imdbId = args.id; 

    try {
        const response = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`);
        const data = await response.json();

        if (data.data.movies && data.data.movies.length > 0) {
            const movie = data.data.movies[0];
            const torrent = movie.torrents[0]; 

            return {
                streams: [
                    {
                        title: `Scraped from Web: ${torrent.quality}`,
                        infoHash: torrent.hash 
                    }
                ]
            };
        }
    } catch (error) {
        console.log("The scraper failed to connect to the website.");
    }
    
    return { streams: [] };
});

const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);

module.exports = function(req, res) {
    // THE FIX: We intercept the main URL to stop the HTML crash
    if (req.url === '/' || req.url === '') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Your server is running perfectly! Add /manifest.json to this exact URL and paste it into Stremio.');
        return;
    }

    router(req, res, function() {
        res.statusCode = 404;
        res.end();
    });
};
