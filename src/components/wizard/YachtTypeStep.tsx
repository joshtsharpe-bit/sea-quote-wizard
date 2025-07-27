import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, Users, Check } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';
import motorYachtImg from '@/assets/yacht-motor.jpg';
import sailingYachtImg from '@/assets/yacht-sailing.jpg';
import megaYachtImg from '@/assets/yacht-mega.jpg';

interface YachtTypeStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const yachtTypes = [
  {
    name: 'Motor Yacht',
    type: 'motor',
    image: motorYachtImg,
    priceMultiplier: 1.0,
    capacity: 8,
    description: 'Fast and comfortable with modern amenities',
    features: ['High Speed', 'Spacious Decks', 'Modern Interior', 'Easy Handling'],
    length: '50-80 ft'
  },
  {
    name: 'Sailing Yacht',
    type: 'sailing',
    image: sailingYachtImg,
    priceMultiplier: 0.8,
    capacity: 6,
    description: 'Classic elegance with authentic sailing experience',
    features: ['Eco-Friendly', 'Silent Operation', 'Authentic Experience', 'Wind Power'],
    length: '40-70 ft'
  },
  {
    name: 'Mega Yacht',
    type: 'mega',
    image: megaYachtImg,
    priceMultiplier: 2.5,
    capacity: 16,
    description: 'Ultimate luxury with crew and premium services',
    features: ['Full Crew', 'Multiple Decks', 'Luxury Amenities', 'Professional Service'],
    length: '100+ ft'
  }
];

const YachtTypeStep: React.FC<YachtTypeStepProps> = ({ data, updateData }) => {
  const selectYachtType = (yacht: typeof yachtTypes[0]) => {
    updateData({
      yachtType: {
        name: yacht.name,
        type: yacht.type,
        image: yacht.image,
        priceMultiplier: yacht.priceMultiplier,
        capacity: yacht.capacity
      }
    });
  };

  const getEstimatedPrice = (yacht: typeof yachtTypes[0]) => {
    if (!data.destination) return 0;
    return Math.round(data.destination.basePrice * yacht.priceMultiplier);
  };

  return (
    <div>
      <Card className="mb-6 glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-primary" />
            Select Your Yacht Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Choose the perfect yacht that matches your sailing style and group size
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yachtTypes.map((yacht) => (
          <Card
            key={yacht.type}
            className={`cursor-pointer transition-all duration-300 hover:shadow-large group ${
              data.yachtType?.type === yacht.type
                ? 'ring-2 ring-primary shadow-large'
                : 'hover:shadow-medium'
            }`}
            onClick={() => selectYachtType(yacht)}
          >
            <div className="relative overflow-hidden">
              {data.yachtType?.type === yacht.type && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground rounded-full p-2">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <img
                src={yacht.image}
                alt={yacht.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{yacht.name}</h3>
                <p className="text-sm opacity-90">{yacht.length}</p>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">{yacht.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">Up to {yacht.capacity} guests</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {yacht.features.map((feature) => (
                  <span
                    key={feature}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs text-center"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="text-right">
                <span className="text-sm text-muted-foreground">Estimated price</span>
                <div className="text-xl font-bold text-primary">
                  ${getEstimatedPrice(yacht).toLocaleString()}/week
                </div>
                {yacht.priceMultiplier !== 1.0 && (
                  <span className="text-xs text-muted-foreground">
                    {yacht.priceMultiplier > 1 ? '+' : ''}{Math.round((yacht.priceMultiplier - 1) * 100)}% vs base
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YachtTypeStep;