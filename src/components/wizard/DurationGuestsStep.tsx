import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calendar, Users } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface DurationGuestsStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const DurationGuestsStep: React.FC<DurationGuestsStepProps> = ({ data, updateData }) => {
  const maxCapacity = data.yachtType?.capacity || 16;

  const getEstimatedPrice = () => {
    if (!data.destination || !data.yachtType) return 0;
    const baseWeeklyPrice = data.destination.basePrice * data.yachtType.priceMultiplier;
    const totalPrice = (baseWeeklyPrice / 7) * data.duration;
    
    // Guest pricing (premium for larger groups)
    const guestMultiplier = 1 + (data.guests - 2) * 0.05;
    
    return Math.round(totalPrice * guestMultiplier);
  };

  const getDurationText = (days: number) => {
    if (days === 1) return '1 Day';
    if (days === 7) return '1 Week';
    if (days === 14) return '2 Weeks';
    if (days === 21) return '3 Weeks';
    return `${days} Days`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6 glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Duration & Group Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Customize your charter duration and number of guests
          </p>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {/* Duration Slider */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Charter Duration</h3>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="text-2xl font-bold text-primary leading-tight">
                    {getDurationText(data.duration)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Slider
                  value={[data.duration]}
                  onValueChange={(value) => updateData({ duration: value[0] })}
                  max={21}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 day</span>
                  <span>1 week</span>
                  <span>2 weeks</span>
                  <span>3 weeks</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[3, 7, 10, 14].map((days) => (
                  <button
                    key={days}
                    onClick={() => updateData({ duration: days })}
                    className={`p-2 rounded-md text-sm transition-all ${
                      data.duration === days
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {days === 7 ? '1 week' : days === 14 ? '2 weeks' : `${days} days`}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guests Slider */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Number of Guests</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {data.guests} guest{data.guests > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Max: {maxCapacity} for this yacht
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Slider
                  value={[data.guests]}
                  onValueChange={(value) => updateData({ guests: value[0] })}
                  max={maxCapacity}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1</span>
                  <span>{Math.floor(maxCapacity / 2)}</span>
                  <span>{maxCapacity}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 6, 8].filter(num => num <= maxCapacity).map((guests) => (
                  <button
                    key={guests}
                    onClick={() => updateData({ guests })}
                    className={`p-2 rounded-md text-sm transition-all ${
                      data.guests === guests
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {guests}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Preview */}
        <Card className="glass border-primary/20 bg-gradient-card">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Estimated Total</h3>
              <div className="text-3xl font-bold text-primary mb-2">
                ${getEstimatedPrice().toLocaleString()}
              </div>
              <p className="text-muted-foreground text-sm">
                For {data.guests} guest{data.guests > 1 ? 's' : ''} • {getDurationText(data.duration)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                *Final price may vary based on amenities and seasonal rates
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DurationGuestsStep;