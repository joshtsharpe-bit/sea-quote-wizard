import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Ship, Users, Calendar, Package, DollarSign } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface LiveQuoteSidebarProps {
  data: WizardData;
  currentStep: number;
}

const LiveQuoteSidebar: React.FC<LiveQuoteSidebarProps> = ({ data, currentStep }) => {
  const calculateTotalPrice = () => {
    if (!data.destination || !data.yachtType) return 0;
    const basePrice = data.destination.basePrice * data.yachtType.priceMultiplier * data.duration;
    const bareboatDiscount = data.isBareboatCharter ? 0.4 : 0; // 40% discount for bareboat
    return Math.round(basePrice * (1 - bareboatDiscount));
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-72 bg-card border-r border-border p-6 h-screen overflow-y-auto">
      {/* Brand */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-elegant font-bold text-primary">KŌKAI</h2>
        <p className="text-xs text-muted-foreground">Luxury Charters</p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-medium text-foreground">Your Charter</h3>
        
        {/* Experience Level */}
        <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          getStepStatus(0) === 'completed' ? 'bg-primary/20' : 
          getStepStatus(0) === 'current' ? 'bg-primary/10' : 'bg-muted/50'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            getStepStatus(0) === 'completed' ? 'bg-primary' : 
            getStepStatus(0) === 'current' ? 'bg-primary/60' : 'bg-muted-foreground'
          }`} />
          <div className="flex-1">
            <p className="text-xs font-medium">Experience</p>
            {data.hasChartered !== undefined && (
              <p className="text-xs text-muted-foreground">
                {data.hasChartered ? 'Experienced' : 'First Time'}
              </p>
            )}
          </div>
        </div>

        {/* Destinations */}
        <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
          getStepStatus(1) === 'completed' ? 'bg-primary/20' : 
          getStepStatus(1) === 'current' ? 'bg-primary/10' : 'bg-muted/50'
        }`}>
          <MapPin className="w-4 h-4 mt-0.5 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-medium">Destinations</p>
            {data.destination && (
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs mb-1">
                  {data.destination.region}
                </Badge>
                {data.destination.countries && (
                  <div className="flex flex-wrap gap-1">
                    {data.destination.countries.map((country) => (
                      <span key={country} className="text-xs text-muted-foreground">
                        {country}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Yacht & Guests */}
        <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
          getStepStatus(2) === 'completed' ? 'bg-primary/20' : 
          getStepStatus(2) === 'current' ? 'bg-primary/10' : 'bg-muted/50'
        }`}>
          <Ship className="w-4 h-4 mt-0.5 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-medium">Yacht & Guests</p>
            {data.yachtType && (
              <div className="mt-1">
                <p className="text-xs text-muted-foreground">{data.yachtType.name}</p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-3 h-3" />
              <span className="text-xs text-muted-foreground">{data.guests} guests</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
          getStepStatus(3) === 'completed' ? 'bg-primary/20' : 
          getStepStatus(3) === 'current' ? 'bg-primary/10' : 'bg-muted/50'
        }`}>
          <Calendar className="w-4 h-4 mt-0.5 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-medium">Dates</p>
            {data.startDate && data.endDate && (
              <div className="mt-1">
                <p className="text-xs text-muted-foreground">
                  {formatDate(data.startDate)} - {formatDate(data.endDate)}
                </p>
                <p className="text-xs text-muted-foreground">{data.duration} nights</p>
              </div>
            )}
          </div>
        </div>

        {/* Package Type */}
        <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
          getStepStatus(4) === 'completed' ? 'bg-primary/20' : 
          getStepStatus(4) === 'current' ? 'bg-primary/10' : 'bg-muted/50'
        }`}>
          <Package className="w-4 h-4 mt-0.5 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-medium">Package</p>
            {data.isBareboatCharter !== undefined && (
              <p className="text-xs text-muted-foreground">
                {data.isBareboatCharter ? 'Bareboat' : 'All-Inclusive'}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator className="opacity-30" />

      {/* Price Summary */}
      {data.destination && data.yachtType && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Estimated Total
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Base price</span>
                <span>${data.destination.basePrice.toLocaleString()}/week</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Yacht multiplier</span>
                <span>{data.yachtType.priceMultiplier}x</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Duration</span>
                <span>{data.duration} nights</span>
              </div>
              {data.isBareboatCharter && (
                <div className="flex justify-between text-xs text-green-600">
                  <span className="text-muted-foreground">Bareboat discount</span>
                  <span>-40%</span>
                </div>
              )}
              <Separator className="opacity-30" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">${calculateTotalPrice().toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                *Estimated pricing. Final quote may vary.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveQuoteSidebar;