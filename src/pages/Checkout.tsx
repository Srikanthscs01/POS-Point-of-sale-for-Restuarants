import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { MenuItem } from '@/components/MenuCard';
import CouponApplier from '@/components/CouponApplier';
import { Coupon } from '@/data/sampleCoupons';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';
import TipSelector from '@/components/checkout/TipSelector';
import PaymentMethodSelector, { PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import PaymentSuccessCard from '@/components/checkout/PaymentSuccessCard';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  useEffect(() => {
    let parsedOrder: MenuItem[] = [];
    let hasOrder = false;
    
    if (location.state && location.state.items && Array.isArray(location.state.items)) {
      parsedOrder = location.state.items;
      hasOrder = parsedOrder.length > 0;
      
      if (location.state.tableNumber) {
        setTableNumber(location.state.tableNumber);
      }
    }
    
    if (!hasOrder) {
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        try {
          parsedOrder = JSON.parse(savedOrder);
          hasOrder = parsedOrder.length > 0;
        } catch (e) {
          console.error('Failed to parse saved order', e);
        }
      }
    }
    
    if (hasOrder) {
      setCart(parsedOrder);
      localStorage.setItem('currentOrder', JSON.stringify(parsedOrder));
      
      const cartSubtotal = parsedOrder.reduce((sum: number, item: MenuItem) => 
        sum + (item.price * (item.quantity || 1)), 0);
      setSubtotal(cartSubtotal);
      
      calculateTotals(cartSubtotal, appliedCoupon);
    } else {
      toast.error('No items in your order. Redirecting to orders page.');
      navigate('/orders');
    }
  }, [navigate, location, appliedCoupon]);

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
    
    if (tipPercentage > 0) {
      setTip(discountedSubtotal * (tipPercentage / 100));
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
          <PaymentSuccessCard onNewOrder={handleNewOrder} />
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
            <OrderSummaryCard 
              cart={cart}
              subtotal={subtotal}
              tax={tax}
              total={total}
              tip={tip}
              tipPercentage={tipPercentage}
              discount={discount}
              formatCurrency={formatCurrency}
            />
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
            
            <TipSelector
              subtotal={subtotal}
              discount={discount}
              tipPercentage={tipPercentage}
              setTipPercentage={setTipPercentage}
              customTip={customTip}
              setCustomTip={setCustomTip}
              setTip={setTip}
            />
            
            <PaymentMethodSelector
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              total={total}
              tip={tip}
              cashAmount={cashAmount}
              setCashAmount={setCashAmount}
              onPayment={handlePayment}
              processingPayment={processingPayment}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
