import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Share2, 
  MapPin, 
  Anchor, 
  Calendar, 
  Users, 
  Star,
  Check,
  Mail
} from 'lucide-react';
import { WizardData } from '../YachtCharterWizard';
import { useToast } from '@/hooks/use-toast';

interface QuoteSummaryProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
}

const amenityPrices: Record<string, number> = {
  chef: 200, gourmet: 150, wine: 100, bbq: 50,
  sound: 75, tv: 100, games: 300, fishing: 150,
  ac: 100, wifi: 50, spa: 400, linens: 75,
  tender: 200, pickup: 150, helicopter: 1500, concierge: 300
};

const amenityNames: Record<string, string> = {
  chef: 'Private Chef', gourmet: 'Gourmet Provisions', wine: 'Wine Selection', bbq: 'BBQ Equipment',
  sound: 'Premium Sound System', tv: 'Entertainment System', games: 'Water Sports Equipment', fishing: 'Fishing Equipment',
  ac: 'Climate Control', wifi: 'Starlink Internet', spa: 'Spa Services', linens: 'Premium Linens',
  tender: 'Tender Boat', pickup: 'Airport Pickup', helicopter: 'Helicopter Tour', concierge: 'Concierge Service'
};

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ data, onNext }) => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const getSubtotal = () => {
    if (!data.destination || !data.yachtType) return 0;
    return Math.round(data.destination.basePrice * data.yachtType.priceMultiplier * data.duration);
  };

  const getBareboatDiscountAmount = () => {
    if (!data.isBareboatCharter) return 0;
    return Math.round(getSubtotal() * 0.4); // 40% discount
  };

  const getTotalPrice = () => {
    return getSubtotal() - getBareboatDiscountAmount();
  };

  const getDurationText = (days: number) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days === 7) return '1 week';
    if (days < 14) return `${days} days (${Math.floor(days / 7)} week + ${days % 7} day${days % 7 > 1 ? 's' : ''})`;
    return `${days} days (${Math.floor(days / 7)} weeks + ${days % 7} day${days % 7 > 1 ? 's' : ''})`;
  };

  const handleSendQuote = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to receive the quote.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quote sent!",
      description: `Your personalized yacht charter quote has been sent to ${email}`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your quote PDF is being prepared for download.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6 glass border-primary/20 bg-gradient-card">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-elegant text-foreground mb-2">
              Your Yacht Charter Quote
            </h1>
            <p className="text-muted-foreground">
              Everything is ready for your perfect sailing adventure
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              ${getTotalPrice().toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              Total estimated cost for your {getDurationText(data.duration)} charter
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Charter Details */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-elegant">Charter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Destination */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">{data.destination?.name}</h4>
                <p className="text-sm text-muted-foreground">{data.destination?.region}</p>
              </div>
            </div>

            {/* Yacht */}
            <div className="flex items-start gap-3">
              <Anchor className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">{data.yachtType?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Capacity: {data.yachtType?.capacity} guests
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">{getDurationText(data.duration)}</h4>
                <p className="text-sm text-muted-foreground">Charter duration</p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">{data.guests} Guest{data.guests > 1 ? 's' : ''}</h4>
                <p className="text-sm text-muted-foreground">Group size</p>
              </div>
            </div>

            {/* Package Type */}
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">{data.isBareboatCharter ? 'Bareboat Charter' : 'All-Inclusive Package'}</h4>
                <p className="text-sm text-muted-foreground">
                  {data.isBareboatCharter 
                    ? 'Boat only - you handle provisions and navigation'
                    : 'Includes crew, food & beverages, water toys, and more'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-elegant">Price Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            <Separator className="my-3" />
            
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>${getSubtotal().toLocaleString()}</span>
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
            
            <Separator className="my-4" />
            
            <div className="flex justify-between text-xl font-bold font-elegant">
              <span>Total Estimated Cost</span>
              <span className="text-primary">${getTotalPrice().toLocaleString()}</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              * Prices are estimates and may vary based on availability, seasonal rates, 
              and final specifications. A detailed quote will be provided upon inquiry.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="mt-6 glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-elegant">
              <Mail className="h-5 w-5 text-primary" />
              Get Your Detailed Quote
            </CardTitle>
          </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ready to book? Enter your email to receive a detailed quote and start planning your dream yacht charter.
          </p>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSendQuote}
              className="bg-gradient-ocean hover:opacity-90"
            >
              Send Quote
            </Button>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share Quote
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">
              Ready to proceed with booking? Schedule a consultation with our broker to finalize your charter.
            </p>
            <Button 
              onClick={onNext}
              className="w-full btn-3d bg-primary hover:bg-primary/90"
              size="lg"
            >
              Get a Broker
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteSummary;