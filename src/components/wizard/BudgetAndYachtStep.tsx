import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Ship, Users, AlertCircle } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface BudgetAndYachtStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

import sailingImg from '@/assets/yacht-sailing.jpg';
import motorImg from '@/assets/yacht-motor.jpg';
import megaImg from '@/assets/yacht-mega.jpg';

const yachtTypes = [
  {
    id: 'sailing',
    name: 'Sailing Yacht',
    type: 'sailing',
    image: sailingImg,
    priceMultiplier: 1.0,
    capacity: 12,
    minPrice: 10000,
    maxPrice: 40000,
    description: 'Traditional sailing experience with modern amenities'
  },
  {
    id: 'catamaran',
    name: 'Catamaran',
    type: 'catamaran',
    image: sailingImg,
    priceMultiplier: 1.2,
    capacity: 10,
    minPrice: 12000,
    maxPrice: 35000,
    description: 'Stable, spacious, perfect for families and groups'
  },
  {
    id: 'motor',
    name: 'Motor Yacht',
    type: 'motor',
    image: motorImg,
    priceMultiplier: 1.5,
    capacity: 16,
    minPrice: 15000,
    maxPrice: 80000,
    description: 'Speed and luxury combined for ultimate comfort'
  },
  {
    id: 'mega',
    name: 'Mega Yacht',
    type: 'mega',
    image: megaImg,
    priceMultiplier: 3.0,
    capacity: 24,
    minPrice: 50000,
    maxPrice: 200000,
    description: 'Ultimate luxury experience with full crew and amenities'
  }
];

const BudgetAndYachtStep: React.FC<BudgetAndYachtStepProps> = ({ data, updateData }) => {
  const [budgetRange, setBudgetRange] = useState<[number, number]>(
    data.budgetRange || [20000, 50000]
  );
  const [selectedYacht, setSelectedYacht] = useState(data.yachtType?.id || null);

  // Calculate minimum budget based on previous selections
  const minimumBudget = useMemo(() => {
    const basePrice = data.destination?.basePrice || 15000;
    const duration = data.duration || 7;
    const guests = data.guests || 4;
    
    // Base calculation: basePrice * duration/7 * guest factor
    const guestFactor = Math.max(1, guests / 8);
    return Math.floor((basePrice * (duration / 7) * guestFactor) / 1000) * 1000;
  }, [data.destination, data.duration, data.guests]);

  const handleBudgetChange = (value: [number, number]) => {
    // Ensure minimum budget is respected
    const adjustedValue: [number, number] = [
      Math.max(value[0], minimumBudget),
      Math.max(value[1], minimumBudget)
    ];
    setBudgetRange(adjustedValue);
    updateData({ budgetRange: adjustedValue });
  };

  const handleYachtSelect = (yacht: typeof yachtTypes[0]) => {
    setSelectedYacht(yacht.id);
    updateData({
      yachtType: {
        id: yacht.id,
        name: yacht.name,
        type: yacht.type,
        image: yacht.image,
        priceMultiplier: yacht.priceMultiplier,
        capacity: yacht.capacity
      }
    });
  };

  const isYachtAffordable = (yacht: typeof yachtTypes[0]) => {
    return yacht.minPrice <= budgetRange[1];
  };

  const isYachtSuitable = (yacht: typeof yachtTypes[0]) => {
    return yacht.capacity >= (data.guests || 4);
  };

  const isYachtAvailable = (yacht: typeof yachtTypes[0]) => {
    return isYachtAffordable(yacht) && isYachtSuitable(yacht);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <DollarSign className="h-6 w-6 text-primary" />
            What's your budget range?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Budget Range (USD)</label>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${budgetRange[0].toLocaleString()} - ${budgetRange[1].toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Per week</div>
              </div>
            </div>
            
            <Slider
              value={budgetRange}
              onValueChange={handleBudgetChange}
              max={200000}
              min={minimumBudget}
              step={5000}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${minimumBudget.toLocaleString()}</span>
              <span>$200,000+</span>
            </div>
          </div>

          {minimumBudget > 20000 && (
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-orange-800">Minimum Budget Notice</div>
                <div className="text-orange-700 mt-1">
                  Based on your selections ({data.guests} guests, {data.duration} nights in {data.destination?.region}), 
                  the minimum recommended budget is ${minimumBudget.toLocaleString()}.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Ship className="h-6 w-6 text-primary" />
            Choose your yacht type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {yachtTypes.map((yacht) => {
              const isAffordable = isYachtAffordable(yacht);
              const isSuitable = isYachtSuitable(yacht);
              const isAvailable = isYachtAvailable(yacht);
              
              return (
                <Card
                  key={yacht.id}
                  className={`cursor-pointer group btn-3d transition-all duration-300 hover:scale-105 overflow-hidden ${
                    selectedYacht === yacht.id ? 'ring-2 ring-primary shadow-large' : ''
                  } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => isAvailable && handleYachtSelect(yacht)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={yacht.image}
                      alt={yacht.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">{yacht.name}</h3>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Users className="h-4 w-4" />
                        <span>Up to {yacht.capacity} guests</span>
                      </div>
                    </div>
                    
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-sm font-medium">
                            {!isAffordable && "Outside budget range"}
                            {!isSuitable && "Insufficient capacity"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">{yacht.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price Range:</span>
                        <span className="font-medium">
                          ${yacht.minPrice.toLocaleString()} - ${yacht.maxPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Capacity:</span>
                        <span className="font-medium">{yacht.capacity} guests</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Yacht availability and pricing depend on your guest count and budget range.</p>
            <p>Grayed out yachts are either outside your budget or cannot accommodate your group size.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetAndYachtStep;