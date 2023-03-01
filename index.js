"use strict";
const request = require("request"),
    express = require("express"),
    body_parser = require("body-parser"),
    app = express().use(body_parser.json());

app.listen(3000, () => console.log(`listening on http://localhost:3000`));

app.get("/", (req, res) => {
    res.send("Working on http://localhost:3000")
})

app.post("/waba-meta", (req, res) => {
    let body = req.body;

    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.object) {
        if (
            req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]
        )
            res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.get("/waba-meta", (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === "ritulsingh") {
        console.log(`Callback route successfully verified`)
        res.status(200).send(req.query['hub.challenge'])
    }
    else {
        res.status(403).send("Not authenticated")
    }
});
