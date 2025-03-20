
import { Check, Receipt, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent
} from '@/components/ui/card';

interface PaymentSuccessCardProps {
  onNewOrder: () => void;
}

const PaymentSuccessCard = ({ onNewOrder }: PaymentSuccessCardProps) => {
  return (
    <Card className="glass-card">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
        <p className="text-muted-foreground mb-6">Your order has been completed</p>
        
        <div className="flex justify-center space-x-3 mb-6">
          <Button variant="outline" size="sm">
            <Receipt className="h-4 w-4 mr-2" />
            Email Receipt
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
        </div>
        
        <div className="text-center mt-8">
          <h3 className="text-lg font-medium mb-2">Thank you for your order!</h3>
          <div className="flex justify-center mt-6">
            <Button onClick={onNewOrder}>
              Start New Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSuccessCard;
