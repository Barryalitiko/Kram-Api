const { createLogger, format, transports } = require("winston");
const chalk = require("chalk");

// Configuración de Winston
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return ${chalk.blue(timestamp)} ${chalk.magenta(level)}: ${message};
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log", level: "info" }) // Logs en archivo
  ]
});

// Ejemplo de niveles personalizados para mensajes específicos
logger.info(chalk.green("Logger configurado correctamente"));

module.exports = logger;
