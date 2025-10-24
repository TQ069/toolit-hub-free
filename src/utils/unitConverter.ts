export type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume';

interface ConversionUnit {
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const conversions: Record<UnitCategory, Record<string, ConversionUnit>> = {
  length: {
    meter: { toBase: (v) => v, fromBase: (v) => v },
    kilometer: { toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    foot: { toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    mile: { toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    kilogram: { toBase: (v) => v, fromBase: (v) => v },
    gram: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    pound: { toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  },
  temperature: {
    celsius: { toBase: (v) => v, fromBase: (v) => v },
    fahrenheit: { toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    kelvin: { toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  volume: {
    liter: { toBase: (v) => v, fromBase: (v) => v },
    milliliter: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    gallon: { toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  },
};

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: UnitCategory
): number {
  const categoryConversions = conversions[category];
  if (!categoryConversions[fromUnit] || !categoryConversions[toUnit]) {
    throw new Error('Invalid unit');
  }

  const baseValue = categoryConversions[fromUnit].toBase(value);
  return categoryConversions[toUnit].fromBase(baseValue);
}
