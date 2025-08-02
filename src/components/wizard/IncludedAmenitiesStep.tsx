import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Crown, Users, Utensils, Shield, Waves, Wind, Snowflake, Check, DollarSign, AlertTriangle } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface IncludedAmenitiesStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const includedAmenities = [
  {
    category: 'Crew & Service',
    icon: Users,
    items: [
      { name: 'Professional Captain', description: 'Licensed and experienced' },
      { name: 'First Mate/Deckhand', description: 'Skilled crew member' },
      { name: 'Chef/Hostess', description: 'Culinary and hospitality service' }
    ]
  },
  {
    category: 'Food & Beverage',
    icon: Utensils,
    items: [
      { name: 'All Meals', description: 'Breakfast, lunch, dinner, and snacks' },
      { name: 'Premium Beverages', description: 'Wine, beer, spirits, and soft drinks' },
      { name: 'Fresh Provisions', description: 'Daily fresh ingredients and supplies' }
    ]
  },
  {
    category: 'Insurance & Safety',
    icon: Shield,
    items: [
      { name: 'Comprehensive Boat Insurance', description: 'Full coverage included' },
      { name: 'Safety Equipment', description: 'Life jackets, emergency gear' },
      { name: 'Navigation Equipment', description: 'GPS, radar, communication systems' }
    ]
  },
  {
    category: 'Water Toys',
    icon: Waves,
    items: [
      { name: 'Snorkeling Gear', description: 'Masks, fins, and snorkels' },
      { name: 'Paddleboards', description: 'Stand-up paddleboards' },
      { name: 'Kayaks', description: 'Sea kayaks for exploration' },
      { name: 'Fishing Equipment', description: 'Basic fishing gear' }
    ]
  },
  {
    category: 'Comfort & Amenities',
    icon: Wind,
    items: [
      { name: 'Premium Linens & Towels', description: 'High-quality bedding and bath linens' },
      { name: 'Beach Towels', description: 'Luxury beach and swim towels' }
    ]
  },
  {
    category: 'Climate Control',
    icon: Snowflake,
    items: [
      { name: 'Full Air Conditioning', description: 'Throughout all cabins and living areas' },
      { name: 'Heating System', description: 'For cooler climates and seasons' }
    ]
  }
];

const bareboatExclusions = [
  'Professional Captain',
  'First Mate/Deckhand', 
  'Chef/Hostess',
  'All Meals',
  'Premium Beverages',
  'Fresh Provisions'
];

const IncludedAmenitiesStep: React.FC<IncludedAmenitiesStepProps> = ({ data, updateData }) => {
  const [isBareboatCharter, setIsBareboatCharter] = useState(data.isBareboatCharter || false);

  const handleBareboatToggle = (checked: boolean) => {
    setIsBareboatCharter(checked);
    updateData({ isBareboatCharter: checked });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Crown className="h-6 w-6 text-primary" />
            Your All-Inclusive Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="w-96">
              <p className="text-muted-foreground text-lg mb-4">
                Everything you need for the perfect charter experience is included
              </p>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Charter Type</h4>
                  <p className="text-sm text-muted-foreground">
                    {isBareboatCharter ? 'Bareboat (self-skippered)' : 'Fully Crewed Charter'}
                  </p>
                  {isBareboatCharter && (
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        Reduced pricing - crew and meal costs not included
                      </span>
                    </div>
                  )}
                </div>
                <Switch
                  checked={isBareboatCharter}
                  onCheckedChange={handleBareboatToggle}
                />
                <span className="text-sm text-muted-foreground">Bareboat</span>
              </div>
            </div>

            {isBareboatCharter && (
              <div className="w-80 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      Bareboat Charter Requirements
                    </h5>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Valid sailing license or certification</li>
                      <li>• Demonstrated sailing experience (log book)</li>
                      <li>• Security deposit required</li>
                      <li>• Responsibility for navigation and boat operation</li>
                      <li>• Must provision own food and beverages</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {includedAmenities.map((category) => (
          <Card key={category.category} className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <category.icon className="h-5 w-5 text-primary" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, index) => {
                  const isExcluded = isBareboatCharter && bareboatExclusions.includes(item.name);
                  return (
                    <div key={index} className={`flex items-start space-x-3 ${isExcluded ? 'opacity-50' : ''}`}>
                      <div className={`mt-1 ${isExcluded ? 'text-muted-foreground' : 'text-primary'}`}>
                        {isExcluded ? '×' : <Check className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium leading-none">
                          {item.name}
                          {isExcluded && <span className="text-destructive ml-2">(Not Included)</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default IncludedAmenitiesStep;