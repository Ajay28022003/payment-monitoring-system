import { useState } from 'react';
import MastersList from '../../components/MastersList';
import MasterModal from '../../components/MasterModal';
import { mockPartners } from '../../mockData/masters';

export default function Partners() {
  // 1. Generate IDs on initial load so editing works
  const [data, setData] = useState(() => 
    mockPartners.map((item, index) => ({ ...item, id: `ptr-${index}-${Date.now()}` }))
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (newItem) => {
    if (editingItem) {
      // 2. Update existing: newItem already has the original ID from the modal
      setData(prev => prev.map(i => i.id === newItem.id ? newItem : i));
    } else {
      // 3. Create new: add a fresh ID
      setData(prev => [{ ...newItem, id: `ptr-${Date.now()}` }, ...prev]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if(window.confirm(`Delete partner ${item.name}?`)) {
      setData(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <MastersList 
        title="Partners & Distributors" 
        columns={['Company Name', 'Email', 'Phone', 'Country']} 
        data={data} 
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <MasterModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
        type="partners" 
        onSave={handleSave} 
        editData={editingItem} 
      />
    </>
  );
}