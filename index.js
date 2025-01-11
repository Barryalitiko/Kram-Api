const express = require("express");
const path = require("path");
const logger = require("./utils/logger"); // Importar el logger personalizado
const audioRoutes = require("./routes/audio"); // Ruta de audio
const musicaRoutes = require("./routes/musica"); // Ruta de música
const videoRoutes = require("./routes/video"); // Ruta de video
const playdlAudioRoutes = require("./routes/playdlAudio"); // Ruta de audio con Play-DL

async function start() {
  try {
    const app = express();
    const PORT = process.env.PORT || 4000;

    // Servir archivos estáticos desde la carpeta 'public'
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(express.json());

    // Ruta principal
    app.get("/", (req, res) => {
      logger.info("Ruta principal '/' visitada");
      res.json({ message: "Bienvenido a la API" });
    });

    // Usar rutas de audio, música, video y Play-DL
    app.use("/audio", audioRoutes); // Agregar las rutas de audio
    app.use("/musica", musicaRoutes); // Agregar las rutas de música
    app.use("/video", videoRoutes); // Agregar las rutas de video
    app.use("/playdl-audio", playdlAudioRoutes); // Agregar la nueva ruta de Play-DL

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
  }
}

start();