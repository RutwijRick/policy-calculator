import { differenceInYears } from './time.js';

const mortalityRate = (age) => {
    if (age <= 30) return 1.2;
    if (age <= 40) return 1.8;
    if (age <= 50) return 3.0;
    return 4.5; // up to 56
};

export const buildIllustration = (policy, asOfDate = new Date()) => {
    const startAge = differenceInYears(asOfDate, new Date(policy.dob));
    const f = policy.premiumFrequency === 'Yearly' ? 1 : (policy.premiumFrequency === 'Half-Yearly' ? 2 : 12);
    const annualRates = [0.04, 0.08];
    let fund4 = 0, fund8 = 0;

    const rows = [];
    for (let y = 1; y <= policy.pt; y++) {
        const age = startAge + y - 1;
        const prem = (y <= policy.ppt) ? policy.modalPremium * f : 0;

        const mort = ((mortalityRate(age) * policy.sumAssured) / 1000);
        const alloc = Math.max(prem - mort, 0);

        fund4 = (fund4 + alloc) * (1 + annualRates[0]);
        fund8 = (fund8 + alloc) * (1 + annualRates[1]);

        const deathBenefit4 = Math.max(policy.sumAssured, fund4);
        // Use the same death benefit for table simplicity (could compute separately), show against 8% fund
        const row = {
            year: y,
            age,
            premium: prem,
            charges: Number(mort.toFixed(2)),
            fundValue4: Number(fund4.toFixed(2)),
            fundValue8: Number(fund8.toFixed(2)),
            deathBenefit: Number(deathBenefit4.toFixed(2))
        };
        rows.push(row);
    }
    return rows;
};

export const calculateIRR = (cashflows, guess = 0.1) => {
    const maxIterations = 1000;
    const precision = 1e-7;
    let rate = guess;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;

        for (let t = 0; t < cashflows.length; t++) {
            npv += cashflows[t] / Math.pow(1 + rate, t);
            if (t !== 0) {
                derivative += -t * cashflows[t] / Math.pow(1 + rate, t + 1);
            }
        }

        const newRate = rate - npv / derivative;
        if (Math.abs(newRate - rate) <= precision) {
            return (newRate * 100).toFixed(2); // return in %
        }
        rate = newRate;
    }

    return (rate * 100).toFixed(2); 
}