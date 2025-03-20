
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List } from 'lucide-react';

interface TableViewControlsProps {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
  setFilterStatus: (status: 'all' | 'available' | 'occupied' | 'reserved') => void;
}

const TableViewControls = ({ view, setView, setFilterStatus }: TableViewControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
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
  );
};

export default TableViewControls;
