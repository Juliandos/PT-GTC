import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hotelbediax_db',
  process.env.DB_USER || 'user_gtc',
  process.env.DB_PASSWORD || 'user_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para probar la conexión
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    throw error;
  }
};

// Función para sincronizar modelos (migraciones automáticas)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    if (force) {
      console.log('⚠️  Sincronizando base de datos con force: true (se eliminarán los datos)');
      await sequelize.sync({ force: true });
    } else {
      console.log('🔄 Sincronizando base de datos (alter: true)');
      await sequelize.sync({ alter: true });
    }
    console.log('✅ Base de datos sincronizada correctamente.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

// Exportar instancia de Sequelize
export default sequelize;

