const fs = require('fs')
const { parse } = require('rss-to-json')

const RSS_TO_CONVERT = [
    {
        name: 'Ansa',
        url: 'https://www.ansa.it/sito/ansait_rss.xml'
    },
    {
        name: 'Cronaca',
        url: 'https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml'
    },
    {
        name: 'Politica',
        url: 'https://www.ansa.it/sito/notizie/politica/politica_rss.xml'
    }
]

const main = async () => {
    for (content of RSS_TO_CONVERT) {
        const rss = await parse(content.url)
        const fd = fs.openSync(`json/${content.name}.json`, "w+");
        fs.writeSync(fd, JSON.stringify(rss, null, 4))
    }
}

main()