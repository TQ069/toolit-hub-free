import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume';

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const units: Record<UnitCategory, Record<string, Unit>> = {
  length: {
    meter: {
      name: 'Meter',
      symbol: 'm',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    kilometer: {
      name: 'Kilometer',
      symbol: 'km',
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
    centimeter: {
      name: 'Centimeter',
      symbol: 'cm',
      toBase: (v) => v / 100,
      fromBase: (v) => v * 100,
    },
    millimeter: {
      name: 'Millimeter',
      symbol: 'mm',
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    mile: {
      name: 'Mile',
      symbol: 'mi',
      toBase: (v) => v * 1609.344,
      fromBase: (v) => v / 1609.344,
    },
    yard: {
      name: 'Yard',
      symbol: 'yd',
      toBase: (v) => v * 0.9144,
      fromBase: (v) => v / 0.9144,
    },
    foot: {
      name: 'Foot',
      symbol: 'ft',
      toBase: (v) => v * 0.3048,
      fromBase: (v) => v / 0.3048,
    },
    inch: {
      name: 'Inch',
      symbol: 'in',
      toBase: (v) => v * 0.0254,
      fromBase: (v) => v / 0.0254,
    },
  },
  weight: {
    kilogram: {
      name: 'Kilogram',
      symbol: 'kg',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    gram: {
      name: 'Gram',
      symbol: 'g',
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    milligram: {
      name: 'Milligram',
      symbol: 'mg',
      toBase: (v) => v / 1000000,
      fromBase: (v) => v * 1000000,
    },
    pound: {
      name: 'Pound',
      symbol: 'lb',
      toBase: (v) => v * 0.453592,
      fromBase: (v) => v / 0.453592,
    },
    ounce: {
      name: 'Ounce',
      symbol: 'oz',
      toBase: (v) => v * 0.0283495,
      fromBase: (v) => v / 0.0283495,
    },
    ton: {
      name: 'Metric Ton',
      symbol: 't',
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
  },
  temperature: {
    celsius: {
      name: 'Celsius',
      symbol: '°C',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    fahrenheit: {
      name: 'Fahrenheit',
      symbol: '°F',
      toBase: (v) => (v - 32) * (5 / 9),
      fromBase: (v) => v * (9 / 5) + 32,
    },
    kelvin: {
      name: 'Kelvin',
      symbol: 'K',
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15,
    },
  },
  volume: {
    liter: {
      name: 'Liter',
      symbol: 'L',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    milliliter: {
      name: 'Milliliter',
      symbol: 'mL',
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    gallon: {
      name: 'Gallon (US)',
      symbol: 'gal',
      toBase: (v) => v * 3.78541,
      fromBase: (v) => v / 3.78541,
    },
    quart: {
      name: 'Quart (US)',
      symbol: 'qt',
      toBase: (v) => v * 0.946353,
      fromBase: (v) => v / 0.946353,
    },
    pint: {
      name: 'Pint (US)',
      symbol: 'pt',
      toBase: (v) => v * 0.473176,
      fromBase: (v) => v / 0.473176,
    },
    cup: {
      name: 'Cup (US)',
      symbol: 'cup',
      toBase: (v) => v * 0.236588,
      fromBase: (v) => v / 0.236588,
    },
    fluidOunce: {
      name: 'Fluid Ounce (US)',
      symbol: 'fl oz',
      toBase: (v) => v * 0.0295735,
      fromBase: (v) => v / 0.0295735,
    },
  },
};

const categoryLabels: Record<UnitCategory, string> = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
  volume: 'Volume',
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const handleConvert = (value: string, direction: 'from' | 'to') => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || value === '') {
      setFromValue('');
      setToValue('');
      return;
    }

    if (direction === 'from') {
      setFromValue(value);
      const baseValue = units[category][fromUnit].toBase(numValue);
      const converted = units[category][toUnit].fromBase(baseValue);
      setToValue(formatResult(converted));
    } else {
      setToValue(value);
      const baseValue = units[category][toUnit].toBase(numValue);
      const converted = units[category][fromUnit].fromBase(baseValue);
      setFromValue(formatResult(converted));
    }
  };

  const formatResult = (value: number): string => {
    // Format with appropriate decimal places
    if (Math.abs(value) < 0.0001) {
      return value.toExponential(4);
    }
    if (Math.abs(value) > 1000000) {
      return value.toExponential(4);
    }
    return value.toFixed(6).replace(/\.?0+$/, '');
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const unitKeys = Object.keys(units[newCategory]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setFromValue('');
    setToValue('');
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Unit Converter</CardTitle>
          <CardDescription className="text-sm">
            Convert between different units of measurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(categoryLabels) as UnitCategory[]).map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange(cat)}
                  className="w-full touch-manipulation min-h-[44px]"
                  aria-pressed={category === cat}
                  aria-label={`Select ${categoryLabels[cat]} category`}
                >
                  {categoryLabels[cat]}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversion Interface */}
          <div className="space-y-4">
            {/* From Unit */}
            <div className="space-y-2">
              <Label htmlFor="from-value">From</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="from-value"
                  type="number"
                  value={fromValue}
                  onChange={(e) => handleConvert(e.target.value, 'from')}
                  placeholder="Enter value"
                  className="flex-1"
                  aria-label="Value to convert from"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => {
                    setFromUnit(e.target.value);
                    if (fromValue) handleConvert(fromValue, 'from');
                  }}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[44px] touch-manipulation"
                  aria-label="Unit to convert from"
                >
                  {Object.entries(units[category]).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="rounded-full touch-manipulation min-h-[44px] min-w-[44px]"
                aria-label="Swap units"
              >
                ⇅ Swap
              </Button>
            </div>

            {/* To Unit */}
            <div className="space-y-2">
              <Label htmlFor="to-value">To</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="to-value"
                  type="number"
                  value={toValue}
                  onChange={(e) => handleConvert(e.target.value, 'to')}
                  placeholder="Result"
                  className="flex-1"
                  aria-label="Converted value"
                />
                <select
                  value={toUnit}
                  onChange={(e) => {
                    setToUnit(e.target.value);
                    if (fromValue) handleConvert(fromValue, 'from');
                  }}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[44px] touch-manipulation"
                  aria-label="Unit to convert to"
                >
                  {Object.entries(units[category]).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Result Display */}
          {fromValue && toValue && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-center text-sm">
                  <span className="font-bold">{fromValue}</span>{' '}
                  {units[category][fromUnit].symbol} ={' '}
                  <span className="font-bold">{toValue}</span>{' '}
                  {units[category][toUnit].symbol}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
