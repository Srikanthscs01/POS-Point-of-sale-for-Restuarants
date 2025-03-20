
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TableOrderAlertProps {
  tableNumber: number | null;
  onClearTableFilter: () => void;
}

const TableOrderAlert = ({ tableNumber, onClearTableFilter }: TableOrderAlertProps) => {
  if (!tableNumber) return null;
  
  return (
    <Alert className="mb-4">
      <ShoppingBag className="h-4 w-4" />
      <AlertTitle>Table {tableNumber} Order</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>You are viewing the order for Table {tableNumber}</span>
        <Button variant="outline" size="sm" onClick={onClearTableFilter}>
          Clear
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default TableOrderAlert;
