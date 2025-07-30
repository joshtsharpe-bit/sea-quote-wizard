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

import WelcomeStep from './wizard/WelcomeStep';
import NewDestinationStep from './wizard/NewDestinationStep';
import LiveQuoteSidebar from './wizard/LiveQuoteSidebar';
import BrokerConsultationStep from './wizard/BrokerConsultationStep';

const STEPS = [
  { id: 'welcome', title: 'Welcome', component: WelcomeStep },
  { id: 'destination', title: 'Destination', component: NewDestinationStep },
  { id: 'yacht', title: 'Yacht & Guests', component: YachtTypeStep },
  { id: 'dates', title: 'Dates', component: DateSelectionStep },
  { id: 'package', title: 'Package', component: IncludedAmenitiesStep },
  { id: 'quote', title: 'Your Quote', component: QuoteSummary },
  { id: 'broker', title: 'Book Charter', component: BrokerConsultationStep },
];

const YachtCharterWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [wizardData, setWizardData] = useState<WizardData>({
    hasChartered: undefined,
    destination: null,
    yachtType: null,
    guests: 4,
    duration: 7,
    amenities: [],
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      api?.scrollTo(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      api?.scrollTo(newStep);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return wizardData.hasChartered !== undefined;
      case 1: return !!wizardData.destination;
      case 2: return !!wizardData.yachtType && wizardData.guests > 0;
      case 3: return wizardData.startDate && wizardData.endDate && wizardData.duration >= 5;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero relative flex">
      {/* Live Quote Sidebar - only show after welcome step */}
      {currentStep > 0 && (
        <LiveQuoteSidebar data={wizardData} currentStep={currentStep} />
      )}
      
      <div className="flex-1 relative z-10">
        {/* Progress Bar */}
        <div className="bg-background/80 backdrop-blur-sm border-b border-border/40 py-4 sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </div>
              <div className="text-sm font-medium text-primary">
                {STEPS[currentStep].title}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-background/60 backdrop-blur-sm border-b border-border/20 py-3">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="min-w-[120px] btn-3d"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="min-w-[120px] btn-3d bg-primary hover:bg-primary/90"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => {/* Handle final submission */}}
                  disabled={!canProceed()}
                  className="min-w-[120px] btn-3d bg-accent hover:bg-accent/90"
                >
                  Complete Charter
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <Carousel 
              setApi={setApi}
              className="w-full"
              opts={{
                align: "center",
                dragFree: false,
                skipSnaps: false,
              }}
            >
              <CarouselContent className="ml-0">
                {STEPS.map((step, index) => {
                  const StepComponent = step.component;
                  return (
                    <CarouselItem key={step.id} className="pl-0 basis-full">
                      <div className="flex items-center justify-center min-h-[600px]">
                        <div className="w-full animate-fade-in">
                          <StepComponent
                            data={wizardData}
                            updateData={updateWizardData}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YachtCharterWizard;