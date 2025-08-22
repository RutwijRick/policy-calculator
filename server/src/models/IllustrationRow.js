import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class IllustrationRow extends Model { }
    IllustrationRow.init({
        policyId: { type: DataTypes.INTEGER, allowNull: false },
        year: { type: DataTypes.INTEGER, allowNull: false },
        age: { type: DataTypes.INTEGER, allowNull: false },
        premium: { type: DataTypes.INTEGER, allowNull: false },
        charges: { type: DataTypes.FLOAT, allowNull: false },
        fundValue4: { type: DataTypes.FLOAT, allowNull: false }, // 4% scenario
        fundValue8: { type: DataTypes.FLOAT, allowNull: false }, // 8% scenario
        deathBenefit: { type: DataTypes.FLOAT, allowNull: false }
    }, { sequelize, modelName: 'IllustrationRow', tableName: 'illustration_rows' });
    return IllustrationRow;
};
