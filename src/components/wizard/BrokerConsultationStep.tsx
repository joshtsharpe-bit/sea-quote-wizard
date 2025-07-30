import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Calendar, User, MessageSquare, CheckCircle } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';
import { useToast } from '@/hooks/use-toast';

interface BrokerConsultationStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

interface ContactDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests: string;
}

const BrokerConsultationStep: React.FC<BrokerConsultationStepProps> = ({ data, updateData }) => {
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    specialRequests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const updateContactDetails = (field: keyof ContactDetails, value: string) => {
    setContactDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleCall = () => {
    if (!contactDetails.firstName || !contactDetails.lastName || !contactDetails.phone || !contactDetails.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields to schedule your consultation.",
        variant: "destructive",
      });
      return;
    }

    // Store contact details in wizard data
    updateData({ 
      contactDetails: contactDetails,
      consultationRequested: true 
    });

    setIsSubmitted(true);
    
    toast({
      title: "Consultation scheduled!",
      description: "Our expert broker will contact you within 24 hours to finalize your charter.",
    });
  };

  const getTotalPrice = () => {
    if (!data.destination || !data.yachtType) return 0;
    const basePrice = data.destination.basePrice * data.yachtType.priceMultiplier * data.duration;
    const bareboatDiscount = data.isBareboatCharter ? 0.4 : 0;
    return Math.round(basePrice * (1 - bareboatDiscount));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card className="glass border-primary/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Consultation Scheduled!
              </h2>
              <p className="text-muted-foreground">
                Thank you for choosing KŌKAI Charters. Our expert broker will contact you within 24 hours 
                to discuss your ${getTotalPrice().toLocaleString()} yacht charter and handle all the details.
              </p>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Our broker will call you at {contactDetails.phone}</li>
                <li>• We'll finalize your charter details and pricing</li>
                <li>• Secure your dates with a deposit</li>
                <li>• Receive detailed itinerary and preparation guide</li>
              </ul>
            </div>

            <p className="text-xs text-muted-foreground">
              Questions? Contact us directly at +1 (555) 123-SAIL or hello@kokaisail.com
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to Book Your Charter?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Schedule a consultation with our expert yacht broker to finalize your 
          ${getTotalPrice().toLocaleString()} charter and ensure every detail is perfect.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <Card className="lg:col-span-2 glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={contactDetails.firstName}
                  onChange={(e) => updateContactDetails('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={contactDetails.lastName}
                  onChange={(e) => updateContactDetails('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactDetails.phone}
                  onChange={(e) => updateContactDetails('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactDetails.email}
                  onChange={(e) => updateContactDetails('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Call Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={contactDetails.preferredDate}
                  onChange={(e) => updateContactDetails('preferredDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={contactDetails.preferredTime}
                  onChange={(e) => updateContactDetails('preferredTime', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests or Questions</Label>
              <Textarea
                id="specialRequests"
                value={contactDetails.specialRequests}
                onChange={(e) => updateContactDetails('specialRequests', e.target.value)}
                placeholder="Any dietary restrictions, celebration details, or special requests..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleScheduleCall}
              className="w-full btn-3d bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Phone className="h-4 w-4 mr-2" />
              Schedule Broker Consultation
            </Button>
          </CardContent>
        </Card>

        {/* Benefits Sidebar */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Why Schedule a Call?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-sm">Expert Guidance</h4>
                  <p className="text-xs text-muted-foreground">
                    Get personalized recommendations from experienced yacht professionals
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-sm">Best Pricing</h4>
                  <p className="text-xs text-muted-foreground">
                    Ensure you're getting the best value and available discounts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-sm">Custom Itinerary</h4>
                  <p className="text-xs text-muted-foreground">
                    Tailor your route and activities to your preferences
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-sm">Secure Booking</h4>
                  <p className="text-xs text-muted-foreground">
                    Lock in your dates and yacht with confidence
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                Average call duration: 15-20 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerConsultationStep;