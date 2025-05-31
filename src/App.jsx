import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const gameDefs = [
    { id: 1, baseLabel: "8U Game 1: 8U Poolville Perrin vs 8U Millsap Lynch" },
    { id: 2, baseLabel: "8U Game 2: 8U Poolville Ripple vs WINNER1" },
    { id: 3, baseLabel: "8U Game 3: LOSER1 vs LOSER2" },
    { id: 4, baseLabel: "8U Game 4: WINNER2 vs WINNER3" },
    { id: 5, baseLabel: "8U Game 5 (if needed): WINNER2 vs WINNER3" },
    { id: 6, baseLabel: "12U Game 1: 12U Poolville Miles vs 12U Pike" },
    { id: 7, baseLabel: "12U Game 2: 12U Mcgee vs WINNER6" },
    { id: 8, baseLabel: "12U Game 3: LOSER6 vs LOSER7" },
    { id: 9, baseLabel: "12U Game 4: WINNER7 vs WINNER8" },
    { id: 10, baseLabel: "12U Game 5 (if needed): WINNER7 vs WINNER8" },
];

export default function TournamentPage() {
    const [scores, setScores] = useState({});

    const handleScoreInput = (gameId, index, value) => {
        const prev = scores[gameId] || ["", ""];
        const newScore = [...prev];
        newScore[index] = value;
        setScores((prevScores) => ({ ...prevScores, [gameId]: newScore }));
    };

    function getScore(gameId) {
        const score = scores[gameId];
        if (!score || score.length !== 2) return null;
        const [a, b] = score.map((s) => parseInt(s));
        return !isNaN(a) && !isNaN(b) ? [a, b] : null;
    }

    function getLabelParts(label) {
        const match = label.match(/: (.+) vs (.+)/);
        return match ? [match[1], match[2]] : ["Team A", "Team B"];
    }

    function getWinner(gameId) {
        const score = getScore(gameId);
        const label = gameDefs.find((g) => g.id === gameId)?.baseLabel || "";
        const [teamA, teamB] = getLabelParts(label);
        if (!score) return `Winner of Game ${gameId}`;
        return score[0] > score[1] ? teamA : teamB;
    }

    function getLoser(gameId) {
        const score = getScore(gameId);
        const label = gameDefs.find((g) => g.id === gameId)?.baseLabel || "";
        const [teamA, teamB] = getLabelParts(label);
        if (!score) return `Loser of Game ${gameId}`;
        return score[0] < score[1] ? teamA : teamB;
    }

    function renderLabel(game) {
        return game.baseLabel
            .replace("WINNER1", getWinner(1))
            .replace("LOSER1", getLoser(1))
            .replace("LOSER2", getLoser(2))
            .replace("WINNER2", getWinner(2))
            .replace("WINNER3", getWinner(3))
            .replace("WINNER6", getWinner(6))
            .replace("LOSER6", getLoser(6))
            .replace("LOSER7", getLoser(7))
            .replace("WINNER7", getWinner(7))
            .replace("WINNER8", getWinner(8));
    }

    const teams = Array.from(
        new Set(
            gameDefs
                .map((g) => getLabelParts(renderLabel(g)))
                .flat()
                .filter((name) => !name.includes("WINNER") && !name.includes("LOSER") && !name.includes("Winner") && !name.includes("Loser"))
        )
    );

    const standings = teams.map((team) => {
        let gamesPlayed = 0;
        let runsEarned = 0;
        let runsAllowed = 0;

        gameDefs.forEach((game) => {
            const label = renderLabel(game);
            const [teamA, teamB] = getLabelParts(label);
            const score = getScore(game.id);
            if (score) {
                if (teamA === team || teamB === team) {
                    gamesPlayed++;
                    const isA = teamA === team;
                    runsEarned += isA ? score[0] : score[1];
                    runsAllowed += isA ? score[1] : score[0];
                }
            }
        });

        return { team, gamesPlayed, runsEarned, runsAllowed };
    });

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Parker County League Baseball Tournament</h1>
            <p className="text-lg mb-4">May 31st - June 1st, 2025 | Poolville High School, 1001 Lonestar Rd, Poolville, TX 76487</p>
            <Tabs defaultValue="schedule" className="mt-6">
                <TabsList className="mb-4">
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="bracket">Bracket</TabsTrigger>
                    <TabsTrigger value="scores">Enter Scores</TabsTrigger>
                    <TabsTrigger value="standings">Standings</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule">
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-semibold mb-2">8U Schedule</h2>
                            <ul className="space-y-2">
                                {gameDefs.slice(0, 5).map((game, idx) => (
                                    <li key={game.id}>
                                        <CalendarDays className="inline mr-2" />
                                        {idx < 3 ? "May 31st" : "June 1st"}, {idx === 0 ? "8:00 AM" : idx === 1 ? "11:30 AM" : idx === 2 ? "3:00 PM" : idx === 3 ? "8:00 AM" : "3:00 PM"} - {renderLabel(game)}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-semibold mb-2">12U Schedule</h2>
                            <ul className="space-y-2">
                                {gameDefs.slice(5).map((game, idx) => (
                                    <li key={game.id}>
                                        <CalendarDays className="inline mr-2" />
                                        {idx < 3 ? "May 31st" : "June 1st"}, {idx === 0 ? "9:30 AM" : idx === 1 ? "1:00 PM" : idx === 2 ? "4:30 PM" : idx === 3 ? "11:30 AM" : "1:30 PM"} - {renderLabel(game)}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bracket">
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center gap-6">
                            <h2 className="text-2xl font-semibold">Tournament Brackets</h2>
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-center">12U Bracket</h3>
                                <img src="https://i.imgur.com/m4m6dAV.png" alt="12U Bracket" className="max-w-full rounded shadow" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-center">8U Bracket</h3>
                                <img src="https://i.imgur.com/2f6CWua.jpeg" alt="8U Bracket" className="max-w-full rounded shadow" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="scores">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-semibold mb-4">Enter Scores</h2>
                            <div className="space-y-4">
                                {gameDefs.map((game) => {
                                    const label = renderLabel(game);
                                    const [teamA, teamB] = getLabelParts(label);
                                    const value = scores[game.id] || ["", ""];
                                    return (
                                        <div key={game.id} className="flex items-center gap-4">
                                            <span className="w-48 text-right">{teamA}</span>
                                            <Input
                                                type="number"
                                                className="w-16"
                                                value={value[0]}
                                                onChange={(e) => handleScoreInput(game.id, 0, e.target.value)}
                                            />
                                            <span className="mx-2">vs</span>
                                            <Input
                                                type="number"
                                                className="w-16"
                                                value={value[1]}
                                                onChange={(e) => handleScoreInput(game.id, 1, e.target.value)}
                                            />
                                            <span className="w-48 text-left">{teamB}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="standings">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-semibold mb-4">Standings</h2>
                            <table className="w-full table-auto">
                                <thead>
                                <tr>
                                    <th className="text-left p-2">Team</th>
                                    <th className="text-left p-2">Games Played</th>
                                    <th className="text-left p-2">Runs Earned</th>
                                    <th className="text-left p-2">Runs Allowed</th>
                                </tr>
                                </thead>
                                <tbody>
                                {standings.map(({ team, gamesPlayed, runsEarned, runsAllowed }) => (
                                    <tr key={team}>
                                        <td className="p-2">{team}</td>
                                        <td className="p-2">{gamesPlayed}</td>
                                        <td className="p-2">{runsEarned}</td>
                                        <td className="p-2">{runsAllowed}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                <MapPin className="inline mr-1" /> Poolville High School, 1001 Lonestar Rd, Poolville, TX 76487
            </div>
        </div>
    );
}
