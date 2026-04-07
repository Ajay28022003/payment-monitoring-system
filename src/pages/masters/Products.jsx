import { useState } from 'react';
import MastersList from '../../components/MastersList';
import MasterModal from '../../components/MasterModal';
import { mockProducts } from '../../mockData/masters';

export default function Products() {
  // Generate IDs on initial load
  const [data, setData] = useState(() => 
    mockProducts.map((item, index) => ({ ...item, id: `prd-${index}-${Date.now()}` }))
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (newItem) => {
    if (editingItem) {
      setData(prev => prev.map(i => i.id === newItem.id ? newItem : i));
    } else {
      setData(prev => [{ ...newItem, id: `prd-${Date.now()}` }, ...prev]);
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if(window.confirm(`Delete product ${item.name}?`)) {
      setData(prev => prev.filter(i => i.id !== item.id));
    }
  };

  return (
    <>
      <MastersList 
        title="Products" 
        columns={['Product Code', 'Product Name', 'Category', 'Base Price']} 
        data={data} 
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />
      <MasterModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
        type="products" 
        onSave={handleSave} 
        editData={editingItem} 
      />
    </>
  );
}