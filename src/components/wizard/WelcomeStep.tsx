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
    <div className="max-w-2xl mx-auto">
      <Card className="glass border-0 shadow-vintage">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-elegant font-bold text-primary mb-4">
              Welcome to KŌKAI Charters
            </h1>
            <p className="text-lg text-muted-foreground">
              Create your perfect yacht charter experience.
            </p>
          </div>

          <div className="mb-8">
            <p className="text-base text-foreground mb-6 font-medium">
              Have you chartered a yacht before?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                variant={data.hasChartered === true ? "default" : "outline"}
                size="lg"
                onClick={() => handleCharteredBefore(true)}
                className={`flex-1 btn-3d h-14 text-base font-medium ${
                  data.hasChartered === true ? 'bg-primary hover:bg-primary/90' : ''
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Yes
              </Button>
              
              <Button
                variant={data.hasChartered === false ? "default" : "outline"}
                size="lg"
                onClick={() => handleCharteredBefore(false)}
                className={`flex-1 btn-3d h-14 text-base font-medium ${
                  data.hasChartered === false ? 'bg-primary hover:bg-primary/90' : ''
                }`}
              >
                <XCircle className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeStep;