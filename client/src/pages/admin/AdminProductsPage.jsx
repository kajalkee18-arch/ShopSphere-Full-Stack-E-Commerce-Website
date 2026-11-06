import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const AdminProductsPage = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    category: '',
    imageUrl: '',
    isFeatured: false
  });

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ limit: 50, keyword: searchKeyword }),
        productService.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.data.products);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load products/categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [searchKeyword]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedProductId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      sku: '',
      category: categories[0]?._id || '',
      imageUrl: '',
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setIsEditing(true);
    setSelectedProductId(prod._id);
    setFormData({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      stock: prod.stock,
      sku: prod.sku,
      category: prod.category?._id || categories[0]?._id,
      imageUrl: prod.images?.[0]?.url || '',
      isFeatured: prod.isFeatured || false
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setIsUploadingImage(true);
    try {
      const res = await adminService.uploadImage(uploadFormData);
      if (res.success) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }));
        addToast('Image uploaded successfully!');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image file', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.stock || !formData.category) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock: Number(formData.stock),
        sku: formData.sku,
        category: formData.category,
        isFeatured: formData.isFeatured,
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : undefined
      };

      if (isEditing) {
        const res = await adminService.updateProduct(selectedProductId, payload);
        if (res.success) {
          addToast('Product updated successfully!');
        }
      } else {
        const res = await adminService.createProduct(payload);
        if (res.success) {
          addToast('New product created successfully!');
        }
      }

      setIsModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await adminService.deleteProduct(id);
        if (res.success) {
          addToast('Product deleted');
          fetchProductsAndCategories();
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete product', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Product Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update, and monitor inventory items and pricing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleOpenAddModal} icon={Plus}>
            Add New Product
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <Spinner label="Loading products..." className="min-h-[40vh]" />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100'}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-white truncate">{prod.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">SKU: {prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-300">
                      {prod.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {formatCurrency(prod.discountPrice > 0 ? prod.discountPrice : prod.price)}
                      {prod.discountPrice > 0 && (
                        <span className="text-[10px] text-slate-500 line-through block font-normal">
                          {formatCurrency(prod.price)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {prod.stock <= 5 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                          {prod.stock} (Low)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          {prod.stock} in stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {prod.isFeatured ? (
                        <span className="text-emerald-400 font-bold">Yes</span>
                      ) : (
                        <span className="text-slate-600">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id, prod.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete Product"
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
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Product' : 'Add New Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Aura Pro ANC Headphones"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="SKU Code"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. AUD-001"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="9999"
              required
            />
            <Input
              label="Discount Price (₹)"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              placeholder="7999"
            />
            <Input
              label="Initial Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="25"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Product Image (URL or Upload from Computer)
              </label>
              <label className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1">
                {isUploadingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isUploadingImage ? 'Uploading...' : 'Choose Local File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
            </div>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-... or upload from PC"
            />
            {formData.imageUrl && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <span className="text-[11px] text-slate-500 truncate flex-1">{formData.imageUrl}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Write detailed specifications..."
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded text-indigo-600"
            />
            <label htmlFor="isFeatured" className="text-xs text-slate-700 font-semibold cursor-pointer">
              Feature this product on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {isEditing ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;

