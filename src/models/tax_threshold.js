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
    bill_id: 'hr1303-114',
  },
  government: {
    percentage: 1.92,
    name: 'Government',
    bill_id: 's19-114',
  },
  education: {
    percentage: 1.85,
    name: 'Education',
    bill_id: 'hr4260-114',
  },
  health: {
    percentage: 27.76,
    name: 'Medicare & Health',
    bill_id: 'hr676-114',
  },
  veterans: {
    percentage: 4.24,
    name: 'Veteran\'s Benefits',
    bill_id: 'hr4352-114',
  },
  housing: {
    percentage: 1.67,
    name: 'Housing & Community',
    bill_id: 's487-114',
  },
  international: {
    percentage: 1.08,
    name: 'International Affairs',
    bill_id: 'hr2847-114',
  },
  environment: {
    percentage: 1.03,
    name: 'Energy & Environments',
    bill_id: 'hr28-114',
  },
  science: {
    percentage: 0.78,
    name: 'Science',
    bill_id: 'hr2093-114',
  },
  social: {
    percentage: 33.76,
    name: 'Social Security, Unemployment, Labor',
    bill_id: 'hres393-114',
  },
  transport: {
    percentage: 2.24,
    name: 'Transporation',
    bill_id: 's981-114',
  },
  food: {
    percentage: 3.58,
    name: 'Food & Agriculture',
    bill_id: 'hr4226-114',
  },
  // other: {
  //   percentage: 1.54,
  //   name: 'Other',
  //   bill_id: '',
  // },
  // debt: {
  //   percentage: 6.04,
  //   name: 'Debt',
  //   bill_id: '',
  // },
};

module.exports = {
  bands: bands,
  sectors: sectors,
};
