const fs = require('fs')
const { parse } = require('rss-to-json')
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const RSS_TO_CONVERT = [
    {
        name: 'Cronaca',
        url: 'https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml'
    },
    {
        name: 'Politica',
        url: 'https://www.ansa.it/sito/notizie/politica/politica_rss.xml'
    },
    {
        name: 'Economia',
        url: 'https://www.ansa.it/sito/notizie/economia/economia_rss.xml'
    },
    {
        name: 'Sport',
        url: 'https://www.ansa.it/sito/notizie/sport/sport_rss.xml'
    },
    {
        name: 'Cultura',
        url: 'https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml'
    },
    {
        name: 'Abruzzo',
        url: 'https://www.ansa.it/abruzzo/notizie/abruzzo_rss.xml'
    }
]

const getArticleBodyFromUrl = async (body) => {
    const $ = cheerio.load(body);
    return $('.news-txt').text()
}

const getImageSrc = async (body) => {
    const $ = cheerio.load(body);
    return `https://www.ansa.it${$('.img-photo > img')[0].attribs.src}`
}

const main = async () => {
    for (content of RSS_TO_CONVERT) {
        const rss = await parse(content.url)
        for (let i = 0; i < rss.items.length ; i++){
            const response = await fetch(rss.items[i].link);
            const body = await response.text();
            rss.items[i]['text'] = await getArticleBodyFromUrl(body)
            rss.items[i]['media'] = await getImageSrc(body)
        }
        const fd = fs.openSync(`json/${content.name}.json`, "w+");
        fs.writeSync(fd, JSON.stringify(rss, null, 4))
    }
}

main()