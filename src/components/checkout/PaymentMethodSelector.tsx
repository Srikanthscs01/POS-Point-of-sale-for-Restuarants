
import { useState } from 'react';
import { CreditCard, Wallet, Smartphone, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';

export type PaymentMethod = 'card' | 'cash' | 'mobile';

interface PaymentMethodSelectorProps {
  selectedPayment: PaymentMethod;
  setSelectedPayment: (method: PaymentMethod) => void;
  total: number;
  tip: number;
  cashAmount: string;
  setCashAmount: (amount: string) => void;
  onPayment: () => void;
  processingPayment: boolean;
}

const PaymentMethodSelector = ({
  selectedPayment,
  setSelectedPayment,
  total,
  tip,
  cashAmount,
  setCashAmount,
  onPayment,
  processingPayment
}: PaymentMethodSelectorProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose how you'd like to pay</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={selectedPayment === 'card' ? "default" : "outline"}
            className="flex flex-col h-24 items-center justify-center"
            onClick={() => setSelectedPayment('card')}
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span>Card</span>
          </Button>
          
          <Button
            variant={selectedPayment === 'cash' ? "default" : "outline"}
            className="flex flex-col h-24 items-center justify-center"
            onClick={() => setSelectedPayment('cash')}
          >
            <Wallet className="h-6 w-6 mb-2" />
            <span>Cash</span>
          </Button>
          
          <Button
            variant={selectedPayment === 'mobile' ? "default" : "outline"}
            className="flex flex-col h-24 items-center justify-center"
            onClick={() => setSelectedPayment('mobile')}
          >
            <Smartphone className="h-6 w-6 mb-2" />
            <span>Mobile</span>
          </Button>
        </div>
        
        {selectedPayment === 'cash' && (
          <div className="mt-4">
            <Label htmlFor="cash-amount">Cash amount</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="cash-amount"
                className="pl-9"
                placeholder="Enter amount"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>
            
            {cashAmount && !isNaN(parseFloat(cashAmount)) && parseFloat(cashAmount) >= (total + tip) && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Change: </span>
                <span className="font-medium">${formatCurrency(parseFloat(cashAmount) - (total + tip))}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          onClick={onPayment}
          disabled={processingPayment}
        >
          {processingPayment ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${formatCurrency(total + tip)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodSelector;
