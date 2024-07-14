import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const ProductTypes = {
  TopUp: "TopUp",
};

export const Currencies = {
  CAD: "CAD",
};

export const Product = sequelize.define(
  "Product",
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Currencies.CAD,
    },
    priceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    quoteIdentifiers: false,
    tableName: "products",
  },
);
