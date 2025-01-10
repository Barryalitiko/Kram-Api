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
    console.log(`Intentando obtener información del audio de la URL: ${url}`);
    const info = await ytdl.getInfo(url);
    console.log(`Información del video obtenida: ${info.videoDetails.title}`);

    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    console.log(`Formato de audio seleccionado: ${audioFormat.container}`);

    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    ytdl(url, { format: audioFormat }).pipe(res);
  } catch (err) {
    console.error(`Error al obtener el audio: ${err.message}`);
    res.status(500).json({ error: 'Error al obtener el audio' });
  }
});

module.exports = router;