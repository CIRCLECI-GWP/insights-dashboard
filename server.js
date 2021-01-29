require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
let bodyParser = require("body-parser");
const axios = require("axios");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let port = process.env.PORT || "5000";
const api_v1 = "https://circleci.com/api/v1.1/";
const api_v2 = "https://circleci.com/api/v2/";
axios.defaults.headers.common["Circle-Token"] = process.env.API_KEY;
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/getprojects", async (req, res) => {
    let projects = await axios.get(`${api_v1}projects`);
    res.send(projects.data);
});
app.get("/getpipelines", async (req, res) => {
    const project_slug = req.query.project_slug;
    let pipelines = await axios.get(`${api_v2}project/${project_slug}/pipeline`);
    res.send(pipelines.data);
});
app.post("/triggerpipeline", async (req, res) => {
    const project_slug = req.body.project_slug;
    try {
        const trigger = await axios.post(
            `${api_v2}project/${project_slug}/pipeline`
        );
        res.send(trigger.data);
    } catch (error) {
        res.send(error);
    }
});
app.listen(port, () => {
    console.log(`App Running at http://localhost:${port}`);
});
