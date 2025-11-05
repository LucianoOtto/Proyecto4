import { sequelize } from '../config/db.mjs'
import { DataTypes, Model } from 'sequelize'

export class Product extends Model {}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  }
)