import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const AdminCategoriesPage = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedId(null);
    setName('');
    setDescription('');
    setImage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setIsEditing(true);
    setSelectedId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        const res = await adminService.updateCategory(selectedId, { name, description, image });
        if (res.success) addToast('Category updated!');
      } else {
        const res = await adminService.createCategory({ name, description, image });
        if (res.success) addToast('New category created!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        const res = await adminService.deleteCategory(id);
        if (res.success) {
          addToast('Category deleted');
          fetchCategories();
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Category Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize products into intuitive collections for customers
          </p>
        </div>

        <Button onClick={handleOpenAddModal} icon={Plus}>
          Add New Category
        </Button>
      </div>

      {isLoading ? (
        <Spinner label="Loading categories..." className="min-h-[40vh]" />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-4">Slug</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=100'}
                        alt={cat.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <span className="font-bold text-white">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-indigo-400">{cat.slug}</td>
                  <td className="py-4 px-4 max-w-xs text-slate-400 truncate">
                    {cat.description || 'No description'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smart Wearables"
            required
          />
          <Input
            label="Cover Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Short description..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;

