import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, Baby, Heart, Building, UserCheck } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface GuestsAndTypeStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const guestTypes = [
  { id: 'family-with-children', label: 'Family with Children', icon: Baby, description: 'Kid-friendly amenities and activities' },
  { id: 'adult-family', label: 'Adult Family', icon: Users, description: 'Multi-generational family group' },
  { id: 'couples', label: 'Couples', icon: Heart, description: 'Romantic getaway for couples' },
  { id: 'friends', label: 'Friends', icon: UserCheck, description: 'Group of friends vacation' },
  { id: 'corporate', label: 'Corporate', icon: Building, description: 'Business retreat or team building' }
];

const GuestsAndTypeStep: React.FC<GuestsAndTypeStepProps> = ({ data, updateData }) => {
  const [guests, setGuests] = useState(data.guests || 4);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(data.guestTypes || []);

  const handleGuestsChange = (value: number[]) => {
    const newGuests = value[0];
    setGuests(newGuests);
    updateData({ guests: newGuests });
  };

  const handleTypeToggle = (typeId: string) => {
    const newTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(t => t !== typeId)
      : [...selectedTypes, typeId];
    
    setSelectedTypes(newTypes);
    updateData({ guestTypes: newTypes });
    
    // Smooth scroll to show next button when selection is made
    if (newTypes.length > 0) {
      setTimeout(() => {
        const button = document.getElementById('next-button');
        if (button) {
          button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const quickGuestOptions = [2, 4, 6, 8, 10, 12];

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
      <Card className="glass">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl">
            <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            How many guests?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Guest Count Slider */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Number of Guests</label>
                  <span className="text-xl md:text-2xl font-bold text-primary">{guests}</span>
                </div>
                <Slider
                  value={[guests]}
                  onValueChange={handleGuestsChange}
                  max={16}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1</span>
                  <span>16+</span>
                </div>
              </div>

              <div className="p-3 md:p-4 bg-secondary/20 rounded-lg">
                <h4 className="font-medium mb-2 text-sm md:text-base">Guest Capacity Note</h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Yacht availability depends on guest count. Some luxury yachts accommodate up to 12 guests, 
                  while larger vessels can host 16+ guests.
                </p>
              </div>
            </div>

            {/* Quick Guest Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Quick Selection</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {quickGuestOptions.map((count) => (
                  <Button
                    key={count}
                    variant={guests === count ? "default" : "outline"}
                    className="btn-3d text-xs md:text-sm py-2 md:py-3"
                    onClick={() => handleGuestsChange([count])}
                  >
                    {count} {count === 1 ? 'Guest' : 'Guests'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl">
            <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            What type of group?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
            This helps us recommend the perfect yacht and customize your experience
          </p>
          
          {/* Mobile: Use carousel for guest types */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2">
                {guestTypes.map((type) => (
                  <CarouselItem key={type.id} className="pl-2 basis-1/2">
                    <Button
                      variant={selectedTypes.includes(type.id) ? "default" : "outline"}
                      className={`h-auto p-3 flex flex-col items-center gap-2 btn-3d w-full ${
                        selectedTypes.includes(type.id) ? 'bg-primary hover:bg-primary/90' : ''
                      }`}
                      onClick={() => handleTypeToggle(type.id)}
                    >
                      <type.icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium text-xs">{type.label}</div>
                        <div className="text-xs opacity-80 mt-1 leading-tight">{type.description}</div>
                      </div>
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guestTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedTypes.includes(type.id) ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-3 btn-3d ${
                  selectedTypes.includes(type.id) ? 'bg-primary hover:bg-primary/90' : ''
                }`}
                onClick={() => handleTypeToggle(type.id)}
              >
                <type.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs opacity-80 mt-1">{type.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestsAndTypeStep;