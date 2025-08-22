import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Policy extends Model { }
    Policy.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        policyType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ENDOWMENT' },
        dob: { type: DataTypes.DATEONLY, allowNull: false },
        gender: { type: DataTypes.ENUM('Male', 'Female', 'Others'), allowNull: false },
        sumAssured: { type: DataTypes.INTEGER, allowNull: false },
        modalPremium: { type: DataTypes.INTEGER, allowNull: false },
        premiumFrequency: { type: DataTypes.ENUM('Yearly', 'Half-Yearly', 'Monthly'), allowNull: false },
        pt: { type: DataTypes.INTEGER, allowNull: false }, 
        ppt: { type: DataTypes.INTEGER, allowNull: false },
        riders: { type: DataTypes.JSON, allowNull: true }
    }, { sequelize, modelName: 'Policy', tableName: 'policies' });
    return Policy;
};
