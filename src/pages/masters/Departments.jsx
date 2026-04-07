import { useState } from 'react';
import MastersList from '../../components/MastersList';
import MasterModal from '../../components/MasterModal';
import { mockDepartments } from '../../mockData/masters';

export default function Departments() {
  // 1. Initialize data from mock file
  const [data, setData] = useState(mockDepartments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 2. Open Modal for Creation
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // 3. Open Modal for Editing
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 4. Delete Logic
  const handleDelete = (item) => {
    if(window.confirm(`Permanently remove the ${item.name} department?`)) {
        setData(prev => prev.filter(i => i.code !== item.code));
    }
  };

  const handleSave = (newItem) => {
  // We explicitly define the order here so the ID isn't first
  const formattedItem = {
    code: newItem.code,      // <--- Column 1
    name: newItem.name,      // <--- Column 2
    head: newItem.head,      // <--- Column 3
    count: newItem.count,    // <--- Column 4
    id: newItem.id || Date.now() // <--- ID at the end
  };

  if (editingItem) {
    setData(prev => prev.map(i => i.code === editingItem.code ? formattedItem : i));
  } else {
    setData(prev => [formattedItem, ...prev]);
  }
};

  return (
    <>
      <MastersList 
        title="Departments" 
        columns={['Dept Code', 'Department Name', 'Department Head', 'Employee Count']} 
        data={data} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MasterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="departments"
        onSave={handleSave}
        editData={editingItem}
      />
    </>
  );
}