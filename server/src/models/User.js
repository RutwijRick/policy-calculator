import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
    class User extends Model {
        toSafeJSON() {
            const { id, email, createdAt } = this.get();
            return { id, email, createdAt };
        }
        async checkPassword(plain) {
            return bcrypt.compare(plain, this.passwordHash);
        }
        async validPassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
    User.init({
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        // Sensitive PII (masked/encrypted at rest)
        nameEnc: { type: DataTypes.TEXT, allowNull: true },
        dobEnc: { type: DataTypes.TEXT, allowNull: true },
        mobileEnc: { type: DataTypes.TEXT, allowNull: true }
    }, { sequelize, modelName: 'User', tableName: 'users' });

    User.beforeCreate(async (user) => {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    });

    return User;
};
