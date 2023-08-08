const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/ccofre.space/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ccofre.space/fullchain.pem')
};

const app = express();
// const port = 80;
const port = 443;


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Definir una ruta para el método GET
app.get('/diario', (req, res) => {
  const url = 'https://www.twitter-trending.com/chile/es';

  axios.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Buscar la etiqueta meta con el nombre "description"
      const metaDescription = $('meta[name="description"]').attr('content').replace('..','').replace('Tendencias en Chile: ','').split(', ');


      // Verificar si se encontró la etiqueta
      if (metaDescription) {
        res.json({ description: metaDescription });
      } else {
        res.status(404).json({ error: 'No se encontró la etiqueta meta con nombre "description"' });
      }
    })
    .catch((error) => {
      console.error('Error al obtener la página:', error);
      res.status(500).json({ error: 'Error al obtener la página' });
    });
});


// Definir una ruta para el método GET
app.get('/now', (req, res) => {
  const url = 'https://www.twitter-trending.com/chile/es';

  axios.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Buscar la etiqueta meta con el nombre "description"
      // const metaDescription = $('meta[name="description"]').attr('content').replace('..','').replace('Tendencias en Chile: ','').split(', ');
      const metaDescription = $('script[type="application/ld+json"]')

      // Verificar si se encontró la etiqueta
      if (metaDescription) {
        res.json(JSON.parse(metaDescription.html()));
      } else {
        res.status(404).json({ error: 'No se encontró la etiqueta' });
      }
    })
    .catch((error) => {
      console.error('Error al obtener la página:', error);
      res.status(500).json({ error: 'Error al obtener la página' });
    });
});

// Iniciar el servidor
// app.listen(port, () => {
//   console.log(`Servidor escuchando en http://localhost:${port}`);
// });


// Iniciar el servidor
const server = https.createServer(options, app);
server.listen(port, () => {
  console.log(`Servidor HTTPS escuchando en el puerto ${port}`);
});
