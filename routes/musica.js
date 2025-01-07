const express = require('express');
const { getInfo } = require('@bochilteam/scraper');
const ytdl = require('ytdl-core');
const router = express.Router();

// Ruta para descargar video completo
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    const info = await getInfo(url);
    const videoFormat = info.formats.find(f => f.hasVideo && f.hasAudio);

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { format: videoFormat }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

module.exports = router;