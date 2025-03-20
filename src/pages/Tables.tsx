import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import TableGrid, { Table } from '@/components/TableGrid';
import TableList from '@/components/tables/TableList';
import TableViewControls from '@/components/tables/TableViewControls';
import TableDialogContent from '@/components/tables/TableDialogContent';
import { sampleTables } from '@/data/sampleTables';

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
              <TableViewControls 
                view={view}
                setView={setView}
                setFilterStatus={setFilterStatus}
              />
            </div>
          </div>
        </header>

        <div className="mt-8">
          {view === 'grid' ? (
            <TableGrid tables={filteredTables} onSelectTable={handleSelectTable} />
          ) : (
            <TableList tables={filteredTables} onSelectTable={handleSelectTable} />
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <TableDialogContent 
            selectedTable={selectedTable}
            reservationDetails={reservationDetails}
            setReservationDetails={setReservationDetails}
            onClose={handleCloseDialog}
            onReserve={handleReserveTable}
            onFree={handleFreeTable}
          />
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Tables;
