import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Anchor } from 'lucide-react';
import DestinationStep from './wizard/DestinationStep';
import YachtTypeStep from './wizard/YachtTypeStep';
import DurationGuestsStep from './wizard/DurationGuestsStep';
import AmenitiesStep from './wizard/AmenitiesStep';
import QuoteSummary from './wizard/QuoteSummary';

export interface WizardData {
  destination: {
    name: string;
    region: string;
    image: string;
    basePrice: number;
  } | null;
  yachtType: {
    name: string;
    type: string;
    image: string;
    priceMultiplier: number;
    capacity: number;
  } | null;
  duration: number;
  guests: number;
  amenities: string[];
}

const STEPS = [
  { id: 'destination', title: 'Choose Destination', component: DestinationStep },
  { id: 'yacht', title: 'Select Yacht Type', component: YachtTypeStep },
  { id: 'details', title: 'Duration & Guests', component: DurationGuestsStep },
  { id: 'amenities', title: 'Amenities', component: AmenitiesStep },
  { id: 'quote', title: 'Your Quote', component: QuoteSummary },
];

const YachtCharterWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    destination: null,
    yachtType: null,
    duration: 7,
    guests: 4,
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
      case 0: return !!wizardData.destination;
      case 1: return !!wizardData.yachtType;
      case 2: return wizardData.duration > 0 && wizardData.guests > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Anchor className="h-8 w-8 text-primary animate-wave" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Charter Your Dream Yacht
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let us guide you through creating the perfect yacht charter experience
          </p>
        </div>

        {/* Progress Bar */}
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
            <div className="hidden md:grid md:grid-cols-5 gap-2">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-center p-2 rounded-lg transition-all ${
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
              className="min-w-[120px]"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="min-w-[120px] bg-gradient-ocean hover:opacity-90"
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