import { useState } from 'react';
import MastersList from '../../components/MastersList';
import MasterModal from '../../components/MasterModal';
import { mockDesignations } from '../../mockData/masters';

export default function Designations() {
  // 1. Initialize data state
  const [data, setData] = useState(mockDesignations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 2. Open Modal for new entry
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // 3. Open Modal with existing data
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 4. Delete with confirmation
  const handleDelete = (item) => {
    if(window.confirm(`Are you sure you want to remove the "${item.title}" designation?`)) {
        // Since designations might not have a hyphen-code, we filter by title
        setData(prev => prev.filter(i => i.title !== item.title));
    }
  };

  const handleSave = (newItem) => {
  const formattedItem = {
    title: newItem.title,       // <--- Column 1
    department: newItem.department,
    level: newItem.level,
    id: newItem.id || Date.now() // <--- ID at the end
  };

  if (editingItem) {
    setData(prev => prev.map(i => i.title === editingItem.title ? formattedItem : i));
  } else {
    setData(prev => [formattedItem, ...prev]);
  }
};

  return (
    <>
      <MastersList 
        title="Designations" 
        columns={['Job Title', 'Associated Department', 'Seniority Level']} 
        data={data} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MasterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="designations"
        onSave={handleSave}
        editData={editingItem}
      />
    </>
  );
}