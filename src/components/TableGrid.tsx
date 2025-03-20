
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ExternalLink, ShoppingBag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  order?: {
    id: string;
    items: number;
    time: string;
  };
}

interface TableGridProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
}

const statusColors = {
  available: 'bg-green-500/10 border-green-500/30 text-green-600',
  occupied: 'bg-red-500/10 border-red-500/30 text-red-600',
  reserved: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
};

const TableGrid = ({ tables, onSelectTable }: TableGridProps) => {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleTableClick = (table: Table) => {
    // Call the provided onSelectTable callback
    onSelectTable(table);
    
    // Navigate to the orders page with table information
    navigate(`/orders?tableId=${table.id}&tableNumber=${table.number}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tables.map((table) => (
        <TooltipProvider key={table.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className={cn(
                  "relative aspect-square rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all border-2",
                  statusColors[table.status],
                  hoveredTable === table.id ? "shadow-lg" : "shadow-sm"
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTableClick(table)}
                onHoverStart={() => setHoveredTable(table.id)}
                onHoverEnd={() => setHoveredTable(null)}
              >
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  {table.status === 'occupied' && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <ShoppingBag className="h-4 w-4 ml-1" />
                    </>
                  )}
                </div>
                
                <span className="text-3xl font-bold">{table.number}</span>
                
                <div className="flex items-center mt-2 text-sm">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{table.seats}</span>
                </div>
                
                {table.status !== 'available' && (
                  <div className={cn(
                    "mt-3 text-xs px-2 py-0.5 rounded-full capitalize",
                    table.status === 'occupied' ? "bg-red-500/20" : "bg-amber-500/20"
                  )}>
                    {table.status}
                  </div>
                )}
                
                {table.order && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    {table.status === 'occupied' ? (
                      <div className="flex items-center">
                        <span>{table.order.items} items · {table.order.time}</span>
                        {table.status === 'occupied' && (
                          <ExternalLink className="h-3 w-3 ml-1 inline" />
                        )}
                      </div>
                    ) : (
                      `Reserved: ${table.order.time}`
                    )}
                  </div>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="text-xs text-center">
                <div className="font-medium">Table {table.number}</div>
                <div>{table.seats} seats · {table.status}</div>
                {table.order && (
                  <div className="mt-1 text-muted-foreground">
                    {table.status === 'occupied' 
                      ? `Order #${table.order.id} · ${table.order.items} items · Click to view`
                      : `Reserved for ${table.order.time}`
                    }
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default TableGrid;
