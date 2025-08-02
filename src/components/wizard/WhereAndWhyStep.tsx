import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, PartyPopper, Trophy, Waves, Users, Sparkles, Coffee, Check } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface WhereAndWhyStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

import mediterraneanImg from '@/assets/destination-mediterranean.jpg';
import caribbeanImg from '@/assets/destination-caribbean.jpg';
import fjordsImg from '@/assets/destination-fjords.jpg';

const destinations = {
  mediterranean: {
    name: 'Mediterranean',
    description: 'Ancient history meets stunning coastlines',
    basePrice: 15000,
    image: mediterraneanImg,
    countries: ['Greece', 'Italy', 'Croatia', 'Turkey', 'France']
  },
  caribbean: {
    name: 'Caribbean',
    description: 'Paradise islands with crystal-clear waters',
    basePrice: 18000,
    image: caribbeanImg,
    countries: ['British Virgin Islands', 'US Virgin Islands', 'The Grenadines', 'Leeward Islands']
  },
  bahamas: {
    name: 'Bahamas',
    description: 'Pristine beaches and swimming pigs',
    basePrice: 16000,
    image: fjordsImg,
    countries: ['Nassau & Paradise Island', 'Exuma Cays', 'Eleuthera', 'Abacos']
  }
};

const reasons = [
  { id: 'adventure', label: 'Adventure', icon: Trophy, description: 'Explore new waters and destinations' },
  { id: 'romance', label: 'Romance', icon: Heart, description: 'Intimate moments on the water' },
  { id: 'celebration', label: 'Celebration', icon: PartyPopper, description: 'Special occasions and milestones' },
  { id: 'rest', label: 'Rest & Relaxation', icon: Coffee, description: 'Unwind and recharge' },
  { id: 'water-sports', label: 'Water Sports', icon: Waves, description: 'Diving, snorkeling, and aquatic fun' },
  { id: 'family', label: 'Family Time', icon: Users, description: 'Quality time with loved ones' },
  { id: 'luxury', label: 'Luxury Experience', icon: Sparkles, description: 'Indulge in premium comfort' },
  { id: 'business', label: 'Business Retreat', icon: Trophy, description: 'Corporate events and networking' }
];

const WhereAndWhyStep: React.FC<WhereAndWhyStepProps> = ({ data, updateData }) => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    data.destination ? Object.keys(destinations).find(key => 
      destinations[key as keyof typeof destinations].name === data.destination?.name
    ) || null : null
  );
  const [selectedReasons, setSelectedReasons] = useState<string[]>(data.reasons || []);

  const handleDestinationSelect = (destinationKey: string) => {
    const destination = destinations[destinationKey as keyof typeof destinations];
    setSelectedDestination(destinationKey);
    updateData({
      destination: {
        name: destination.name,
        region: destination.name,
        image: destination.image,
        basePrice: destination.basePrice,
        countries: destination.countries
      }
    });
  };

  const handleReasonToggle = (reasonId: string) => {
    const newReasons = selectedReasons.includes(reasonId)
      ? selectedReasons.filter(r => r !== reasonId)
      : [...selectedReasons, reasonId];
    
    setSelectedReasons(newReasons);
    updateData({ reasons: newReasons });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Where Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <MapPin className="h-6 w-6 text-primary" />
            Where do you want to go?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(destinations).map(([key, destination]) => (
              <Card
                key={key}
                className={`cursor-pointer group btn-3d transition-all duration-300 hover:scale-105 overflow-hidden ${
                  selectedDestination === key ? 'ring-2 ring-primary shadow-large' : ''
                }`}
                onClick={() => handleDestinationSelect(key)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {selectedDestination === key && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm opacity-90">From ${destination.basePrice.toLocaleString()}/week</p>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">{destination.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Why Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Heart className="h-6 w-6 text-primary" />
            What's the occasion?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Select all that apply to help us tailor your experience</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reasons.map((reason) => (
              <Button
                key={reason.id}
                variant={selectedReasons.includes(reason.id) ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 btn-3d ${
                  selectedReasons.includes(reason.id) ? 'bg-primary hover:bg-primary/90' : ''
                }`}
                onClick={() => handleReasonToggle(reason.id)}
              >
                <reason.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{reason.label}</div>
                  <div className="text-xs opacity-80 mt-1">{reason.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhereAndWhyStep;