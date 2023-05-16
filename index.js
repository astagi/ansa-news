const fs = require('fs')
const { parse } = require('rss-to-json')
const fetch = require('node-fetch');
const cheerio = require('cheerio');
var slugify = require('slugify')

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
    },
    {
        name: 'Basilicata',
        url: 'https://www.ansa.it/basilicata/notizie/basilicata_rss.xml'
    },
    {
        name: 'Calabria',
        url: 'https://www.ansa.it/calabria/notizie/calabria_rss.xml'
    },
    {
        name: 'Campania',
        url: 'https://www.ansa.it/campania/notizie/campania_rss.xml'
    },
    {
        name: 'Emilia Romagna',
        url: 'https://www.ansa.it/emiliaromagna/notizie/emiliaromagna_rss.xml'
    },
    {
        name: 'Friuli Venezia Giulia',
        url: 'https://www.ansa.it/friuliveneziagiulia/notizie/friuliveneziagiulia_rss.xml'
    },
    {
        name: 'Lazio',
        url: 'https://www.ansa.it/lazio/notizie/lazio_rss.xml'
    },
    {
        name: 'Liguria',
        url: 'https://www.ansa.it/liguria/notizie/liguria_rss.xml'
    },
    {
        name: 'Lombardia',
        url: 'https://www.ansa.it/lombardia/notizie/lombardia_rss.xml'
    },
    {
        name: 'Marche',
        url: 'https://www.ansa.it/marche/notizie/marche_rss.xml'
    },
    {
        name: 'Molise',
        url: 'https://www.ansa.it/molise/notizie/molise_rss.xml'
    },
    {
        name: 'Piemonte',
        url: 'https://www.ansa.it/piemonte/notizie/piemonte_rss.xml'
    },
    {
        name: 'Puglia',
        url: 'https://www.ansa.it/puglia/notizie/puglia_rss.xml'
    },
    {
        name: 'Sardegna',
        url: 'https://www.ansa.it/sardegna/notizie/sardegna_rss.xml'
    },
    {
        name: 'Sicilia',
        url: 'https://www.ansa.it/sicilia/notizie/sicilia_rss.xml'
    },
    {
        name: 'Toscana',
        url: 'https://www.ansa.it/toscana/notizie/toscana_rss.xml'
    },
    {
        name: 'Trentino',
        url: 'https://www.ansa.it/trentino/notizie/trentino_rss.xml'
    },
    {
        name: 'Umbria',
        url: 'https://www.ansa.it/umbria/notizie/umbria_rss.xml'
    },
    {
        name: 'Valle Aosta',
        url: 'https://www.ansa.it/valledaosta/notizie/valledaosta_rss.xml'
    },
    {
        name: 'Veneto',
        url: 'https://www.ansa.it/veneto/notizie/veneto_rss.xml'
    },
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
            rss.items[i]['daypublished'] = new Date(rss.items[i].published).toLocaleString('it-IT',  {'day': '2-digit'})
            rss.items[i]['monthpublished'] = new Date(rss.items[i].published).toLocaleString('it-IT',  {'month': 'long'})
            rss.items[i]['id'] = slugify(`${content.name.toLowerCase()}_${i}`)
        }
        const fd = fs.openSync(`json/${content.name}.json`, "w+");
        fs.writeSync(fd, JSON.stringify(rss, null, 4))
    }
}

main()