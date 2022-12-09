const express = require("express"); // Loads module
const { get } = require("request");
var request = require("request");

clientID = '35ebd7fe15d9488390e61aca5ba97db3'
clientSecret = '769ff5b897f044a9a03de0a3a77315b3'
var accessToken = '';
var expires_in = 0;

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded());

/*

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
myHeaders.append('Authorization', 'Bearer ' + Buffer.from(`${clientID}:${clientSecret}`).toString('base64'));

const formData = new FormData();
formData.append('grant_type', `client_credentials`);
formData.append('scope', 'basic');

var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientID}:${clientSecret}`).toString('base64')
    },
    body: {
        'grant_type': `client_credentials`,
        'scope': 'basic',
    }
};

const myRequest = new Request('https://oauth.fatsecret.com/connect/token', options);

try {
    fetch(myRequest)
    .then ((response) => response.json())
    .then((data) => console.log(data));
}
catch(e){
    console.log(e);
}

*/

/*
request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);

    app.get("/access", (req, res) => {
        // Pull JSON data from food API
        res.json(body); 
    })
    
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
*/

const getAccessToken = async () => {
    console.log("Getting new access token...");

    var options = {
        method: 'POST',
        url: 'https://oauth.fatsecret.com/connect/token',
        method: 'POST',
        auth: {
            user: clientID,
            password: clientSecret
        },
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: {
            'grant_type': 'client_credentials',
            'scope': 'basic'
        },
        json: true
    };


    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        accessToken = body.access_token;
        expires_in = body.expires_in;
        setInterval(getAccessToken, expires_in * 1000);
    });    
}

app.get('/health', function (req, res) {
    try {
        console.log("Monitoring health..");

        res.sendStatus(200);
    }
    catch (error){
        res.send(error);
    }
})

app.post('/get_food/:id', function (req, res) {
    const id = req.params.id;

    console.log(`Searching for food ID ${id}:`);
    // Send a request to fatsecret API to get food details
    try {
        let data = new URLSearchParams({
            oauth_consumer_key: 'key',
            oauth_signature_method: 'HMAC-SHA1',
            oauth_nonce: 'nonce',
            method: 'food.get.v2',
            food_id: id,
            format: 'json'
        })

        fetch('https://platform.fatsecret.com/rest/server.api?' + data,
        {
            method: 'POST',
            headers: {  'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + accessToken,
                        },
        })
        .then((response) => response.json())
        .then((body) => res.send(body));
    }
    catch (error) {
        res.send(error);
    }
})

app.post('/find_recipe/:protein/:carbs/:fat/:calories', function (req, res) {
    const proteinPct = parseInt(req.params.protein);
    const carbPct = parseInt(req.params.carbs);
    const fatPct = parseInt(req.params.fat);
    const calories = parseInt(req.params.calories);
    const recipeType = req.params.recipeType;
    console.log(`Cal: ${calories} \nP: ${proteinPct}  C: ${carbPct}  F: ${fatPct}`);
    //console.log(`Searching with keyword(s): ${recipeType}`);
    try{
        let data = new URLSearchParams({
            oauth_consumer_key: 'key',
            oauth_signature_method: 'HMAC-SHA1',
            oauth_nonce: 'nonce',
            method: 'recipes.search.v2',
            format: 'json',
            //'calories.to': calories + 200,
            'calories.from': calories-100,
            'protein_percentage.from': proteinPct-5,
            //'protein_percentage.to': proteinPct,
            'carb_percentage.from': carbPct - 10,
            //'carb_percentage.to': carbPct + 10,
            'fat_percentage.from': fatPct - 10,
            //'fat_percentage.to': fatPct + 10,
            //search_expression: recipeType,
            max_results: 50
        })

        fetch('https://platform.fatsecret.com/rest/server.api?' + data,
        {
            method: 'POST',
            headers: {  'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + accessToken,
                        },
        })
        .then((response) => response.json())
        .then((body) => {
            console.log(body);
            res.send(body)
        });
    }
    catch (error) {
        console.log(`error ${error}`)
        res.send(error);
    }
})

app.get('/find_recipe/:protein/:carbs/:fat/:calories', function (req, res) {
    const proteinPct = parseInt(req.params.protein);
    const carbPct = parseInt(req.params.carbs);
    const fatPct = parseInt(req.params.fat);
    const calories = parseInt(req.params.calories);
    const recipeType = req.params.recipeType;
    console.log(`Cal: ${calories} \nP: ${proteinPct}  C: ${carbPct}  F: ${fatPct}`);
    //console.log(`Searching with keyword(s): ${recipeType}`);
    try{
        let data = new URLSearchParams({
            oauth_consumer_key: 'key',
            oauth_signature_method: 'HMAC-SHA1',
            oauth_nonce: 'nonce',
            method: 'recipes.search.v2',
            format: 'json',
            //'calories.to': calories + 200,
            'calories.from': calories-100,
            'protein_percentage.from': proteinPct-5,
            //'protein_percentage.to': proteinPct,
            'carb_percentage.from': carbPct - 10,
            //'carb_percentage.to': carbPct + 10,
            'fat_percentage.from': fatPct - 10,
            //'fat_percentage.to': fatPct + 10,
            //search_expression: recipeType,
            max_results: 50
        })

        fetch('https://platform.fatsecret.com/rest/server.api?' + data,
        {
            method: 'POST',
            headers: {  'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + accessToken,
                        },
        })
        .then((response) => {
            response.headers.append('Access-Control-Allow-Origin', '*');
            response.json()
        })
        .then((body) => {
            console.log(body);
            const headers = new Headers();
            res.send(body)
        });
    }
    catch (error) {
        console.log(`error ${error}`)
        res.send(error);
    }
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})

getAccessToken();
