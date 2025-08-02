import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, Mail, Phone, Calendar as CalendarIcon, MessageSquare, DollarSign, Ship, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { WizardData } from '../YachtCharterWizard';
interface ContactAndQuoteStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}
const ContactAndQuoteStep: React.FC<ContactAndQuoteStepProps> = ({
  data,
  updateData
}) => {
  const [contactDetails, setContactDetails] = useState(data.contactDetails || {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    specialRequests: '',
    contactMethod: 'email',
    appointmentDate: undefined,
    appointmentTime: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(contactDetails.appointmentDate);
  const handleContactChange = (field: string, value: string | Date | undefined) => {
    const updated = {
      ...contactDetails,
      [field]: value
    };
    setContactDetails(updated);
    updateData({
      contactDetails: updated
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    handleContactChange('appointmentDate', date);
  };

  const timeSlots = [
    { value: 'morning', label: 'Morning (9:00 - 11:00 AM)' },
    { value: 'midday', label: 'Midday (12:00 - 2:00 PM)' },
    { value: 'evening', label: 'Evening (6:00 - 8:00 PM)' }
  ];

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
  return <div className="max-w-4xl mx-auto space-y-8">
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
        <CardContent className="space-y-6">
          {/* Contact Method Selection */}
          <div className="space-y-3">
            <Label>Contact me via *</Label>
            <RadioGroup
              value={contactDetails.contactMethod}
              onValueChange={(value) => handleContactChange('contactMethod', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-method" />
                <Label htmlFor="email-method" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="call" id="call-method" />
                <Label htmlFor="call-method" className="flex items-center gap-2 cursor-pointer">
                  <Phone className="h-4 w-4" />
                  Phone Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="message" id="message-method" />
                <Label htmlFor="message-method" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  Text Message
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                value={contactDetails.firstName} 
                onChange={e => handleContactChange('firstName', e.target.value)} 
                className="mt-1" 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                value={contactDetails.lastName} 
                onChange={e => handleContactChange('lastName', e.target.value)} 
                className="mt-1" 
                required 
              />
            </div>
          </div>

          {/* Email - Always required */}
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              id="email" 
              type="email" 
              value={contactDetails.email} 
              onChange={e => handleContactChange('email', e.target.value)} 
              className="mt-1" 
              required 
            />
          </div>

          {/* Phone - Required for call and message */}
          {(contactDetails.contactMethod === 'call' || contactDetails.contactMethod === 'message') && (
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={contactDetails.phone} 
                onChange={e => handleContactChange('phone', e.target.value)} 
                className="mt-1" 
                required 
              />
            </div>
          )}

          {/* Call Scheduling */}
          {contactDetails.contactMethod === 'call' && (
            <div className="space-y-4">
              <div>
                <Label>Schedule Call *</Label>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select appointment date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {selectedDate && (
                <div>
                  <Label>Preferred Time *</Label>
                  <RadioGroup
                    value={contactDetails.appointmentTime}
                    onValueChange={(value) => handleContactChange('appointmentTime', value)}
                    className="mt-2"
                  >
                    {timeSlots.map((slot) => (
                      <div key={slot.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={slot.value} id={slot.value} />
                        <Label htmlFor={slot.value} className="cursor-pointer">
                          {slot.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">Special Requests or Questions</Label>
            <Textarea 
              id="specialRequests" 
              value={contactDetails.specialRequests} 
              onChange={e => handleContactChange('specialRequests', e.target.value)} 
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
              <p className="text-sm text-muted-foreground">A yacht charter specialist will contact you as per your chosen contact method.</p>
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
    </div>;
};
export default ContactAndQuoteStep;