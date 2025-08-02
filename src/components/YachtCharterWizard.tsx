import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Anchor, Ship } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import DestinationStep from './wizard/DestinationStep';
import YachtTypeStep from './wizard/YachtTypeStep';
import DurationGuestsStep from './wizard/DurationGuestsStep';
import DateSelectionStep from './wizard/DateSelectionStep';
import IncludedAmenitiesStep from './wizard/IncludedAmenitiesStep';
import QuoteSummary from './wizard/QuoteSummary';

export interface WizardData {
  hasChartered?: boolean;
  destination: {
    name: string;
    region: string;
    image: string;
    basePrice: number;
    countries?: string[];
  } | null;
  yachtType: {
    id?: string;
    name: string;
    type: string;
    image: string;
    priceMultiplier: number;
    capacity: number;
  } | null;
  guests: number;
  duration: number;
  startDate?: string;
  endDate?: string;
  isBareboatCharter?: boolean;
  amenities: string[];
  reasons?: string[];
  guestTypes?: string[];
  budgetRange?: [number, number];
  contactDetails?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    specialRequests: string;
  };
  consultationRequested?: boolean;
}

import WhereAndWhyStep from './wizard/WhereAndWhyStep';
import DatesAndDurationStep from './wizard/DatesAndDurationStep';
import GuestsAndTypeStep from './wizard/GuestsAndTypeStep';
import BudgetAndYachtStep from './wizard/BudgetAndYachtStep';
import ContactAndQuoteStep from './wizard/ContactAndQuoteStep';

const STEPS = [
  { id: 'where-why', title: 'Where & Why', component: WhereAndWhyStep },
  { id: 'dates-duration', title: 'Dates & Duration', component: DatesAndDurationStep },
  { id: 'guests-type', title: 'Guests & Type', component: GuestsAndTypeStep },
  { id: 'budget-yacht', title: 'Budget & Yacht', component: BudgetAndYachtStep },
  { id: 'package', title: 'Package', component: IncludedAmenitiesStep },
  { id: 'contact-quote', title: 'Contact & Quote', component: ContactAndQuoteStep },
];

const YachtCharterWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    destination: null,
    yachtType: null,
    guests: 4,
    duration: 7,
    amenities: [],
    reasons: [],
    guestTypes: [],
    budgetRange: [20000, 50000],
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const canProceedToStep = (stepIndex: number) => {
    // Allow going to any previous step or the next step if current is complete
    if (stepIndex <= currentStep) return true;
    if (stepIndex === currentStep + 1) return canProceed();
    return false;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!wizardData.destination && wizardData.reasons && wizardData.reasons.length > 0;
      case 1: return wizardData.startDate && wizardData.endDate && wizardData.duration >= 5;
      case 2: return wizardData.guests > 0 && wizardData.guestTypes && wizardData.guestTypes.length > 0;
      case 3: return !!wizardData.yachtType && wizardData.budgetRange;
      case 4: return true;
      case 5: return wizardData.contactDetails?.firstName && wizardData.contactDetails?.lastName && 
               wizardData.contactDetails?.email && wizardData.contactDetails?.phone;
      default: return false;
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-background/80 backdrop-blur-sm border border-border/40 rounded-lg p-6 mb-8 glass">
          <div className="flex flex-wrap justify-center gap-2">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isAccessible = index <= currentStep || canProceedToStep(index);
              
              return (
                <Button
                  key={step.id}
                  variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                  className={`btn-3d transition-all ${
                    isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => isAccessible && goToStep(index)}
                  disabled={!isAccessible}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent ? 'bg-primary-foreground text-primary' : 
                      isCompleted ? 'bg-primary text-primary-foreground' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="animate-fade-in">
              <CurrentStepComponent
                data={wizardData}
                updateData={updateWizardData}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        {canProceed() && currentStep < STEPS.length - 1 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-3d bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
              size="lg"
            >
              Continue to {STEPS[currentStep + 1].title}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === STEPS.length - 1 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => {/* Handle final submission */}}
              className="btn-3d bg-accent hover:bg-accent/90 px-8 py-3 text-lg"
              size="lg"
            >
              Get Your Quote
              <Anchor className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YachtCharterWizard;