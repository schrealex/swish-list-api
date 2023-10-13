import { Elysia } from "elysia";

const app = new Elysia();
app.get("/", () => "Welcome to Swish API! 🎮");
app.get('/how-long-to-beat', ({ query: { title, year }, set }) => {
    return getHLTBInformation(title, year).then(result => {
        if (result.status && result.status !== 200) {
            set.status = result.status;
            return result.statusText + ' 🚧';
        }
        return result
    }).catch((error) => {
        console.error({ error });
        return error;
    });
});
app.get("*", () => handle404());

app.listen(3000);

const getHLTBInformation = async (title: string | null, year: string | null) => {
    const response = await fetch(`https://www.howlongtobeat.com/api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://howlongtobeat.com/',
        },
        body: JSON.stringify({
            'searchType': 'games',
            'searchTerms': [title],
            'searchPage': 1,
            'size': 20,
            'searchOptions': {
                'games': {
                    'userId': 0,
                    'platform': '',
                    'sortCategory': 'popular',
                    'rangeCategory': 'main',
                    'rangeTime': {
                        'min': 0,
                        'max': 0
                    },
                    rangeYear: {
                        min: [year],
                        max: [year]
                    },
                    'gameplay': {
                        'perspective': '',
                        'flow': '',
                        'genre': ''
                    },
                    'modifier': ''
                },
                'users': {
                    'sortCategory': 'postcount'
                },
                'filter': '',
                'sort': 0,
                'randomizer': 0
            }
        })
    });
    if (!response.ok) {
        return response;
    }
    return await response.json();
};

const handle404 = () => {
    return '404 - Page not found 🤦🏻‍️'
};

console.log(
  `🎮 Swish API is running at ${app.server?.hostname}:${app.server?.port}`
);
