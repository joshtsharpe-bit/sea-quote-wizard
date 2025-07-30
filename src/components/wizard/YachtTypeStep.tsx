import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Anchor, Users, Check, AlertTriangle } from 'lucide-react';
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
    name: 'Power Yacht',
    type: 'power',
    image: motorYachtImg,
    priceMultiplier: 1.0,
    capacity: 8,
    description: 'Fast and comfortable with modern amenities',
    features: ['High Speed', 'Spacious Decks', 'Modern Interior', 'Easy Handling'],
    length: '50-80 ft'
  },
  {
    name: 'Power Cat',
    type: 'powercat',
    image: motorYachtImg,
    priceMultiplier: 1.2,
    capacity: 10,
    description: 'Stable catamaran with power and space',
    features: ['Stable Platform', 'Shallow Draft', 'Spacious Layout', 'Fast Cruising'],
    length: '45-65 ft'
  },
  {
    name: 'Sailing Cat',
    type: 'sailingcat',
    image: sailingYachtImg,
    priceMultiplier: 0.9,
    capacity: 10,
    description: 'Spacious sailing catamaran for comfort',
    features: ['Stability', 'Large Living Space', 'Shallow Waters', 'Eco-Friendly'],
    length: '40-60 ft'
  },
  {
    name: 'Mega Yacht',
    type: 'mega',
    image: megaYachtImg,
    priceMultiplier: 2.5,
    capacity: 20,
    description: 'Ultimate luxury with crew and premium services',
    features: ['Full Crew', 'Multiple Decks', 'Luxury Amenities', 'Professional Service'],
    length: '100+ ft'
  },
  {
    name: 'Sail Monohull',
    type: 'sailmono',
    image: sailingYachtImg,
    priceMultiplier: 0.7,
    capacity: 8,
    description: 'Classic sailing yacht for authentic experience',
    features: ['Traditional Sailing', 'Intimate Setting', 'Eco-Friendly', 'Pure Sailing'],
    length: '35-55 ft'
  }
];

const YachtTypeStep: React.FC<YachtTypeStepProps> = ({ data, updateData }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [attemptedYacht, setAttemptedYacht] = useState<typeof yachtTypes[0] | null>(null);

  const selectYachtType = (yacht: typeof yachtTypes[0]) => {
    // Check if guests > 12 and yacht is not mega yacht
    if (data.guests > 12 && yacht.type !== 'mega') {
      setAttemptedYacht(yacht);
      setShowWarning(true);
      return;
    }

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

  const handleReduceGuests = () => {
    updateData({ guests: 12 });
    if (attemptedYacht) {
      selectYachtType(attemptedYacht);
    }
    setShowWarning(false);
    setAttemptedYacht(null);
  };

  const getEstimatedPrice = (yacht: typeof yachtTypes[0]) => {
    if (!data.destination) return 0;
    return Math.round(data.destination.basePrice * yacht.priceMultiplier);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Guests Selection */}
      <Card className="mb-6 glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            How many guests?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Select the number of guests for your charter
              </p>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {data.guests} guest{data.guests > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Slider
                value={[data.guests]}
                onValueChange={(value) => updateData({ guests: value[0] })}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span>10</span>
                <span>20</span>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 glass border-0 shadow-vintage">
        <CardContent className="p-6">
          <h2 className="text-2xl font-elegant font-semibold text-primary mb-2">
            Select Your Yacht
          </h2>
          <p className="text-muted-foreground">
            Choose your preferred yacht style
          </p>
        </CardContent>
      </Card>

      {/* Warning Modal */}
      {showWarning && (
        <Card className="mb-6 glass border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Group Size Too Large
                </h3>
                <p className="text-muted-foreground mb-4">
                  With {data.guests} guests, you'll need a Mega Yacht or consider tandem charters. 
                  You can reduce your group size to 12 guests or speak with our broker about tandem charter options.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleReduceGuests}
                    variant="outline"
                    className="btn-3d"
                  >
                    Reduce to 12 Guests
                  </Button>
                  <Button
                    onClick={() => setShowWarning(false)}
                    variant="outline"
                    className="btn-3d"
                  >
                    Speak to Broker
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{yacht.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-3 w-3 text-primary" />
                <span className="text-sm">Up to {yacht.capacity} guests</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {yacht.features.slice(0, 2).join(' • ')}
                </span>
                <span className="text-sm font-medium text-primary">
                  ${getEstimatedPrice(yacht).toLocaleString()}/week
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YachtTypeStep;