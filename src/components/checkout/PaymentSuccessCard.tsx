
import { useState } from 'react';
import { Check, Receipt, Printer, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentSuccessCardProps {
  onNewOrder: () => void;
}

const PaymentSuccessCard = ({ onNewOrder }: PaymentSuccessCardProps) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handlePrintReceipt = () => {
    // Create a new window to print
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Unable to open print window. Please check your popup settings.');
      return;
    }
    
    // Get current date and time
    const now = new Date();
    const dateFormatted = now.toLocaleDateString();
    const timeFormatted = now.toLocaleTimeString();
    
    // Retrieve order details from localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    let orderItems = [];
    let orderTotal = 0;
    
    if (savedOrder) {
      try {
        orderItems = JSON.parse(savedOrder);
        orderTotal = orderItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      } catch (e) {
        console.error('Failed to parse saved order', e);
      }
    }
    
    // Generate receipt HTML
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .receipt-items {
              margin-bottom: 20px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .totals {
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .total-line {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .grand-total {
              font-weight: bold;
              margin-top: 5px;
              font-size: 1.1em;
            }
            .receipt-footer {
              text-align: center;
              margin-top: 20px;
              font-size: 0.9em;
            }
            @media print {
              body {
                padding: 0;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <h2>Meal Mate</h2>
            <p>Receipt #${Math.floor(Math.random() * 100000)}</p>
            <p>${dateFormatted} ${timeFormatted}</p>
          </div>
          
          <div class="receipt-items">
            ${orderItems.map(item => `
              <div class="item">
                <span>${item.quantity || 1} x ${item.name}</span>
                <span>$${((item.price * (item.quantity || 1)).toFixed(2))}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Subtotal:</span>
              <span>$${orderTotal.toFixed(2)}</span>
            </div>
            <div class="total-line">
              <span>Tax (7%):</span>
              <span>$${(orderTotal * 0.07).toFixed(2)}</span>
            </div>
            <div class="total-line grand-total">
              <span>Total:</span>
              <span>$${(orderTotal * 1.07).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="receipt-footer">
            <p>Thank you for your order!</p>
            <p>Please come again</p>
          </div>
          
          <button onclick="window.print(); window.close();" style="display: block; margin: 20px auto; padding: 10px 20px;">
            Print Receipt
          </button>
        </body>
      </html>
    `;
    
    // Write the receipt HTML to the new window
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Auto print
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    toast.success('Receipt printed successfully!');
  };
  
  const handleSendEmail = () => {
    if (!email && !phoneNumber) {
      toast.error('Please enter an email or phone number');
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setIsEmailDialogOpen(false);
      
      if (email) {
        toast.success(`Receipt sent to ${email}`);
      }
      
      if (phoneNumber) {
        toast.success(`E-bill sent to ${phoneNumber}`);
      }
      
      // Reset form
      setEmail('');
      setPhoneNumber('');
    }, 1500);
  };
  
  return (
    <Card className="glass-card">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
        <p className="text-muted-foreground mb-6">Your order has been completed</p>
        
        <div className="flex justify-center space-x-3 mb-6">
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Receipt className="h-4 w-4 mr-2" />
                Send Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Receipt</DialogTitle>
                <DialogDescription>
                  Enter an email address or phone number to receive your receipt
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSendEmail} disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send Receipt'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
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
