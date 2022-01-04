const os = require('os');
const express = require('express');
const redis = require('redis');
const app = express();

// Config de la connexion au serveur Redis
const redis_client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

// routes (endpoints)
app.get("/", (req, res) => {
  res.send("Mi chiamo: " + os.hostname());
})

app.get("/visits", (req, res) => {
  
  redis_client.get('visit', (err, num_visits) => {
  
    if (num_visits) {
      num_visits = parseInt(num_visits) + 1;
    } else {
      num_visits = 1;
    }

    redis_client.set('visit', num_visits);
    res.send("Visites: " + num_visits);  
  });

})

app.get("/bug", (req, res) => {
  // simulation d'une erreur provoquant l'arrêt du processus
  console.log("Bug, le processus va crasher");	
  process.exit(1);
});


app.listen(3000, () => console.log("Serveur http sur port 3000"));
