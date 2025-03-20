
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Clock3, Utensils, ArrowUpRight, DollarSign } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Sample data for charts
  const pieData = [
    { name: 'Main Course', value: 45 },
    { name: 'Appetizers', value: 25 },
    { name: 'Desserts', value: 15 },
    { name: 'Beverages', value: 15 },
  ];
  
  const barData = [
    { name: 'Mon', sales: 1200 },
    { name: 'Tue', sales: 1900 },
    { name: 'Wed', sales: 2100 },
    { name: 'Thu', sales: 2400 },
    { name: 'Fri', sales: 2700 },
    { name: 'Sat', sales: 3500 },
    { name: 'Sun', sales: 3000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Sample data for stats
  const stats = [
    { 
      title: 'Today\'s Revenue', 
      value: '$3,452.00', 
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-primary bg-primary/10' 
    },
    { 
      title: 'Active Tables', 
      value: '12/16', 
      change: '75%',
      trend: 'up',
      icon: Utensils,
      color: 'text-indigo-500 bg-indigo-500/10' 
    },
    { 
      title: 'Total Customers', 
      value: '48', 
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'text-pink-500 bg-pink-500/10' 
    },
    { 
      title: 'Avg. Serving Time', 
      value: '24 min', 
      change: '-2 min',
      trend: 'down',
      icon: Clock3,
      color: 'text-amber-500 bg-amber-500/10' 
    },
  ];

  // Sample active orders
  const activeOrders = [
    { id: 'ORD-5392', table: 3, items: 4, time: '12:35 PM', status: 'preparing' },
    { id: 'ORD-5391', table: 7, items: 2, time: '12:22 PM', status: 'ready' },
    { id: 'ORD-5390', table: 12, items: 6, time: '12:15 PM', status: 'served' },
    { id: 'ORD-5389', table: 5, items: 3, time: '12:10 PM', status: 'preparing' },
  ];

  // Simplified table reservation status
  const tables = {
    available: 4,
    occupied: 9,
    reserved: 3,
    total: 16
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button onClick={() => navigate('/orders')}>
                New Order
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Card className="hover-lift">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                      <div className={`text-xs font-medium mt-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from yesterday
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="lg:col-span-2 hover-lift">
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
              <CardDescription>Overview of this week's revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={barData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                      }}
                      formatter={(value) => [`$${value}`, 'Sales']}
                    />
                    <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Orders by Category</CardTitle>
              <CardDescription>Distribution of order items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle>Table Status</CardTitle>
              <CardDescription>Current status of all tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 rounded-lg p-4 text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Available</h4>
                  <p className="text-2xl font-bold text-green-600 mt-1">{tables.available}</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-4 text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Occupied</h4>
                  <p className="text-2xl font-bold text-red-600 mt-1">{tables.occupied}</p>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-4 text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Reserved</h4>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{tables.reserved}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Total</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{tables.total}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/tables')}>
                <span>View All Tables</span>
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-2 hover-lift">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex gap-3 items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'ready' ? 'bg-green-500' : 
                        order.status === 'preparing' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">Table {order.table} · {order.items} items</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="capitalize text-sm font-medium">{order.status}</div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
