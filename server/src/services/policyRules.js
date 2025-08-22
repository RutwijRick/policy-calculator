import Joi from 'joi';
import { differenceInYears } from './time.js';

export const freqFactor = (f) => ({
    'Yearly': 1,
    'Half-Yearly': 2,
    'Monthly': 12
}[f]);

export const policySchema = Joi.object({
    dob: Joi.date().required(),
    gender: Joi.string().valid('M', 'F', 'O').required(),
    sumAssured: Joi.number().integer().min(1).required(),
    modalPremium: Joi.number().integer().min(10000).max(50000).required(),
    premiumFrequency: Joi.string().valid('Yearly', 'Half-Yearly', 'Monthly').required(),
    pt: Joi.number().integer().min(10).max(20).required(),
    ppt: Joi.number().integer().min(5).max(10).required(),
    policyType: Joi.string().default('ENDOWMENT'),
    riders: Joi.array().items(Joi.object({ type: Joi.string(), amount: Joi.number().integer() })).default([])
}).custom((val, helpers) => {
    if (val.pt <= val.ppt) return helpers.error('any.invalid', { msg: 'PT must be greater than PPT' });
    const annualPrem = val.modalPremium * freqFactor(val.premiumFrequency);
    const minSA = Math.max(annualPrem * 10, 5000000);
    if (val.sumAssured < minSA) return helpers.error('any.invalid', { msg: `Sum Assured must be >= ${minSA}` });

    const age = differenceInYears(new Date(), new Date(val.dob));
    if (age < 23 || age > 56) return helpers.error('any.invalid', { msg: 'Age must be between 23 and 56' });
    return val;
});
