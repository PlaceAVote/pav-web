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
  military: 15.8,
  government: 1.92,
  education: 1.85,
  health: 27.76,
  veterans: 4.24,
  housing: 1.67,
  international: 1.08,
  environment: 1.03,
  science: 0.78,
  social: 33.76,
  transport: 2.24,
  food: 3.58,
  other: 1.54,
  debt: 6.04,
};

module.exports = {
  bands: bands,
  sectors: sectors,
};
