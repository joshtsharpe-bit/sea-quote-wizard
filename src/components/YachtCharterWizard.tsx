import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Anchor, Ship } from 'lucide-react';
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
}

import WelcomeStep from './wizard/WelcomeStep';
import NewDestinationStep from './wizard/NewDestinationStep';

const STEPS = [
  { id: 'welcome', title: 'Welcome', component: WelcomeStep },
  { id: 'destination', title: 'Destination', component: NewDestinationStep },
  { id: 'yacht', title: 'Yacht & Guests', component: YachtTypeStep },
  { id: 'dates', title: 'Dates', component: DateSelectionStep },
  { id: 'package', title: 'Package', component: IncludedAmenitiesStep },
  { id: 'quote', title: 'Your Quote', component: QuoteSummary },
];

const YachtCharterWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        // Scroll to just below the progress section for a smoother transition
        const progressSection = document.querySelector('.progress-section');
        if (progressSection) {
          const offset = progressSection.getBoundingClientRect().bottom + window.scrollY + 20;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        const progressSection = document.querySelector('.progress-section');
        if (progressSection) {
          const offset = progressSection.getBoundingClientRect().bottom + window.scrollY + 20;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }, 100);
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
      default: return false;
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header - only show after welcome step */}
        {currentStep > 0 && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Ship className="h-8 w-8 text-primary animate-wave" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                KŌKAI Charters
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let us guide you through creating the perfect yacht charter experience
            </p>
          </div>
        )}

        {/* Progress Bar - only show after welcome step */}
        {currentStep > 0 && (
          <Card className="mb-8 glass progress-section">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="mb-4" />
            
            {/* Mobile: Show only current step */}
            <div className="block md:hidden">
              <div className="text-center p-3 rounded-lg bg-primary text-primary-foreground">
                <div className="text-sm font-medium">{STEPS[currentStep].title}</div>
              </div>
            </div>
            
            {/* Desktop: Show all steps */}
            <div className="hidden md:grid md:grid-cols-6 gap-2">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-center p-3 rounded-lg transition-all ${
                    index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-xs font-medium leading-tight">{step.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Current Step */}
        <CurrentStepComponent
          data={wizardData}
          updateData={updateWizardData}
        />

        {/* Navigation */}
        {currentStep < STEPS.length - 1 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="min-w-[120px] btn-3d"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="min-w-[120px] btn-3d bg-primary hover:bg-primary/90"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YachtCharterWizard;