
import { Table } from '@/components/TableGrid';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TableListProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
}

const TableList = ({ tables, onSelectTable }: TableListProps) => {
  return (
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
            {tables.map((table) => (
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
                  <Button variant="ghost" size="sm" onClick={() => onSelectTable(table)}>
                    {table.status === 'occupied' ? 'View Order' : 'Manage'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default TableList;
