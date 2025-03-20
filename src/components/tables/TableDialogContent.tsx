
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/TableGrid';

interface TableDialogContentProps {
  selectedTable: Table | null;
  reservationDetails: {
    name: string;
    guests: number;
    time: string;
    phone: string;
  };
  setReservationDetails: React.Dispatch<React.SetStateAction<{
    name: string;
    guests: number;
    time: string;
    phone: string;
  }>>;
  onClose: () => void;
  onReserve: () => void;
  onFree: () => void;
}

const TableDialogContent = ({ 
  selectedTable, 
  reservationDetails, 
  setReservationDetails,
  onClose,
  onReserve,
  onFree
}: TableDialogContentProps) => {
  if (!selectedTable) return null;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          Table {selectedTable.number}
        </DialogTitle>
        <DialogDescription>
          {selectedTable.seats} seats · Currently {selectedTable.status}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        {selectedTable.status === 'available' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                value={reservationDetails.name}
                onChange={(e) => setReservationDetails({ ...reservationDetails, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={selectedTable.seats}
                  value={reservationDetails.guests}
                  onChange={(e) => setReservationDetails({ ...reservationDetails, guests: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  placeholder="e.g. 7:30 PM"
                  value={reservationDetails.time}
                  onChange={(e) => setReservationDetails({ ...reservationDetails, time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={reservationDetails.phone}
                onChange={(e) => setReservationDetails({ ...reservationDetails, phone: e.target.value })}
              />
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {selectedTable.order && (
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-medium">{selectedTable.order.id}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedTable.status === 'occupied' 
                    ? `${selectedTable.order.items} items · ${selectedTable.order.time}`
                    : `Reserved for ${selectedTable.order.time}`
                  }
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              {selectedTable.status === 'occupied' 
                ? 'This table is currently occupied. You can mark it as available once the customers leave.'
                : 'This table is reserved. You can free it up if needed.'
              }
            </p>
          </div>
        )}
      </div>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        
        {selectedTable.status === 'available' ? (
          <Button 
            onClick={onReserve}
            disabled={!reservationDetails.name || !reservationDetails.time}
          >
            Reserve Table
          </Button>
        ) : (
          <Button 
            onClick={onFree}
            variant="default"
          >
            Mark as Available
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default TableDialogContent;
