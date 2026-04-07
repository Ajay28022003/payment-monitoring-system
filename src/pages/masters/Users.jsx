import { useState } from 'react';
import MastersList from '../../components/MastersList';
import MasterModal from '../../components/MasterModal';
import { mockUsers } from '../../mockData/masters';

export default function Users() {
  const [data, setData] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (newItem) => {
    if (editingItem) {
      setData(prev => prev.map(i => i.id === newItem.id ? newItem : i));
    } else {
      setData(prev => [{ ...newItem, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if(window.confirm(`Remove user ${item.name} from the system?`)) {
      setData(prev => prev.filter(i => i.id !== item.id));
    }
  };

  return (
    <>
      <MastersList 
        title="System Users" 
        columns={['Full Name', 'Email Address', 'System Role', 'Department']} 
        data={data} 
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />
      <MasterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type="users" onSave={handleSave} editData={editingItem} />
    </>
  );
}