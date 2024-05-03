import React, { useState, useEffect } from "react";
import './App.css';
import firstPlaceImage from "./components/assets/firstPlaceImage.jpeg";
import secondPlaceImage from "./components/assets/secondPlaceImage.jpeg";
import thirdPlaceImage from "./components/assets/thirdPlaceImage.jpg";

function App() {
  const [teamsData, setTeamsData] = useState([]);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getData = async () => {
    const response = await fetch("http://localhost:4000/getTeams", { method: "GET" });
    try {
      if (response.ok) {
        let data = await response.json();  // get data from db
        data = data.sort((a, b) => a.rank - b.rank); // Sort only by rank in ascending order
        setTeamsData(data);
      } else {
        console.error("Failed to fetch profile posts");
      }
    } catch (e) {
      console.log("Error Occurred : ", e);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(teamsData);
  }, [teamsData]);

  return (
    <div className={`body ${theme === "dark" ? "dark-theme" : ""}`}>
      <div className="Navbar">
        LEADERBOARD
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
      <table className={`leaderboard ${theme === "dark" ? "dark-table" : ""}`}>
        <thead>
          <tr className="headings">
            <th className="heading1">Rank</th>
            <th>Team Name</th>
            <th>Total Games Played</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {teamsData.map((team, index) => {
            let rankImage;
            if (index === 0) {
              rankImage = firstPlaceImage;
            } else if (index === 1) {
              rankImage = secondPlaceImage;
            } else if (index === 2) {
              rankImage = thirdPlaceImage;
            }

            return (
              <tr key={index} className="leaderboard-body">
                <td>
                  {rankImage && <img src={rankImage} alt="team-ranking" className="rank-img" />}
                  {!rankImage && <span className="rank-number">{team.rank}</span>}
                </td>
                <td className="team-profile-data">
                  <img src={team.image} alt="team-profile" className="profile-img" />
                  <span>{team.name}</span>
                </td>
                <td>{team.gamesPlayed}</td>
                <td>+ {team.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
