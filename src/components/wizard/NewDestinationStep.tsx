import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Check, ChevronRight } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface NewDestinationStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

import mediterraneanImg from '@/assets/destination-mediterranean.jpg';
import caribbeanImg from '@/assets/destination-caribbean.jpg';
import fjordsImg from '@/assets/destination-fjords.jpg';

const destinations = {
  mediterranean: {
    name: 'Mediterranean',
    description: 'Discover ancient history and stunning coastlines',
    basePrice: 15000,
    image: mediterraneanImg,
    countries: [
      { name: 'Greece', highlights: ['Santorini', 'Mykonos', 'Crete'], image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400' },
      { name: 'Italy', highlights: ['Amalfi Coast', 'Cinque Terre', 'Capri'], image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400' },
      { name: 'Croatia', highlights: ['Dubrovnik', 'Split', 'Hvar'], image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400' },
      { name: 'Turkey', highlights: ['Bodrum', 'Marmaris', 'Kas'], image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400' },
      { name: 'France', highlights: ['French Riviera', 'Monaco', 'Cannes'], image: 'https://images.unsplash.com/photo-1549211715-6e67d7c68e5a?w=400' }
    ]
  },
  caribbean: {
    name: 'Caribbean',
    description: 'Paradise islands with crystal-clear waters',
    basePrice: 18000,
    image: caribbeanImg,
    countries: [
      { name: 'British Virgin Islands', highlights: ['Tortola', 'Virgin Gorda', 'Anegada'], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
      { name: 'US Virgin Islands', highlights: ['St. Thomas', 'St. John', 'St. Croix'], image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400' },
      { name: 'The Grenadines', highlights: ['Bequia', 'Mustique', 'Tobago Cays'], image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
      { name: 'Leeward Islands', highlights: ['Antigua', 'St. Lucia', 'Martinique'], image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=400' }
    ]
  },
  bahamas: {
    name: 'Bahamas',
    description: 'Pristine beaches and swimming pigs',
    basePrice: 16000,
    image: fjordsImg,
    countries: [
      { name: 'Nassau & Paradise Island', highlights: ['Cable Beach', 'Atlantis', 'Downtown Nassau'], image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400' },
      { name: 'Exuma Cays', highlights: ['Swimming Pigs', 'Iguana Beach', 'Thunderball Grotto'], image: 'https://images.unsplash.com/photo-1541438876747-7ed2be3e9dd1?w=400' },
      { name: 'Eleuthera', highlights: ['Pink Sand Beach', 'Glass Window Bridge', 'Preacher\'s Cave'], image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400' },
      { name: 'Abacos', highlights: ['Hope Town', 'Elbow Cay', 'Marsh Harbour'], image: 'https://images.unsplash.com/photo-1571843395-b7ae96f27ef8?w=400' }
    ]
  }
};

const NewDestinationStep: React.FC<NewDestinationStepProps> = ({ data, updateData }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleRegionSelect = (regionKey: string) => {
    setSelectedRegion(regionKey);
    setSelectedCountries([]);
  };

  const handleCountrySelect = (countryName: string) => {
    const region = destinations[selectedRegion as keyof typeof destinations];
    const country = region.countries.find(c => c.name === countryName);
    
    if (selectedCountries.includes(countryName)) {
      // Remove country
      const newCountries = selectedCountries.filter(c => c !== countryName);
      setSelectedCountries(newCountries);
      
      if (newCountries.length === 0) {
        updateData({ destination: null });
      } else {
        updateData({
          destination: {
            name: newCountries.length === 1 ? `${newCountries[0]}, ${region.name}` : `${newCountries.length} destinations in ${region.name}`,
            region: region.name,
            image: country?.image || region.image,
            basePrice: region.basePrice,
            countries: newCountries
          }
        });
      }
    } else if (selectedCountries.length < 3) {
      // Add country
      const newCountries = [...selectedCountries, countryName];
      setSelectedCountries(newCountries);
      
      updateData({
        destination: {
          name: newCountries.length === 1 ? `${countryName}, ${region.name}` : `${newCountries.length} destinations in ${region.name}`,
          region: region.name,
          image: country?.image || region.image,
          basePrice: region.basePrice,
          countries: newCountries
        }
      });
    }
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
              className="glass cursor-pointer group btn-3d transition-all duration-300 hover:scale-105 overflow-hidden"
              onClick={() => handleRegionSelect(key)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{region.name}</h3>
                  <p className="text-sm opacity-90">From ${region.basePrice.toLocaleString()}/week</p>
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">{region.description}</p>
                <ChevronRight className="h-5 w-5 mx-auto text-primary group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedRegion(null)}
                className="btn-3d"
              >
                ← Back to Regions
              </Button>
              <h2 className="text-xl font-semibold text-foreground">
                Choose up to 3 destinations in {destinations[selectedRegion as keyof typeof destinations].name}
              </h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedCountries.length}/3 selected
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations[selectedRegion as keyof typeof destinations].countries.map((country) => (
              <Card
                key={country.name}
                className={`glass cursor-pointer group btn-3d transition-all duration-300 hover:scale-105 overflow-hidden ${
                  selectedCountries.includes(country.name)
                    ? 'ring-2 ring-primary shadow-large'
                    : 'hover:shadow-medium'
                } ${selectedCountries.length >= 3 && !selectedCountries.includes(country.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleCountrySelect(country.name)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {selectedCountries.includes(country.name) && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg font-bold">{country.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">Popular spots:</p>
                    <div className="flex flex-wrap gap-2">
                      {country.highlights.slice(0, 3).map((highlight) => (
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