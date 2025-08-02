import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { WizardData } from '../YachtCharterWizard';

interface DatesAndDurationStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const DatesAndDurationStep: React.FC<DatesAndDurationStepProps> = ({ data, updateData }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    data.startDate ? new Date(data.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    data.endDate ? new Date(data.endDate) : undefined
  );

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      const startDateStr = date.toISOString().split('T')[0];
      updateData({ startDate: startDateStr });
      
      if (endDate) {
        const duration = Math.ceil((endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        updateData({ duration });
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && startDate) {
      const endDateStr = date.toISOString().split('T')[0];
      const duration = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      updateData({ 
        endDate: endDateStr,
        duration 
      });
    }
  };

  // Smooth scroll to button when both dates are selected
  useEffect(() => {
    if (startDate && endDate && data.duration && data.duration >= 5) {
      setTimeout(() => {
        const button = document.getElementById('next-button');
        if (button) {
          button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [startDate, endDate, data.duration]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            When would you like to charter?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Date Selection with Visual Connection */}
          <div className="flex items-center justify-center gap-8">
            {/* Departure Date */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Departure Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-20 w-20 rounded-xl flex flex-col items-center justify-center gap-1",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? (
                      <>
                        <span className="text-xs font-medium text-primary">
                          {format(startDate, "MMM")}
                        </span>
                        <span className="text-lg font-bold">
                          {format(startDate, "dd")}
                        </span>
                      </>
                    ) : (
                      <CalendarIcon className="h-6 w-6" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Connection Line with Duration */}
            <div className="flex-1 max-w-xs relative">
              <div className="h-px bg-border relative">
                <Minus className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Minus className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {data.duration && data.duration >= 5 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 py-1 rounded-full border text-sm font-medium">
                    {data.duration} days
                  </div>
                )}
              </div>
            </div>

            {/* Return Date */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Return Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-20 w-20 rounded-xl flex flex-col items-center justify-center gap-1",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? (
                      <>
                        <span className="text-xs font-medium text-primary">
                          {format(endDate, "MMM")}
                        </span>
                        <span className="text-lg font-bold">
                          {format(endDate, "dd")}
                        </span>
                      </>
                    ) : (
                      <CalendarIcon className="h-6 w-6" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date() || (startDate && date <= startDate)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {data.duration && data.duration < 5 && (
            <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">Minimum charter duration is 5 nights</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Heat Map */}
      {data.destination && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Best Time to Visit {data.destination.region}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1 p-4 bg-muted rounded-lg">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="text-center">
                  <div className={`h-8 w-full rounded mb-1 ${
                    [5, 6, 7, 8, 9].includes(i) ? 'bg-green-500' : 
                    [3, 4, 10, 11].includes(i) ? 'bg-yellow-500' : 'bg-red-300'
                  }`}></div>
                  <span className="text-xs">{new Date(0, i).toLocaleDateString('en', { month: 'short' })}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                Prime Season
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                Good Season
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-300 rounded"></div>
                Off Season
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatesAndDurationStep;