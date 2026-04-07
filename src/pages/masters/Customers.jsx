import { useState } from 'react';
import MastersList from '../../components/MastersList';
import MasterModal from '../../components/MasterModal';

const initialData = [
  { name: 'Rajesh Kumar', email: 'rajesh@techsol.in', phone: '+91 98765 43210', country: 'India', id: 1 },
  { name: 'Ahmed Al Maktoum', email: 'ahmed@emirates.ae', phone: '+971 50 123 4567', country: 'UAE', id: 2 }
];

export default function Customers() {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    if(window.confirm(`Delete ${item.name} permanently?`)) {
        setData(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleSave = (newItem) => {
    if (editingItem) {
      setData(prev => prev.map(i => i.id === newItem.id ? newItem : i));
    } else {
      setData(prev => [{ ...newItem, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <MastersList 
        title="Customers" 
        columns={['Name', 'Email', 'Phone', 'Country']} 
        data={data} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MasterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="customers"
        onSave={handleSave}
        editData={editingItem}
      />
    </>
  );
}