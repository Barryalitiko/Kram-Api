const express = require('express');
const ytdl = require('ytdl-core');
const router = express.Router();

// Ruta para descargar solo audio
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    ytdl(url, { format: audioFormat }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el audio' });
  }
});

module.exports = router;