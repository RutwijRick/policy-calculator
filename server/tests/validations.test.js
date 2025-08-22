import { policySchema } from '../src/services/policyRules.js';

test('rejects when PT <= PPT', () => {
    const { error } = policySchema.validate({
        dob: '1995-01-01', gender: 'M', sumAssured: 5000000, modalPremium: 20000,
        premiumFrequency: 'Yearly', pt: 5, ppt: 5
    });
    expect(error).toBeTruthy();
});

test('rejects premium outside range', () => {
    const { error } = policySchema.validate({
        dob: '1995-01-01', gender: 'M', sumAssured: 5000000, modalPremium: 80000,
        premiumFrequency: 'Yearly', pt: 12, ppt: 8
    });
    expect(error).toBeTruthy();
});
