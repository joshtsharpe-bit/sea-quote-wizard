import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Check, ChevronRight } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface NewDestinationStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const destinations = {
  mediterranean: {
    name: 'Mediterranean',
    description: 'Discover ancient history and stunning coastlines',
    basePrice: 15000,
    countries: [
      { name: 'Greece', highlights: ['Santorini', 'Mykonos', 'Crete'] },
      { name: 'Italy', highlights: ['Amalfi Coast', 'Cinque Terre', 'Capri'] },
      { name: 'Croatia', highlights: ['Dubrovnik', 'Split', 'Hvar'] },
      { name: 'Turkey', highlights: ['Bodrum', 'Marmaris', 'Kas'] },
      { name: 'France', highlights: ['French Riviera', 'Monaco', 'Cannes'] }
    ]
  },
  caribbean: {
    name: 'Caribbean',
    description: 'Paradise islands with crystal-clear waters',
    basePrice: 18000,
    countries: [
      { name: 'British Virgin Islands', highlights: ['Tortola', 'Virgin Gorda', 'Anegada'] },
      { name: 'US Virgin Islands', highlights: ['St. Thomas', 'St. John', 'St. Croix'] },
      { name: 'The Grenadines', highlights: ['Bequia', 'Mustique', 'Tobago Cays'] },
      { name: 'Leeward Islands', highlights: ['Antigua', 'St. Lucia', 'Martinique'] }
    ]
  },
  bahamas: {
    name: 'Bahamas',
    description: 'Pristine beaches and swimming pigs',
    basePrice: 16000,
    countries: [
      { name: 'Nassau & Paradise Island', highlights: ['Cable Beach', 'Atlantis', 'Downtown Nassau'] },
      { name: 'Exuma Cays', highlights: ['Swimming Pigs', 'Iguana Beach', 'Thunderball Grotto'] },
      { name: 'Eleuthera', highlights: ['Pink Sand Beach', 'Glass Window Bridge', 'Preacher\'s Cave'] },
      { name: 'Abacos', highlights: ['Hope Town', 'Elbow Cay', 'Marsh Harbour'] }
    ]
  }
};

const NewDestinationStep: React.FC<NewDestinationStepProps> = ({ data, updateData }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleRegionSelect = (regionKey: string) => {
    setSelectedRegion(regionKey);
    setSelectedCountry(null);
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    const region = destinations[selectedRegion as keyof typeof destinations];
    const country = region.countries.find(c => c.name === countryName);
    
    updateData({
      destination: {
        name: `${countryName}, ${region.name}`,
        region: region.name,
        image: '', // We'll use a placeholder for now
        basePrice: region.basePrice
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <MapPin className="h-6 w-6 text-primary" />
            Where do you want to go?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Choose your dream destination for an unforgettable yacht charter experience
          </p>
        </CardContent>
      </Card>

      {!selectedRegion ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(destinations).map(([key, region]) => (
            <Card
              key={key}
              className="glass cursor-pointer group btn-3d transition-all duration-300 hover:scale-105"
              onClick={() => handleRegionSelect(key)}
            >
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-3">{region.name}</h3>
                <p className="text-muted-foreground mb-4">{region.description}</p>
                <div className="text-primary font-semibold">
                  From ${region.basePrice.toLocaleString()}/week
                </div>
                <ChevronRight className="h-5 w-5 mx-auto mt-4 text-primary group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedRegion(null)}
              className="btn-3d"
            >
              ← Back to Regions
            </Button>
            <h2 className="text-xl font-semibold text-foreground">
              Choose your {destinations[selectedRegion as keyof typeof destinations].name} destination
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations[selectedRegion as keyof typeof destinations].countries.map((country) => (
              <Card
                key={country.name}
                className={`glass cursor-pointer group btn-3d transition-all duration-300 hover:scale-105 ${
                  selectedCountry === country.name
                    ? 'ring-2 ring-primary shadow-large'
                    : 'hover:shadow-medium'
                }`}
                onClick={() => handleCountrySelect(country.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground">{country.name}</h3>
                    {selectedCountry === country.name && (
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Popular destinations:</p>
                    <div className="flex flex-wrap gap-2">
                      {country.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDestinationStep;