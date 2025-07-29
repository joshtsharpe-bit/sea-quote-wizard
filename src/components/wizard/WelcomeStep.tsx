import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ship, CheckCircle, XCircle } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface WelcomeStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ data, updateData }) => {
  const handleCharteredBefore = (hasChartered: boolean) => {
    updateData({ hasChartered });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass text-center overflow-hidden">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Ship className="h-12 w-12 text-primary animate-float" />
            <div>
              <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                KŌKAI Charters
              </CardTitle>
              <p className="text-muted-foreground text-lg mt-2">Luxury Yacht Charter Experience</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Welcome to Your Charter Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This personalized form will help us craft the perfect yacht charter experience tailored to your preferences. 
              We'll guide you through selecting your destination, yacht, and amenities to create unforgettable memories on the water.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-foreground mb-6">
              Have you chartered a yacht before?
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Button
                variant={data.hasChartered === true ? "default" : "outline"}
                size="lg"
                onClick={() => handleCharteredBefore(true)}
                className={`flex-1 btn-3d h-16 text-lg font-medium ${
                  data.hasChartered === true ? 'bg-primary hover:bg-primary/90' : ''
                }`}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Yes, I have
              </Button>
              
              <Button
                variant={data.hasChartered === false ? "default" : "outline"}
                size="lg"
                onClick={() => handleCharteredBefore(false)}
                className={`flex-1 btn-3d h-16 text-lg font-medium ${
                  data.hasChartered === false ? 'bg-primary hover:bg-primary/90' : ''
                }`}
              >
                <XCircle className="h-5 w-5 mr-2" />
                No, first time
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            This helps us tailor recommendations to your experience level
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeStep;