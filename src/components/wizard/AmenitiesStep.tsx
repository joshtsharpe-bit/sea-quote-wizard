import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Utensils, Music, Waves, Wifi, Wine, Car, Plane } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface AmenitiesStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const amenityCategories = [
  {
    title: 'Culinary & Dining',
    icon: Utensils,
    amenities: [
      { id: 'chef', name: 'Private Chef', price: 200, description: 'Professional chef for all meals' },
      { id: 'gourmet', name: 'Gourmet Provisions', price: 150, description: 'Premium food and beverages' },
      { id: 'wine', name: 'Wine Selection', price: 100, description: 'Curated wine collection' },
      { id: 'bbq', name: 'BBQ Equipment', price: 50, description: 'Deck barbecue setup' }
    ]
  },
  {
    title: 'Entertainment',
    icon: Music,
    amenities: [
      { id: 'sound', name: 'Premium Sound System', price: 75, description: 'High-quality audio throughout' },
      { id: 'tv', name: 'Entertainment System', price: 100, description: 'Large screens and streaming' },
      { id: 'games', name: 'Water Sports Equipment', price: 300, description: 'Jet skis, paddleboards, snorkeling gear' },
      { id: 'fishing', name: 'Fishing Equipment', price: 150, description: 'Professional fishing gear' }
    ]
  },
  {
    title: 'Comfort & Luxury',
    icon: Star,
    amenities: [
      { id: 'ac', name: 'Climate Control', price: 100, description: 'Full air conditioning system' },
      { id: 'wifi', name: 'Starlink Internet', price: 50, description: 'High-speed satellite internet' },
      { id: 'spa', name: 'Spa Services', price: 400, description: 'Onboard massage and wellness' },
      { id: 'linens', name: 'Premium Linens', price: 75, description: 'Luxury bedding and towels' }
    ]
  },
  {
    title: 'Transportation',
    icon: Car,
    amenities: [
      { id: 'tender', name: 'Tender Boat', price: 200, description: 'Smaller boat for shore excursions' },
      { id: 'pickup', name: 'Airport Pickup', price: 150, description: 'Luxury transport to marina' },
      { id: 'helicopter', name: 'Helicopter Tour', price: 1500, description: 'Aerial sightseeing experience' },
      { id: 'concierge', name: 'Concierge Service', price: 300, description: 'Personal trip planning assistance' }
    ]
  }
];

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ data, updateData }) => {
  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = data.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    updateData({ amenities: updatedAmenities });
  };

  const getTotalAmenityPrice = () => {
    return amenityCategories.reduce((total, category) => {
      return total + category.amenities.reduce((categoryTotal, amenity) => {
        return categoryTotal + (data.amenities.includes(amenity.id) ? amenity.price : 0);
      }, 0);
    }, 0);
  };

  const getSelectedCount = () => {
    return data.amenities.length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6 glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Choose Your Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Enhance your charter experience with premium amenities and services
            </p>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {getSelectedCount()} amenities selected
              </div>
              <div className="text-lg font-bold text-primary">
                +${getTotalAmenityPrice().toLocaleString()} per day
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {amenityCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.title} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={amenity.id}
                      checked={data.amenities.includes(amenity.id)}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={amenity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {amenity.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {amenity.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        +${amenity.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        per day
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="mt-6 glass border-primary/20 bg-gradient-card">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Amenities Summary</h3>
            <div className="text-2xl font-bold text-primary mb-2">
              +${getTotalAmenityPrice().toLocaleString()} per day
            </div>
            <div className="text-xl font-semibold text-accent">
              +${(getTotalAmenityPrice() * data.duration).toLocaleString()} total
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              {getSelectedCount()} premium amenities for {data.duration} day{data.duration > 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmenitiesStep;