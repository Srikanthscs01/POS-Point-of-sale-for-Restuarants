import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, LayoutGrid, List, Plus, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import TableGrid, { Table } from '@/components/TableGrid';

// Sample table data
const sampleTables: Table[] = [
  { id: 1, number: 1, seats: 2, status: 'available' },
  { id: 2, number: 2, seats: 4, status: 'occupied', order: { id: 'ORD-5392', items: 4, time: '12:35 PM' } },
  { id: 3, number: 3, seats: 2, status: 'reserved', order: { id: 'RSV-421', items: 0, time: '1:00 PM' } },
  { id: 4, number: 4, seats: 4, status: 'available' },
  { id: 5, number: 5, seats: 6, status: 'occupied', order: { id: 'ORD-5389', items: 3, time: '12:10 PM' } },
  { id: 6, number: 6, seats: 2, status: 'available' },
  { id: 7, number: 7, seats: 2, status: 'occupied', order: { id: 'ORD-5391', items: 2, time: '12:22 PM' } },
  { id: 8, number: 8, seats: 4, status: 'available' },
  { id: 9, number: 9, seats: 8, status: 'reserved', order: { id: 'RSV-422', items: 0, time: '7:30 PM' } },
  { id: 10, number: 10, seats: 4, status: 'occupied', order: { id: 'ORD-5388', items: 5, time: '12:05 PM' } },
  { id: 11, number: 11, seats: 2, status: 'available' },
  { id: 12, number: 12, seats: 6, status: 'occupied', order: { id: 'ORD-5390', items: 6, time: '12:15 PM' } },
  { id: 13, number: 13, seats: 4, status: 'available' },
  { id: 14, number: 14, seats: 2, status: 'reserved', order: { id: 'RSV-423', items: 0, time: '6:45 PM' } },
  { id: 15, number: 15, seats: 4, status: 'occupied', order: { id: 'ORD-5387', items: 4, time: '11:55 AM' } },
  { id: 16, number: 16, seats: 8, status: 'available' },
];

const Tables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>(sampleTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    name: '',
    guests: 2,
    time: '',
    phone: '',
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');

  const filteredTables = tables.filter(table => {
    if (filterStatus === 'all') return true;
    return table.status === filterStatus;
  });

  const handleSelectTable = (table: Table) => {
    // If the table is occupied, navigate to Orders
    if (table.status === 'occupied' && table.order) {
      navigate(`/orders?tableId=${table.id}&tableNumber=${table.number}`);
      return;
    }
    
    // Otherwise, show the dialog
    setSelectedTable(table);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTable(null);
    setReservationDetails({
      name: '',
      guests: 2,
      time: '',
      phone: '',
    });
  };

  const handleReserveTable = () => {
    if (!selectedTable) return;
    
    // Update the table status
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === selectedTable.id
          ? { 
              ...table, 
              status: 'reserved' as const,
              order: { 
                id: `RSV-${Math.floor(Math.random() * 1000)}`, 
                items: 0, 
                time: reservationDetails.time 
              }
            }
          : table
      )
    );
    
    toast.success(`Table ${selectedTable.number} reserved for ${reservationDetails.name}`);
    handleCloseDialog();
  };

  const handleFreeTable = () => {
    if (!selectedTable) return;
    
    // Update the table status
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === selectedTable.id
          ? { 
              ...table, 
              status: 'available' as const,
              order: undefined
            }
          : table
      )
    );
    
    toast.success(`Table ${selectedTable.number} is now available`);
    handleCloseDialog();
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tables</h1>
              <p className="text-muted-foreground mt-1">Manage restaurant tables and reservations</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <div className="flex rounded-md overflow-hidden">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('grid')}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Tabs defaultValue="all" className="w-full max-w-xs">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="available" 
                    onClick={() => setFilterStatus('available')}
                    className="text-green-600"
                  >
                    Free
                  </TabsTrigger>
                  <TabsTrigger 
                    value="occupied" 
                    onClick={() => setFilterStatus('occupied')}
                    className="text-red-600"
                  >
                    Busy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reserved" 
                    onClick={() => setFilterStatus('reserved')}
                    className="text-amber-600"
                  >
                    Booked
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </header>

        <div className="mt-8">
          {view === 'grid' ? (
            <TableGrid tables={filteredTables} onSelectTable={handleSelectTable} />
          ) : (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-muted-foreground">Table</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Seats</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Order/Reservation</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((table) => (
                      <tr key={table.id} className="border-b">
                        <td className="p-4 font-medium">Table {table.number}</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {table.seats}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            table.status === 'available' ? "bg-green-100 text-green-800" :
                            table.status === 'occupied' ? "bg-red-100 text-red-800" :
                            "bg-amber-100 text-amber-800"
                          )}>
                            {table.status === 'available' ? 'Available' :
                              table.status === 'occupied' ? 'Occupied' : 'Reserved'}
                          </span>
                        </td>
                        <td className="p-4">
                          {table.order ? (
                            <div>
                              <div className="font-medium">{table.order.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {table.status === 'occupied' 
                                  ? `${table.order.items} items · ${table.order.time}`
                                  : `Reserved for ${table.order.time}`
                                }
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleSelectTable(table)}>
                            {table.status === 'occupied' ? 'View Order' : 'Manage'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedTable && `Table ${selectedTable.number}`}
              </DialogTitle>
              <DialogDescription>
                {selectedTable && `${selectedTable.seats} seats · Currently ${selectedTable.status}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTable && (
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
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              
              {selectedTable && selectedTable.status === 'available' ? (
                <Button 
                  onClick={handleReserveTable}
                  disabled={!reservationDetails.name || !reservationDetails.time}
                >
                  Reserve Table
                </Button>
              ) : (
                <Button 
                  onClick={handleFreeTable}
                  variant="default"
                >
                  Mark as Available
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Tables;
