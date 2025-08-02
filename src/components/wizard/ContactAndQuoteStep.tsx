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

  // Calculate estimated price with detailed breakdown
  const getSubtotal = () => {
    if (!data.destination || !data.yachtType) return 0;
    return Math.round(data.destination.basePrice * data.yachtType.priceMultiplier * data.duration);
  };

  const getBareboatDiscountAmount = () => {
    if (!data.isBareboatCharter) return 0;
    return Math.round(getSubtotal() * 0.4); // 40% discount
  };

  const getFinalPrice = () => {
    return getSubtotal() - getBareboatDiscountAmount();
  };

  const calculateEstimatedPrice = () => {
    return getFinalPrice();
  };

  const estimatedPrice = calculateEstimatedPrice();

  const getContactMethodDisplay = () => {
    if (contactDetails.contactMethod === 'email') {
      return { icon: Mail, label: 'Email', color: 'text-blue-600' };
    } else if (contactDetails.contactMethod === 'call') {
      return { icon: Phone, label: 'Phone Call', color: 'text-green-600' };
    } else {
      return { icon: MessageSquare, label: 'Text Message', color: 'text-purple-600' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quote Summary */}
      <Card className="glass border-primary/20 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-elegant">
            <DollarSign className="h-6 w-6 text-primary" />
            Your Charter Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Charter Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{data.destination?.name}</div>
                  <div className="text-sm text-muted-foreground">{data.destination?.region}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Ship className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{data.yachtType?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Capacity: {data.yachtType?.capacity} guests • {data.isBareboatCharter ? 'Bareboat Charter' : 'Fully Crewed'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{data.guests} Guests for {data.duration} days</div>
                  <div className="text-sm text-muted-foreground">
                    {data.guestTypes?.join(', ') || 'Mixed group'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="font-elegant text-lg mb-4">Price Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Charter Rate</span>
                  <span>${data.destination?.basePrice.toLocaleString()}/week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Yacht Premium ({data.yachtType?.name})</span>
                  <span>{data.yachtType?.priceMultiplier}x multiplier</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{data.duration} days ({Math.round(data.duration / 7 * 10) / 10} weeks)</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toLocaleString()}</span>
                  </div>
                </div>

                {data.isBareboatCharter && (
                  <>
                    <div className="flex justify-between text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-lg">
                      <span>Bareboat Discount (40%)</span>
                      <span>-${getBareboatDiscountAmount().toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground px-3">
                      <p className="mb-1">✓ You save on crew, provisions, and service fees</p>
                      <p>⚠️ Sailing certification and self-provisioning required</p>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold font-elegant">
                    <span>Total Estimated Cost</span>
                    <span className="text-primary">${getFinalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4 p-3 bg-secondary/20 rounded-lg">
                * Final pricing depends on specific yacht availability, dates, and additional services. 
                A broker will provide exact quotes from available yachts.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-elegant">
            <User className="h-6 w-6 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Method Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">How would you like us to contact you? *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'email', icon: Mail, label: 'Email', desc: 'We\'ll send you yacht options via email' },
                { value: 'call', icon: Phone, label: 'Phone Call', desc: 'Schedule a call with our broker' },
                { value: 'message', icon: MessageSquare, label: 'Text Message', desc: 'Get updates via SMS' }
              ].map((method) => {
                const IconComponent = method.icon;
                return (
                  <div 
                    key={method.value}
                    className={cn(
                      "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                      contactDetails.contactMethod === method.value 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleContactChange('contactMethod', method.value)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span className="font-medium">{method.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.desc}</p>
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method.value}
                      checked={contactDetails.contactMethod === method.value}
                      onChange={() => handleContactChange('contactMethod', method.value)}
                      className="absolute top-4 right-4"
                    />
                  </div>
                );
              })}
            </div>
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
                placeholder="+1 (555) 123-4567"
              />
            </div>
          )}

          {/* Call Scheduling */}
          {contactDetails.contactMethod === 'call' && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Schedule Your Call *</Label>
              
              {/* Date Selection */}
              <div>
                <Label className="text-sm">Preferred Date</Label>
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
                        {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Choose a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        className="border-0"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Time Selection - Only show after date is selected */}
              {selectedDate && (
                <div>
                  <Label className="text-sm">Preferred Time</Label>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {timeSlots.map((slot) => (
                      <div 
                        key={slot.value}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          contactDetails.appointmentTime === slot.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleContactChange('appointmentTime', slot.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{slot.label}</span>
                          <input
                            type="radio"
                            name="appointmentTime"
                            value={slot.value}
                            checked={contactDetails.appointmentTime === slot.value}
                            onChange={() => handleContactChange('appointmentTime', slot.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
            <CalendarIcon className="h-5 w-5 text-accent" />
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
                A yacht charter specialist will contact you via {getContactMethodDisplay().label.toLowerCase()}.
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
