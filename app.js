const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const port = 80;


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Definir una ruta para el método GET
app.get('/top', (req, res) => {
  const url = 'https://www.twitter-trending.com/chile/es'; // Reemplaza esto con la URL del sitio web que deseas scrapear

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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
