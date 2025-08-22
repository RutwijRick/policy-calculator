import { Sequelize } from 'sequelize';
import userDef from './User.js';
import policyDef from './Policy.js';
import rowDef from './IllustrationRow.js';
import sequelize from "../config/db.js";

const User = userDef(sequelize);
const Policy = policyDef(sequelize);
const IllustrationRow = rowDef(sequelize);

User.hasMany(Policy, { foreignKey: 'userId' });
Policy.belongsTo(User, { foreignKey: 'userId' });

Policy.hasMany(IllustrationRow, { foreignKey: 'policyId' });
IllustrationRow.belongsTo(Policy, { foreignKey: 'policyId' });

export { sequelize, User, Policy, IllustrationRow };
