import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  };

  const quickGuestOptions = [2, 4, 6, 8, 10, 12];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            How many guests?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guest Count Slider */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Number of Guests</label>
                  <span className="text-2xl font-bold text-primary">{guests}</span>
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

              <div className="p-4 bg-secondary/20 rounded-lg">
                <h4 className="font-medium mb-2">Guest Capacity Note</h4>
                <p className="text-sm text-muted-foreground">
                  Yacht availability depends on guest count. Some luxury yachts accommodate up to 12 guests, 
                  while larger vessels can host 16+ guests.
                </p>
              </div>
            </div>

            {/* Quick Guest Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Quick Selection</label>
              <div className="grid grid-cols-3 gap-3">
                {quickGuestOptions.map((count) => (
                  <Button
                    key={count}
                    variant={guests === count ? "default" : "outline"}
                    className="btn-3d"
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
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <UserCheck className="h-6 w-6 text-primary" />
            What type of group?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This helps us recommend the perfect yacht and customize your experience
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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