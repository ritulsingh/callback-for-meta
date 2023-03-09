"use strict";
const request = require("request"),
    express = require("express"),
    body_parser = require("body-parser"),
    app = express().use(body_parser.json());

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("smoggy-plum-antelopeCyclicDB")

const dbResult = db.collection("callbackResult")

app.listen(3000, () => console.log(`listening on http://localhost:3000`));

app.get("/", (req, res) => {
    res.send("Working")
})

app.post("/waba-meta", (req, res) => {
    let body = req.body;
    const challenge = req.query['hub.challenge'] || 'OK';
    console.log(JSON.stringify(body, null, 2));
    res.status(200).send(challenge)
})
let result = [];
app.post("/waba-karix", async (req, res) => {
    let body = req.body;
    const challenge = req.query['hub.challenge'] || 'OK';
    console.log(JSON.stringify(body, null, 2));
    result = [...result, body];
    await dbResult.set("result", body)
    res.status(200).send(challenge)
})

app.get("/result", async (_req, res) => {
    let item = await dbResult.get("result")
    console.log(item)
    res.status(200).send(result)
})

app.get("/result/:requestid", (req, res) => {
    const { requestid } = req.params;
    const temp = result.filter((temp) => temp.requestid === requestid);
    res.status(200).send(JSON.stringify(temp))
})

app.get("/waba-meta", (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === "ritulsingh") {
        console.log(`Callback route successfully verified`)
        res.status(200).send(req.query['hub.challenge'])
    }
    else {
        res.status(403).send("Not authenticated")
    }
});
