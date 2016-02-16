var threshold = require('./tax_threshold.js');
var bands = threshold.bands;
var sectors = threshold.sectors;

/**
 * Give an income bracket and the income return the
 * anual contribution.
 */
function generateContrubtion(income, bracket) {
  return {
    percentage: bracket.percentage,
    total: Math.round((income / 100) * bracket.percentage + bracket.fixed),
  };
}

/**
 * Given an income and a sector determine how much
 * the tax payer would pay per month.
 *
 * @param {Int} income - USD.
 * @param {String} sector - references sectors in tax_threshold.js
 * @param {Int} contribution - USD.
 */
function monthlyContributionToSector(income, sector) {
  var sectorPecentage = sectors[sector].percentage;
  var contribution = getTaxContributation(income);
  // TODO Patch the contribution based on doc. provided
  // where percentage === 103
  var sum = ((contribution.total / 100) * sectorPecentage) / 12;
  var monthly = Math.round(sum * 100) / 100;
  return monthly;
}

/**
 * Given an Income return an array of monthly contributions to each sectoror.
 * @param {Int} income - USD.
 * @returns {Object[]} monthly contributions
 */
function getAllMonthlyContributions(income) {
  var sects = Object.keys(sectors);
  var contributions = [];
  for (var i = 0; i < sects.length; i++) {
    var sector = sects[i];
    var monthly = {
      bill_id: sectors[sector].bill_id,
      name: sectors[sector].name,
      contribution: monthlyContributionToSector(income, sector),
    };
    contributions.push(monthly);
  }
  return contributions;
}

/**
 * Given an income, return the tax contribution
 * per year.
 * @param {Int} income - in USD.
 * @returns {Object} contribution.
 * @return {Int} contribution.percentage - What percentage of the income is paid in tax contribution.
 * @return {Int} contribution.total - The amount of USD spent on tax: percentage plus fixed amount.
 */
function getTaxContributation(income) {
  income = income || 0;


  if (income >= bands.a.min && bands.a.max >= income) {
    return generateContrubtion(income, bands.a);
  }

  if (income >= bands.b.min && bands.b.max >= income) {
    return generateContrubtion(income, bands.b);
  }

  if (income >= bands.c.min && bands.c.max >= income) {
    return generateContrubtion(income, bands.c);
  }

  if (income >= bands.d.min && bands.d.max >= income) {
    return generateContrubtion(income, bands.d);
  }

  if (income >= bands.e.min && bands.e.max >= income) {
    return generateContrubtion(income, bands.e);
  }

  if (income >= bands.f.min && bands.f.max >= income) {
    return generateContrubtion(income, bands.f);
  }

  return generateContrubtion(income, bands.g);
}

/**
 *  A calculator to determine tax contributions.
 */
function taxCalculator() {
  return {
    getTaxContributation: getTaxContributation,
    monthlyContributionToSector: monthlyContributionToSector,
    getAllMonthlyContributions: getAllMonthlyContributions,
  };
}

module.exports = taxCalculator;
