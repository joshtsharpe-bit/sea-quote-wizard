import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface DateSelectionStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({ data, updateData }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [duration, setDuration] = useState<number>(7);

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (endDate) {
      const nights = calculateDuration(date, endDate);
      setDuration(nights);
      updateData({ 
        startDate: date,
        endDate,
        duration: nights 
      });
    } else {
      updateData({ startDate: date });
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    if (startDate) {
      const nights = calculateDuration(startDate, date);
      setDuration(nights);
      updateData({ 
        startDate,
        endDate: date,
        duration: nights 
      });
    } else {
      updateData({ endDate: date });
    }
  };

  const getMinEndDate = () => {
    if (!startDate) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + 5); // Minimum 5 nights
    return start.toISOString().split('T')[0];
  };

  const getMinStartDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isValidBooking = startDate && endDate && duration >= 5;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calendar className="h-6 w-6 text-primary" />
            When do you want to sail?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Choose your charter dates (minimum 5 nights required)
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Start Date */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Departure Date</h3>
              </div>
              
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={getMinStartDate()}
                className="w-full p-4 rounded-lg bg-background border border-border text-foreground text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              {startDate && (
                <div className="text-sm text-muted-foreground">
                  Departure: {new Date(startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* End Date */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Return Date</h3>
              </div>
              
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                min={getMinEndDate()}
                disabled={!startDate}
                className="w-full p-4 rounded-lg bg-background border border-border text-foreground text-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              
              {endDate && (
                <div className="text-sm text-muted-foreground">
                  Return: {new Date(endDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duration Summary */}
      {startDate && endDate && (
        <Card className="mt-8 glass border-primary/20 bg-gradient-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Charter Duration</h3>
              </div>
              
              <div className="text-3xl font-bold text-primary mb-2">
                {duration} Night{duration > 1 ? 's' : ''}
              </div>
              
              {duration < 5 && (
                <div className="text-destructive text-sm">
                  Minimum 5 nights required for charter
                </div>
              )}
              
              {duration >= 5 && (
                <div className="text-muted-foreground text-sm">
                  Perfect! Your charter duration meets our requirements
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Date Options */}
      <Card className="mt-8 glass">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Charter Lengths</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { days: 7, label: '1 Week' },
              { days: 10, label: '10 Days' },
              { days: 14, label: '2 Weeks' },
              { days: 21, label: '3 Weeks' }
            ].map((option) => (
              <Button
                key={option.days}
                variant="outline"
                onClick={() => {
                  if (startDate) {
                    const start = new Date(startDate);
                    const end = new Date(start);
                    end.setDate(start.getDate() + option.days);
                    handleEndDateChange(end.toISOString().split('T')[0]);
                  }
                }}
                disabled={!startDate}
                className="btn-3d"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DateSelectionStep;