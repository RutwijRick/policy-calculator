import { Policy, IllustrationRow } from '../models/index.js';
import { calculateIRR } from '../services/calc.js';

export const calculateIllustration = async (req, res) => {
    try {
        const { age, premium, policyTerm, rider, fundGrowthRate } = req.body;

        if (age < 18 || age > 65) {
            return res.status(400).json({ error: "Age must be between 18 and 65" });
        }
        if (premium <= 0) {
            return res.status(400).json({ error: "Premium must be greater than 0" });
        }
        if (policyTerm < 5 || policyTerm > 30) {
            return res.status(400).json({ error: "Policy term must be between 5 and 30 years" });
        }

        const mortalityRate = 0.001 * (age / 30); // higher age → higher mortality
        const riderCharge = rider ? premium * 0.05 : 0; // 5% of premium
        const netPremium = premium - riderCharge;

        let fundValue = 0;
        const yearlyProjection = [];

        for (let year = 1; year <= policyTerm; year++) {
            // Net premium gets added to fund
            fundValue += netPremium;

            // Growth
            fundValue *= 1 + (fundGrowthRate / 100);

            // Mortality deduction
            const mortalityCharge = fundValue * mortalityRate;
            fundValue -= mortalityCharge;

            yearlyProjection.push({
                year,
                premiumPaid: premium,
                riderCharge,
                mortalityCharge: mortalityCharge.toFixed(2),
                fundValue: fundValue.toFixed(2),
            });
        }

        res.json({
            summary: {
                totalPremiumPaid: premium * policyTerm,
                totalFundValue: fundValue.toFixed(2),
            },
            illustration: yearlyProjection,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Calculation failed' });
    }
};

export const calculateBenefit = async (req, res) => {
    try {
        const { age, policyTerm, premiumTerm, sumAssured, frequency } = req.body;

        if (age < 18 || age > 65) {
            return res.status(400).json({ error: "Age must be between 18 and 65 years" });
        }

        if (policyTerm < 5 || policyTerm > 30) {
            return res.status(400).json({ error: "Policy term must be between 5 and 30 years" });
        }

        if (premiumTerm > policyTerm) {
            return res.status(400).json({ error: "Premium payment term cannot exceed policy term" });
        }

        if (sumAssured < 100000 || sumAssured > 10000000) {
            return res.status(400).json({ error: "Sum Assured must be between 1L and 1Cr" });
        }

        const validFrequencies = ["Yearly", "Half-Yearly", "Quarterly", "Monthly"];
        if (!validFrequencies.includes(frequency)) {
            return res.status(400).json({ error: "Invalid premium frequency" });
        }

        // === Example Calculation ===
        const premium =
            (sumAssured / policyTerm) *
            (frequency === "Yearly"
                ? 1
                : frequency === "Half-Yearly"
                    ? 0.52
                    : frequency === "Quarterly"
                        ? 0.27
                        : 0.09);

        const totalPremium = premium * premiumTerm;

        const maturityValue = sumAssured + totalPremium * 0.05; // sample logic

        return res.json({
            age,
            policyTerm,
            premiumTerm,
            sumAssured,
            frequency,
            premium,
            totalPremium,
            maturityValue,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Calculation failed" });
    }
};

export const generateIllustration = async (req, res) => {
    try {
        const { policyId } = req.params;
        const policy = await Policy.findByPk(policyId);
        if (!policy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        const riders = Array.isArray(policy.riders)
            ? policy.riders
            : typeof policy.riders === "string" && policy.riders.startsWith("[")
                ? JSON.parse(policy.riders)
                : policy.riders
                    ? [policy.riders]
                    : [];

        const getFrequencyFactor = (frequency) => {
            switch (frequency) {
                case "Yearly": return 1;
                case "Half-Yearly": return 2;
                default: return 12; // Monthly
            }
        };

        const bonusRates = {
            1: 0.025, 2: 0.03, 3: 0.035, 4: 0.035, 5: 0.035,
            6: 0.035, 7: 0.03, 8: 0.03, 9: 0.03, 10: 0.03,
            11: 0.03, 12: 0.025, 13: 0.03, 14: 0.03, 15: 0.025,
            16: 0.05, 17: 0.04, 18: 0.045, 19: 0.04, 20: 0.25,
        };

        const getBonusRate = (year) => bonusRates[year] || 0.03;

        // Age factor (simplified: higher age reduces benefit growth)
        const getAgeFactor = (dob) => {
            const birthYear = new Date(dob).getFullYear();
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;

            if (age < 30) return 1.1;   // young policyholder → higher growth
            if (age < 45) return 1.0;   // neutral
            if (age < 60) return 0.9;   // reduced growth
            return 0.8;                 // senior → much reduced
        };

        const calculateRiderBenefit = (riders, sumAssured, premium) => {
            let total = 0;
            riders.forEach(rider => {
                switch (rider) {
                    case "Accident Cover":
                        // Example: 50% of Sum Assured
                        total += sumAssured * 0.5;
                        break;
                    case "Disability Benefit":
                        // Example: 10% of yearly premium
                        total += premium * 0.1;
                        break;
                    default:
                        break;
                }
            });
            return total;
        };

        const calculateRiderPremium = (riders, basePremium) => {
            let total = 0;
            riders.forEach(rider => {
                switch (rider) {
                    case "Accident Cover":
                        // Example: 5% extra of base premium
                        total += basePremium * 0.05;
                        break;
                    case "Disability Benefit":
                        // Example: flat +2% of base premium
                        total += basePremium * 0.02;
                        break;
                    default:
                        break;
                }
            });
            return total;
        };

        const calculateMaturityBenefit = (policy, bonusRate, ageFactor, riderBenefit) => {
            return (
                (policy.sumAssured * 2 * ageFactor) +
                (policy.sumAssured * bonusRate * policy.pt * ageFactor) +
                riderBenefit
            );
        };

        // --- Main calculations ---
        const freqFactor = getFrequencyFactor(policy.premiumFrequency);
        const ageFactor = getAgeFactor(policy.dob);

        let totalPremium = 0;
        let maturityBenefit = 0;
        let cashflows = [0];
        let illustration = [];

        for (let year = 1; year <= policy.pt; year++) {
            // Base premium
            let basePremium = year <= policy.ppt ? policy.modalPremium * freqFactor : 0;

            // Rider premium (depends on riders & base premium)
            let riderPremium = year <= policy.ppt ? calculateRiderPremium(riders, basePremium) : 0;

            // Total premium
            let premium = basePremium + riderPremium;

            // Bonus
            const bonusRate = getBonusRate(year);
            const bonusAmount = policy.sumAssured * bonusRate * ageFactor;

            // Rider benefit (only realized at maturity in this example)
            let riderBenefit = 0;
            let benefit = 0;
            if (year === policy.pt) {
                riderBenefit = calculateRiderBenefit(riders, policy.sumAssured, basePremium);
                benefit = calculateMaturityBenefit(policy, bonusRate, ageFactor, riderBenefit);
                maturityBenefit = benefit;
            }

            // Net cashflow
            const netCashflow = benefit - premium;

            illustration.push({
                year,
                premium,
                sumAssured: year === policy.pt ? policy.sumAssured : 0,
                bonusRate: (bonusRate * 100).toFixed(2) + "%",
                bonusAmount: bonusAmount.toFixed(2),
                riderPremium,
                riderBenefit,
                totalBenefit: benefit,
                netCashflow,
            });

            totalPremium += premium;
            cashflows.push(netCashflow);
        }

        const irr = calculateIRR(cashflows);

        res.json({
            summary: {
                totalPremiumPaid: totalPremium,
                maturityBenefit,
            },
            illustration,
            irr: (irr * 100).toFixed(2) + "%",
            riders,
        });

    } catch (err) {
        console.error("Error generating illustration:", err);
        res.status(500).json({ error: "Server error generating illustration" });
    }
};


function calculateRiderBenefit(riders, sumAssured, premium) {
  let totalRiderBenefit = 0;

  riders.forEach(rider => {
    switch (rider) {
      case "Accident Cover":
        // Example: 50% of Sum Assured as accident benefit
        totalRiderBenefit += sumAssured * 0.5;
        break;

      case "Disability Benefit":
        // Example: 10% of premium * policy term
        totalRiderBenefit += premium * 0.1;
        break;

      // Add more rider rules here
      default:
        break;
    }
  });

  return totalRiderBenefit;
}