const express = require('express');
const { getInfo } = require('@bochilteam/scraper');
const ytdl = require('ytdl-core');
const router = express.Router();

// Ruta para descargar video completo
router.get('/', async (req, res) => {
  const { url } = req.query;

  // Log de la URL recibida
  console.log(`[API VIDEO] URL recibida: ${url}`);

  if (!url || !ytdl.validateURL(url)) {
    console.log(`[API VIDEO] URL inválida: ${url}`);
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    console.log(`[API VIDEO] Validando información del video...`);
    const info = await getInfo(url);

    // Log de los formatos disponibles
    console.log(`[API VIDEO] Información obtenida:`, {
      title: info.title,
      length: info.lengthSeconds,
    });

    const videoFormat = info.formats.find(f => f.hasVideo && f.hasAudio);
    if (!videoFormat) {
      console.log(`[API VIDEO] No se encontró un formato compatible.`);
      return res.status(400).json({ error: 'No se encontró un formato de video compatible' });
    }

    console.log(`[API VIDEO] Enviando video...`);
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { format: videoFormat }).pipe(res);
  } catch (err) {
    console.error(`[API VIDEO] Error al obtener el video:`, err.message);
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

module.exports = router;