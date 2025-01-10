const express = require('express');
const { getInfo } = require('@bochilteam/scraper');
const ytdl = require('ytdl-core');
const router = express.Router();

// Ruta para obtener la información y enlace del video
router.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'URL inválida o no proporcionada' });
  }

  try {
    console.log(`Procesando solicitud para URL: ${url}`);

    const info = await getInfo(url); // Obtener información del video
    console.log(`Información del video obtenida:`, info);

    const videoFormat = info.formats.find((f) => f.hasVideo && f.hasAudio);

    if (!videoFormat) {
      return res.status(404).json({ error: 'Formato de video no disponible' });
    }

    console.log(`Enlace de descarga del video encontrado: ${videoFormat.url}`);
    res.status(200).json({
      downloadUrl: videoFormat.url,
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
    });
  } catch (err) {
    console.error(`Error al procesar la solicitud: ${err.message}`);
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

module.exports = router;