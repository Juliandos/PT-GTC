import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface DestinationAttributes {
  id: number;
  name: string;
  description: string;
  countryCode: string;
  type: 'Beach' | 'Mountain' | 'City' | 'Cultural' | 'Adventure';
  lastModif: Date;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DestinationCreationAttributes extends Optional<DestinationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Destination extends Model<DestinationAttributes, DestinationCreationAttributes> implements DestinationAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public countryCode!: string;
  public type!: 'Beach' | 'Mountain' | 'City' | 'Cultural' | 'Adventure';
  public lastModif!: Date;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Destination.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Beach', 'Mountain', 'City', 'Cultural', 'Adventure'),
      allowNull: false,
    },
    lastModif: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Destination',
    tableName: 'Destinations',
  }
);

// Las relaciones se configurarán en un archivo separado para evitar dependencias circulares

export default Destination;
