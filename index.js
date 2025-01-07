const logger = require("./utils/logger"); // Importar el logger personalizado
const express = require("express");
// ... otros imports

async function start() {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    // Ruta principal
    app.get("/", (req, res) => {
      logger.info("Ruta principal '/' visitada");
      res.json({ message: "Bienvenido a la API" });
    });

    app.listen(PORT, () => {
      logger.info(Servidor corriendo en http://localhost:${PORT});
    });
  } catch (error) {
    logger.error(Error al iniciar el servidor: ${error.message});
  }
}

start();
