import { buildIllustration } from '../src/services/calc.js';

test('builds rows for PT with PPT limits', () => {
    const policy = {
        dob: '1996-01-01', gender: 'M', sumAssured: 5000000,
        modalPremium: 50000, premiumFrequency: 'Yearly',
        pt: 10, ppt: 5
    };
    const rows = buildIllustration(policy, new Date('2025-01-01'));
    expect(rows.length).toBe(10);
    expect(rows[0].premium).toBe(50000);
    expect(rows[6].premium).toBe(0);
    expect(rows[rows.length - 1].fundValue8).toBeGreaterThan(rows[0].fundValue8);
});
