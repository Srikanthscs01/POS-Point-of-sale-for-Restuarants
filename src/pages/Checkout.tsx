
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  DollarSign, 
  Check, 
  ArrowLeft,
  Receipt,
  Printer,
  Clock,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { MenuItem } from '@/components/MenuCard';
import CouponApplier from '@/components/CouponApplier';
import { Coupon } from '@/data/sampleCoupons';

type PaymentMethod = 'card' | 'cash' | 'mobile';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [tip, setTip] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [cashAmount, setCashAmount] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Load cart from local storage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      setCart(parsedOrder);
      
      // Calculate totals
      const cartSubtotal = parsedOrder.reduce((sum: number, item: MenuItem) => sum + (item.price * (item.quantity || 1)), 0);
      setSubtotal(cartSubtotal);
      
      // Recalculate with any applied coupon
      calculateTotals(cartSubtotal, appliedCoupon);
    } else {
      // If no cart, redirect to orders page
      navigate('/orders');
    }
  }, [navigate, appliedCoupon]);

  const calculateTotals = (subTotal: number, coupon: Coupon | null) => {
    let discountAmount = 0;
    
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discountAmount = subTotal * (coupon.discountValue / 100);
      } else {
        discountAmount = coupon.discountValue;
      }
    }
    
    const discountedSubtotal = subTotal - discountAmount;
    const taxAmount = discountedSubtotal * 0.07;
    const totalAmount = discountedSubtotal + taxAmount;
    
    setDiscount(discountAmount);
    setTax(taxAmount);
    setTotal(totalAmount);
    
    // Recalculate tip based on discounted subtotal
    if (tipPercentage > 0) {
      setTip(discountedSubtotal * (tipPercentage / 100));
    }
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

  const handleApplyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
    calculateTotals(subtotal, coupon);
    
    if (coupon) {
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    }
  };

  const handlePayment = () => {
    if (selectedPayment === 'cash' && (!cashAmount || parseFloat(cashAmount) < (total + tip))) {
      toast.error('Cash amount must be equal to or greater than the total');
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentComplete(true);
      localStorage.removeItem('currentOrder');
      toast.success('Payment successful!');
    }, 1500);
  };

  const handleNewOrder = () => {
    navigate('/orders');
  };

  const handleGoBack = () => {
    navigate('/orders');
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  if (paymentComplete) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-md">
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
                  <Button onClick={handleNewOrder}>
                    Start New Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <Button variant="ghost" className="mb-6" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Order
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="hover-lift overflow-hidden">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before payment</CardDescription>
              </CardHeader>
              
              <CardContent className="px-0">
                <div className="px-6 pb-4">
                  <div className="text-sm text-muted-foreground mb-3">Order items</div>
                </div>
                
                <div className="max-h-80 overflow-y-auto px-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 border-t">
                      <div>
                        <div className="font-medium">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                      <div className="font-medium">
                        ${((item.quantity || 1) * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-6 mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${formatCurrency(subtotal)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Ticket className="h-3 w-3" />
                          {appliedCoupon?.discountType === 'percentage' 
                            ? `Discount (${appliedCoupon.discountValue}%)`
                            : 'Discount'}
                        </span>
                        <span>-${formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (7%)</span>
                      <span>${formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tip ({tipPercentage}%)</span>
                      <span>${formatCurrency(tip)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${formatCurrency(total + tip)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Discounts & Coupons</CardTitle>
                <CardDescription>Apply any coupon codes you have</CardDescription>
              </CardHeader>
              <CardContent>
                <CouponApplier 
                  subtotal={subtotal} 
                  onApplyCoupon={handleApplyCoupon} 
                  appliedCoupon={appliedCoupon}
                />
              </CardContent>
            </Card>
            
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
                  onClick={handlePayment}
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
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
