const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000; // Puedes cambiar el número de puerto según tus preferencias

// Endpoint para obtener información del webscraping
app.get('/top', async (req, res) => {
  try {
    // Realizar una solicitud HTTP al sitio web que deseas hacer webscraping
    // const url = 'https://getdaytrends.com/chile/';
    const url = 'https://getdaytrends.com/chile/top/longest/day/';
    const response = await axios.get(url);
    const html = response.data;

    // Analizar el HTML utilizando Cheerio para extraer la información deseada
    const $ = cheerio.load(html);

     // Obtener la tabla con la clase deseada
     const tabla = $(`table.${'ranking', 'top'}`);
 
     // Crear un arreglo para almacenar los datos de la tabla
     const data = [];
 
     // Recorrer las filas de la tabla (excepto la primera fila que contiene los encabezados)
     tabla.find('tr:not(:first-child)').each((index, row) => {
       const fila = $(row);
 
       // Obtener los datos de cada celda de la fila
       const f1 = fila.find('td:nth-child(1)').text();
       const Trend = fila.find('td:nth-child(2)').text().substring(1);;
       const Duracion = fila.find('td:nth-child(3)').text();
       const Revisado = fila.find('td:nth-child(4)').text();
       const f5 = fila.find('td:nth-child(5)').text();
 
 
       // Agregar los datos de la fila al arreglo
    //    data.push({ Trend, Tiempo });
       data.push({ Trend, Duracion, Revisado });
     });
 
     // Enviar los datos como respuesta en formato JSON
     res.json(data);

  } catch (error) {
    console.error('Error al obtener datos:', error.message);
    res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos' });
  }
});

// Endpoint para obtener información del webscraping
app.get('/trends', async (req, res) => {
    try {
      // Realizar una solicitud HTTP al sitio web que deseas hacer webscraping
      // const url = 'https://getdaytrends.com/chile/';
      const url = 'https://getdaytrends.com/chile/top/longest/day/';
      const response = await axios.get(url);
      const html = response.data;
  
      // Analizar el HTML utilizando Cheerio para extraer la información deseada
      const $ = cheerio.load(html);
  
       // Obtener la tabla con la clase deseada
       const tabla = $(`table.${'ranking', 'trends'}`);
   
       // Crear un arreglo para almacenar los datos de la tabla
       const data = [];
   
       // Recorrer las filas de la tabla (excepto la primera fila que contiene los encabezados)
       tabla.find('tr:not(:first-child)').each((index, row) => {
         const fila = $(row);
   
         // Obtener los datos de cada celda de la fila
         const f1 = fila.find('td:nth-child(1)').text();
         const Trend = fila.find('td:nth-child(2)').text();
         const Duracion = fila.find('td:nth-child(3)').text();
         const Revisado = fila.find('td:nth-child(4)').text();
         const f5 = fila.find('td:nth-child(5)').text();
   
   
         // Agregar los datos de la fila al arreglo
      //    data.push({ Trend, Tiempo });
         data.push({ Trend, Duracion });
       });
   
       // Enviar los datos como respuesta en formato JSON
       res.json(data);
  
    } catch (error) {
      console.error('Error al obtener datos:', error.message);
      res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos' });
    }
  });


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de webscraping en funcionamiento en http://localhost:${PORT}`);
});
