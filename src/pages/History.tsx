
import { useState } from 'react';
import { DownloadIcon, Search, Filter, ArrowUpDown } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

type OrderStatus = 'completed' | 'cancelled' | 'refunded';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  timestamp: string;
  table: number;
  server: string;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  status: OrderStatus;
}

// Sample order history data
const sampleOrders: Order[] = [
  {
    id: 'ORD-5392',
    timestamp: '2023-05-15T12:35:00',
    table: 3,
    server: 'Alex Kim',
    total: 42.97,
    items: [
      { name: 'Classic Cheeseburger', price: 8.99, quantity: 2 },
      { name: 'French Fries', price: 3.99, quantity: 2 },
      { name: 'Vanilla Milkshake', price: 4.99, quantity: 2 },
      { name: 'Caesar Salad', price: 7.99, quantity: 1 },
    ],
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
  {
    id: 'ORD-5391',
    timestamp: '2023-05-15T12:22:00',
    table: 7,
    server: 'Jordan Smith',
    total: 28.98,
    items: [
      { name: 'Margherita Pizza', price: 12.99, quantity: 1 },
      { name: 'Caesar Salad', price: 7.99, quantity: 1 },
      { name: 'Strawberry Cheesecake', price: 6.99, quantity: 1 },
    ],
    paymentMethod: 'Cash',
    status: 'completed',
  },
  {
    id: 'ORD-5390',
    timestamp: '2023-05-15T12:15:00',
    table: 12,
    server: 'Morgan Lee',
    total: 94.92,
    items: [
      { name: 'BBQ Ribs', price: 17.99, quantity: 2 },
      { name: 'Fish & Chips', price: 13.99, quantity: 1 },
      { name: 'Chicken Alfredo', price: 14.99, quantity: 1 },
      { name: 'French Fries', price: 3.99, quantity: 2 },
      { name: 'Onion Rings', price: 4.99, quantity: 1 },
      { name: 'Vanilla Milkshake', price: 4.99, quantity: 2 },
      { name: 'Chocolate Brownie', price: 5.99, quantity: 1 },
    ],
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
  {
    id: 'ORD-5389',
    timestamp: '2023-05-15T12:10:00',
    table: 5,
    server: 'Alex Kim',
    total: 36.97,
    items: [
      { name: 'Veggie Wrap', price: 9.99, quantity: 1 },
      { name: 'Fish & Chips', price: 13.99, quantity: 1 },
      { name: 'French Fries', price: 3.99, quantity: 1 },
      { name: 'Vanilla Milkshake', price: 4.99, quantity: 1 },
      { name: 'Strawberry Cheesecake', price: 6.99, quantity: 1 },
    ],
    paymentMethod: 'Mobile Payment',
    status: 'refunded',
  },
  {
    id: 'ORD-5388',
    timestamp: '2023-05-15T12:05:00',
    table: 10,
    server: 'Jordan Smith',
    total: 64.95,
    items: [
      { name: 'Classic Cheeseburger', price: 8.99, quantity: 2 },
      { name: 'BBQ Ribs', price: 17.99, quantity: 1 },
      { name: 'Chicken Alfredo', price: 14.99, quantity: 1 },
      { name: 'French Fries', price: 3.99, quantity: 2 },
      { name: 'Vanilla Milkshake', price: 4.99, quantity: 1 },
    ],
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
  {
    id: 'ORD-5387',
    timestamp: '2023-05-15T11:55:00',
    table: 15,
    server: 'Morgan Lee',
    total: 33.96,
    items: [
      { name: 'Margherita Pizza', price: 12.99, quantity: 1 },
      { name: 'Veggie Wrap', price: 9.99, quantity: 1 },
      { name: 'French Fries', price: 3.99, quantity: 1 },
      { name: 'Onion Rings', price: 4.99, quantity: 1 },
    ],
    paymentMethod: 'Cash',
    status: 'cancelled',
  },
  {
    id: 'ORD-5386',
    timestamp: '2023-05-15T11:40:00',
    table: 8,
    server: 'Alex Kim',
    total: 49.95,
    items: [
      { name: 'Fish & Chips', price: 13.99, quantity: 1 },
      { name: 'Chicken Alfredo', price: 14.99, quantity: 1 },
      { name: 'Caesar Salad', price: 7.99, quantity: 1 },
      { name: 'Chocolate Brownie', price: 5.99, quantity: 2 },
    ],
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
];

const History = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `table ${order.table}`.includes(searchTerm.toLowerCase()) ||
      order.server.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleToggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-amber-100 text-amber-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">View and manage past orders</p>
        </header>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Tabs defaultValue="all" className="w-full max-w-xs">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  onClick={() => setFilterStatus('completed')}
                  className="text-green-600"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger 
                  value="cancelled" 
                  onClick={() => setFilterStatus('cancelled')}
                  className="text-red-600"
                >
                  Cancelled
                </TabsTrigger>
                <TabsTrigger 
                  value="refunded" 
                  onClick={() => setFilterStatus('refunded')}
                  className="text-amber-600"
                >
                  Refunded
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon" onClick={handleToggleSort}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date/Time</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Table</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Server</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No orders found matching your search
                    </td>
                  </tr>
                ) : (
                  sortedOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4">{formatTimestamp(order.timestamp)}</td>
                      <td className="p-4">Table {order.table}</td>
                      <td className="p-4">{order.server}</td>
                      <td className="p-4">${order.total.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {selectedOrder && `${formatTimestamp(selectedOrder.timestamp)} • Table ${selectedOrder.table}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{selectedOrder.id}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Server: {selectedOrder.server}
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="font-medium">Order Items</div>
                  <div className="border rounded-md divide-y">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-3">
                        <div>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(selectedOrder.total / 1.07).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (7%)</span>
                    <span>${(selectedOrder.total - selectedOrder.total / 1.07).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Payment Method: </span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
              </div>
            )}
            
            <DialogFooter className="flex sm:justify-between gap-2">
              <Button variant="outline" size="sm" className="sm:mr-auto" onClick={handleCloseDialog}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCloseDialog}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Receipt
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default History;
