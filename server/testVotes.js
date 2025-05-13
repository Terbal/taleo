// server/testVotes.js
import fetch from "node-fetch"; // ou utilise le fetch natif si tu es en Node 18+

async function simulateVotes(pid, count = 15) {
  // 1) Assure-toi que ton serveur Express tourne en local sur le port 10000
  //    (node index.js ou npm start dans le dossier server)
  const url = `http://localhost:10000/api/paragraphs/${pid}/vote`; // <-- juste http://

  for (let i = 1; i <= count; i++) {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      console.error(`Erreur à l’itération ${i}:`, await res.text());
      break;
    }
    const json = await res.json();
    console.log(`Vote ${i}: votes=${json.votes}, validated=${json.validated}`);
  }
}

const PID = process.argv[2];
if (!PID) {
  console.error("Usage: node testVotes.js <paragraphId>");
  process.exit(1);
}

simulateVotes(PID).catch((err) => console.error(err));
