import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Sun, Cloud, CloudRain } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface DatesAndDurationStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const DatesAndDurationStep: React.FC<DatesAndDurationStepProps> = ({ data, updateData }) => {
  const [startDate, setStartDate] = useState(data.startDate || '');
  const [duration, setDuration] = useState(data.duration || 7);

  const calculateEndDate = (start: string, nights: number) => {
    if (!start) return '';
    const startDateObj = new Date(start);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + nights);
    return endDateObj.toISOString().split('T')[0];
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    const endDate = calculateEndDate(date, duration);
    updateData({
      startDate: date,
      endDate,
      duration
    });
  };

  const handleDurationChange = (nights: number) => {
    if (nights < 5) return; // Minimum 5 nights
    setDuration(nights);
    const endDate = calculateEndDate(startDate, nights);
    updateData({
      duration: nights,
      endDate
    });
  };

  const quickDurations = [
    { nights: 5, label: '5 Nights', popular: false },
    { nights: 7, label: '1 Week', popular: true },
    { nights: 10, label: '10 Nights', popular: false },
    { nights: 14, label: '2 Weeks', popular: true },
    { nights: 21, label: '3 Weeks', popular: false }
  ];

  // Mock weather data - in real app, this would come from an API
  const getWeatherForMonth = (month: number) => {
    const destination = data.destination?.region || 'Mediterranean';
    
    if (destination === 'Mediterranean') {
      if (month >= 6 && month <= 8) return { condition: 'excellent', icon: Sun, color: 'text-green-500' };
      if (month >= 4 && month <= 5 || month >= 9 && month <= 10) return { condition: 'good', icon: Sun, color: 'text-blue-500' };
      if (month >= 11 || month <= 3) return { condition: 'fair', icon: Cloud, color: 'text-orange-500' };
    }
    
    if (destination === 'Caribbean') {
      if (month >= 12 || month <= 4) return { condition: 'excellent', icon: Sun, color: 'text-green-500' };
      if (month >= 5 && month <= 6 || month >= 11) return { condition: 'good', icon: Sun, color: 'text-blue-500' };
      if (month >= 7 && month <= 10) return { condition: 'hurricane season', icon: CloudRain, color: 'text-red-500' };
    }
    
    return { condition: 'good', icon: Sun, color: 'text-blue-500' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calendar className="h-6 w-6 text-primary" />
            When would you like to sail?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Departure Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minimum 5 nights)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                  min={5}
                  max={30}
                  className="mt-1"
                />
              </div>
              
              {startDate && (
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <p className="text-sm font-medium">Return Date</p>
                  <p className="text-muted-foreground">{calculateEndDate(startDate, duration)}</p>
                </div>
              )}
            </div>

            {/* Quick Duration Options */}
            <div className="space-y-4">
              <Label>Quick Duration Options</Label>
              <div className="grid grid-cols-2 gap-3">
                {quickDurations.map((option) => (
                  <Button
                    key={option.nights}
                    variant={duration === option.nights ? "default" : "outline"}
                    className={`btn-3d ${option.popular ? 'ring-1 ring-primary/30' : ''}`}
                    onClick={() => handleDurationChange(option.nights)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.label}</div>
                      {option.popular && (
                        <div className="text-xs text-primary">Popular</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Heat Map */}
      {data.destination && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Sun className="h-5 w-5 text-primary" />
              Best Time to Visit {data.destination.region}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthName = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
                const weather = getWeatherForMonth(month);
                const WeatherIcon = weather.icon;
                
                return (
                  <div key={month} className="text-center">
                    <div className={`p-3 rounded-lg border-2 transition-all ${weather.color} ${weather.condition === 'excellent' ? 'bg-green-50 border-green-200' : weather.condition === 'good' ? 'bg-blue-50 border-blue-200' : weather.condition === 'fair' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
                      <WeatherIcon className={`h-6 w-6 mx-auto mb-2 ${weather.color}`} />
                      <div className="text-xs font-medium">{monthName}</div>
                      <div className="text-xs mt-1 capitalize">{weather.condition}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <span>Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-200 rounded"></div>
                <span>Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-200 rounded"></div>
                <span>Fair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 rounded"></div>
                <span>Avoid</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatesAndDurationStep;