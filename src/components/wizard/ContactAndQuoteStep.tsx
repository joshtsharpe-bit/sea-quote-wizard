import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Calendar, MessageSquare, DollarSign, Ship, MapPin, Users } from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';

interface ContactAndQuoteStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const ContactAndQuoteStep: React.FC<ContactAndQuoteStepProps> = ({ data, updateData }) => {
  const [contactDetails, setContactDetails] = useState(data.contactDetails || {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    specialRequests: ''
  });

  const handleContactChange = (field: string, value: string) => {
    const updated = { ...contactDetails, [field]: value };
    setContactDetails(updated);
    updateData({ contactDetails: updated });
  };

  // Calculate estimated price
  const calculateEstimatedPrice = () => {
    if (!data.destination || !data.yachtType || !data.budgetRange) return 0;
    
    const basePrice = data.destination.basePrice;
    const durationMultiplier = data.duration / 7;
    const yachtMultiplier = data.yachtType.priceMultiplier;
    const guestFactor = Math.max(1, data.guests / 8);
    
    let estimatedPrice = basePrice * durationMultiplier * yachtMultiplier * guestFactor;
    
    // Apply bareboat discount
    if (data.isBareboatCharter) {
      estimatedPrice *= 0.7; // 30% discount for bareboat
    }
    
    // Keep within budget range
    const [minBudget, maxBudget] = data.budgetRange;
    estimatedPrice = Math.min(Math.max(estimatedPrice, minBudget), maxBudget);
    
    return Math.round(estimatedPrice);
  };

  const estimatedPrice = calculateEstimatedPrice();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quote Summary */}
      <Card className="glass border-primary/20 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Your Charter Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{data.destination?.name}</div>
                  <div className="text-sm text-muted-foreground">{data.duration} nights</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Ship className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{data.yachtType?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {data.isBareboatCharter ? 'Bareboat Charter' : 'Fully Crewed'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{data.guests} Guests</div>
                  <div className="text-sm text-muted-foreground">
                    {data.guestTypes?.join(', ') || 'Mixed group'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-2">Estimated Range</div>
              <div className="text-4xl font-bold text-primary mb-2">
                ${(estimatedPrice * 0.85).toLocaleString()} - ${(estimatedPrice * 1.15).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                For {data.duration} nights • {data.guests} guests
              </div>
              <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                <div className="text-xs text-muted-foreground">
                  * Final pricing depends on specific yacht availability, 
                  dates, and additional services. A broker will provide 
                  exact quotes from available yachts.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <User className="h-6 w-6 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={contactDetails.firstName}
                  onChange={(e) => handleContactChange('firstName', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={contactDetails.lastName}
                  onChange={(e) => handleContactChange('lastName', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactDetails.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactDetails.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="preferredDate">Preferred Contact Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={contactDetails.preferredDate}
                  onChange={(e) => handleContactChange('preferredDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="preferredTime">Preferred Contact Time</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={contactDetails.preferredTime}
                  onChange={(e) => handleContactChange('preferredTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="specialRequests">Special Requests or Questions</Label>
            <Textarea
              id="specialRequests"
              value={contactDetails.specialRequests}
              onChange={(e) => handleContactChange('specialRequests', e.target.value)}
              className="mt-1"
              rows={4}
              placeholder="Any special dietary requirements, accessibility needs, celebration details, or other requests..."
            />
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="glass border-accent/20 bg-gradient-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Calendar className="h-5 w-5 text-accent" />
            What Happens Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Broker Contact</h4>
              <p className="text-sm text-muted-foreground">
                A yacht charter specialist will contact you within 24 hours to discuss your requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Yacht Selection</h4>
              <p className="text-sm text-muted-foreground">
                We'll present you with a curated selection of available yachts that match your criteria.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Book Your Charter</h4>
              <p className="text-sm text-muted-foreground">
                Finalize your booking with exact pricing, contracts, and detailed itinerary planning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactAndQuoteStep;
