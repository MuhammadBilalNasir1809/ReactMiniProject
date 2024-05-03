const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Leaderboard")
    .then(() => {
        console.log("Connected to mongodb://127.0.0.1:27017/MyDatabase");
         //insertTeams();
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const teamSchema = new mongoose.Schema({
    rank: { type: Number },
    name: { type: String },
    gamesPlayed: { type: Number },
    score: { type: Number },
    image: { type: String }
});

const Team = mongoose.model("Team", teamSchema);

app.get("/", function (req, res) {
    res.send("Express Server is running on port 4000")
});

app.get("/getTeams", async (req, res) => {
    const teamsData = await Team.find({});

    if (teamsData) {
        res.status(200).send(teamsData);
    }
    else {
        res.status(400).send("Error Fetching Data");
    }
})

app.listen(4000, function () {
    console.log("Server is up and running on port 4000");
});

async function insertTeams() {
    try {
        const dummyTeams = [];
        const teamNames = ["Avengers", "Justice League", "Bugs Killer", "The Musketeers", "The Ultimate", "Inhumans", "Defenders", "Foo Fighters", "New Mutants", "Thunderbolts", "Young Avengers", "Excalibur", "X-Force", "S.H.I.E.L.D.", "Alpha Flight"];

        
        // Find the maximum length among team names
        const maxLength = Math.max(...teamNames.map(name => name.length));
        
        // Pad shorter names with spaces to match the maximum length
        const paddedTeamNames = teamNames.map(name => name.padEnd(maxLength, ' '));
        
        for (let i = 0; i < paddedTeamNames.length; i++) {
            dummyTeams.push({
                rank: i + 1,
                name: teamNames[i],
                gamesPlayed: Math.floor(Math.random() * 20),
                score: Math.floor(Math.random() * 1000),
                image: `/assets/team${i + 1}.png`
            });
        }

        await Team.insertMany(dummyTeams);
        console.log("Data inserted successfully");
    } catch (error) {
        console.error("Error populating teams:", error);
    }
}