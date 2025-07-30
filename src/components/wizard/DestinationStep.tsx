import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Check } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';
import mediterraneanImg from '@/assets/destination-mediterranean.jpg';
import caribbeanImg from '@/assets/destination-caribbean.jpg';
import fjordsImg from '@/assets/destination-fjords.jpg';

interface DestinationStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const destinations = [
  {
    name: 'Mediterranean',
    region: 'Greek Islands & French Riviera',
    image: mediterraneanImg,
    basePrice: 15000,
    description: 'Discover ancient ruins, crystal-clear waters, and charming coastal towns',
    highlights: ['Santorini', 'Mykonos', 'Monaco', 'Nice']
  },
  {
    name: 'Caribbean',
    region: 'Bahamas & Virgin Islands',
    image: caribbeanImg,
    basePrice: 18000,
    description: 'Paradise islands with pristine beaches and turquoise waters',
    highlights: ['Nassau', 'St. Thomas', 'Tortola', 'St. Maarten']
  },
  {
    name: 'Norwegian Fjords',
    region: 'Arctic Beauty & Northern Lights',
    image: fjordsImg,
    basePrice: 22000,
    description: 'Dramatic landscapes, waterfalls, and stunning natural phenomena',
    highlights: ['Geiranger', 'Flam', 'Alesund', 'Bergen']
  }
];

const DestinationStep: React.FC<DestinationStepProps> = ({ data, updateData }) => {
  const selectDestination = (destination: typeof destinations[0]) => {
    updateData({
      destination: {
        name: destination.name,
        region: destination.region,
        image: destination.image,
        basePrice: destination.basePrice
      }
    });
  };

  return (
    <div>
      <Card className="mb-6 glass border-0 shadow-vintage">
        <CardContent className="p-6">
          <h2 className="text-2xl font-elegant font-semibold text-primary mb-2">
            Choose Your Destination
          </h2>
          <p className="text-muted-foreground">
            Select where you'd like to sail
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <Card
            key={destination.name}
            className={`cursor-pointer transition-all duration-300 hover:shadow-large group ${
              data.destination?.name === destination.name
                ? 'ring-2 ring-primary shadow-large'
                : 'hover:shadow-medium'
            }`}
            onClick={() => selectDestination(destination)}
          >
            <div className="relative overflow-hidden">
              {data.destination?.name === destination.name && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground rounded-full p-2">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{destination.name}</h3>
                <p className="text-sm opacity-90">{destination.region}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{destination.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {destination.highlights.slice(0, 2).join(' • ')}
                </span>
                <span className="text-sm font-medium text-primary">
                  From ${destination.basePrice.toLocaleString()}/week
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestinationStep;