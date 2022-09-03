//required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//create express server
const app = express();

//server port number
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));

// Needed to parse html data for POST requests
app.use(express.urlencoded({
    extended: true
  }));

app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
})

//post routing
app.post("/convert-mp3", async (req, res) => {
    
    const videoId = req.body.videoId;

    if(videoId === undefined || videoId === "" || videoId === null){
        return res.render("index", {success : false, message : "Please enter a video ID"});
    }
    else{
        const fetchAPI = await fetch(`https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess?url=${videoId}`,{
            "method" : "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });
        const fetchResponse = await fetchAPI.json();
        console.log(fetchResponse);

        if(fetchResponse.message === "success! created!")
      return res.render("index",{ success : true,  song_title : fetchResponse.YoutubeAPI.titolo, song_link : fetchResponse.YoutubeAPI.urlMp3})
    else
      return res.render("index", { success : false, message : fetchResponse.message});
  }
    
});

//start server
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});