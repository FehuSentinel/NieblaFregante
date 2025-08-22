import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

console.log("Intentando conectar a PostgreSQL...");

async function conectarBaseDeDatos() {
  try {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
      }
    );

    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");
  } catch (err) {
    console.error("⚠️ Error al conectar a PostgreSQL:", err.message);
    console.log("⚠️ Cambiando a SQLite...");

    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./database.sqlite",
      logging: false,
    });

    try {
      await sequelize.authenticate();
      console.log("✅ Conexión a SQLite establecida correctamente.");
    } catch (sqliteErr) {
      console.error("❌ Error al conectar a SQLite:", sqliteErr.message);
    }
  }
}

await conectarBaseDeDatos();

export default sequelize;
