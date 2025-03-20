
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

interface TipSelectorProps {
  subtotal: number;
  discount: number;
  tipPercentage: number;
  setTipPercentage: (percentage: number) => void;
  customTip: string;
  setCustomTip: (value: string) => void;
  setTip: (value: number) => void;
}

const TipSelector = ({
  subtotal,
  discount,
  tipPercentage,
  setTipPercentage,
  customTip,
  setCustomTip,
  setTip
}: TipSelectorProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const handleTipSelection = (percentage: number) => {
    setTipPercentage(percentage);
    setTip((subtotal - discount) * (percentage / 100));
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    if (value === '') {
      setTip(0);
      setTipPercentage(0);
    } else {
      const tipValue = parseFloat(value);
      if (!isNaN(tipValue)) {
        setTip(tipValue);
        setTipPercentage(Math.round((tipValue / (subtotal - discount)) * 100));
      }
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>Add Tip</CardTitle>
        <CardDescription>Show appreciation for great service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[10, 15, 20].map((percent) => (
            <Button
              key={percent}
              variant={tipPercentage === percent ? "default" : "outline"}
              className="w-full"
              onClick={() => handleTipSelection(percent)}
            >
              {percent}% (${formatCurrency((subtotal - discount) * (percent / 100))})
            </Button>
          ))}
        </div>
        
        <div className="mt-4">
          <Label htmlFor="custom-tip">Custom tip</Label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="custom-tip"
              className="pl-9"
              placeholder="Enter amount"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipSelector;
