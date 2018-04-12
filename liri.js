require("dotenv").config();
var liriKey = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var liriAction = process.argv[2];
var liriSearchName = process.argv[3];



function commandLine(action, searchName) {
    if (action === "my-tweets") {

        var client = new Twitter(liriKey.twitter);

        var params = { name: 'TotallyNotATestAccount' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (i = 0; i < tweets.length; i++) {
                    console.log("I tweeted: " + tweets[i].text);
                }
            }
        });
    } else if (action === "spotify-this-song") {

        var spotify = new Spotify(liriKey.spotify);

        spotify.search({ type: 'track', query: searchName }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // console.log(data.tracks.items[0]);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + searchName);
            console.log("Link: " + data.tracks.items[0].album.external_urls.spotify);
            console.log("Album: " + data.tracks.items[0].album.name);
        });


    } else if (action === "movie-this") {
        var queryURL = "https://www.omdbapi.com/?t=" + searchName + "&y=&plot=short&apikey=trilogy";
        request(queryURL, function (error, response, body) {
            // console.log('error:', error);
            // console.log('statusCode:', response && response.statusCode);
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("Released: " + JSON.parse(body).Released);
            console.log("Genre: " + JSON.parse(body).Genre);
            console.log("Director: " + JSON.parse(body).Director);
            console.log("Actors: " + JSON.parse(body).Actors);
        });

    } else if (action === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (error, data) {

            if (error) {
                return console.log(error);
            }

            var fileData = data.split(",");
            commandLine(fileData[0], fileData[1]);
        });
    }
}

commandLine(liriAction, liriSearchName);

