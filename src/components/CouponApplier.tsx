
import { useState } from 'react';
import { Ticket, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Coupon, sampleCoupons } from '@/data/sampleCoupons';

interface CouponApplierProps {
  subtotal: number;
  onApplyCoupon: (coupon: Coupon | null) => void;
  appliedCoupon: Coupon | null;
}

const CouponApplier = ({ subtotal, onApplyCoupon, appliedCoupon }: CouponApplierProps) => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    const coupon = sampleCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
    );

    if (!coupon) {
      setError('Invalid coupon code');
      setSuccess(false);
      return;
    }

    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (currentDate > expiryDate) {
      setError('This coupon has expired');
      setSuccess(false);
      return;
    }

    if (subtotal < coupon.minimumOrderAmount) {
      setError(`This coupon requires a minimum order of $${coupon.minimumOrderAmount.toFixed(2)}`);
      setSuccess(false);
      return;
    }

    onApplyCoupon(coupon);
    setError(null);
    setSuccess(true);
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponCode('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="coupon-code">Apply Coupon</Label>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
          <div className="flex items-center space-x-2">
            <Ticket className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">{appliedCoupon.code}</div>
              <div className="text-xs text-muted-foreground">{appliedCoupon.description}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="coupon-code"
                className="pl-9"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setError(null);
                  setSuccess(false);
                }}
              />
            </div>
            <Button onClick={handleApplyCoupon}>Apply</Button>
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="py-2 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Coupon applied successfully!</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default CouponApplier;
