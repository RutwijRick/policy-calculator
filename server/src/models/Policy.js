import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Policy extends Model { }
    Policy.init({
        userId: { type: DataTypes.INTEGER, allowNull: false },
        policyType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ENDOWMENT' },
        dob: { type: DataTypes.DATEONLY, allowNull: false }, // also stored encrypted in user if needed
        gender: { type: DataTypes.ENUM('Male', 'Female', 'Others'), allowNull: false },
        sumAssured: { type: DataTypes.INTEGER, allowNull: false },
        modalPremium: { type: DataTypes.INTEGER, allowNull: false },
        premiumFrequency: { type: DataTypes.ENUM('Yearly', 'Half-Yearly', 'Monthly'), allowNull: false },
        pt: { type: DataTypes.INTEGER, allowNull: false },  // Policy Term
        ppt: { type: DataTypes.INTEGER, allowNull: false }, // Premium Paying Term
        riders: { type: DataTypes.JSON, allowNull: true }   // e.g., [{type:'ADDB', amount:500000}]
    }, { sequelize, modelName: 'Policy', tableName: 'policies' });
    return Policy;
};
