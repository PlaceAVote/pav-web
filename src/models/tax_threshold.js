var bands = {
  a: {
    min: 0,
    max: 9275,
    fixed: 0,
    percentage: 10,
  },
  b: {
    min: 9276,
    max: 37650,
    fixed: 927.50,
    percentage: 15,
  },
  c: {
    min: 37651,
    max: 91150,
    fixed: 5183.75,
    percentage: 25,
  },
  d: {
    min: 91151,
    max: 190150,
    fixed: 18558.75,
    percentage: 28,
  },
  e: {
    min: 190151,
    max: 413350,
    fixed: 46278.75,
    percentage: 33,
  },
  f: {
    min: 413351,
    max: 415050,
    fixed: 119934.75,
    percentage: 35,
  },
  g: {
    min: 415051,
    max: 999999999999,
    fixed: 120529.75,
    percentage: 39.60,
  },
};

var sectors =  {
  military: {
    percentage: 15.8,
    name: 'Military',
  },
  government: {
    percentage: 1.92,
    name: 'Government',
  },
  education: {
    percentage: 1.85,
    name: 'Education',
  },
  health: {
    percentage: 27.76,
    name: 'Medicare & Health',
  },
  veterans: {
    percentage: 4.24,
    name: 'Veteran\'s Benefits',
  },
  housing: {
    percentage: 1.67,
    name: 'Housing & Community',
  },
  international: {
    percentage: 1.08,
    name: 'International Affairs',
  },
  environment: {
    percentage: 1.03,
    name: 'Energy & Environments',
  },
  science: {
    percentage: 0.78,
    name: 'Science',
  },
  social: {
    percentage: 33.76,
    name: 'Social Security, Unemployment, Labor',
  },
  transport: {
    percentage: 2.24,
    name: 'Transporation',
  },
  food: {
    percentage: 3.58,
    name: 'Food & Agriculture',
  },
  other: {
    percentage: 1.54,
    name: 'Other',
  },
  debt: {
    percentage: 6.04,
    name: 'Debt',
  },
};

module.exports = {
  bands: bands,
  sectors: sectors,
};
