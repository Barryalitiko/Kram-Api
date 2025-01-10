const logger = require("./utils/logger"); // Importar el logger personalizado
const express = require("express");
const audioRoutes = require("./routes/audio"); // Ruta de audio
const musicaRoutes = require("./routes/musica"); // Ruta de música
const videoRoutes = require("./routes/video"); // Ruta de video

async function start() {
  try {
    const app = express();
    const PORT = process.env.PORT || 4000;

    app.use(express.json());

    // Ruta principal
    app.get("/", (req, res) => {
      logger.info("Ruta principal '/' visitada");
      res.json({ message: "Bienvenido a la API" });
    });

    // Usar rutas de audio, música y video
    app.use("/audio", audioRoutes); // Agregar las rutas de audio
    app.use("/musica", musicaRoutes); // Agregar las rutas de música
    app.use("/video", videoRoutes); // Agregar las rutas de video

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
  }
}

start();