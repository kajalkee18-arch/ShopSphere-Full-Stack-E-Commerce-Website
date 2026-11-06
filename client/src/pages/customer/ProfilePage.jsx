import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Plus, Trash2, Shield, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ProfilePage = () => {
  const { user, updateProfile, addAddress, deleteAddress } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // New address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const updateData = { name, phone };
    if (password) updateData.password = password;

    const res = await updateProfile(updateData);
    setIsUpdating(false);
    if (res.success) {
      addToast('Profile updated successfully!');
      setPassword('');
    } else {
      addToast(res.message || 'Failed to update profile', 'error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.postalCode || !newAddr.phone) {
      addToast('Please complete all address fields', 'error');
      return;
    }
    const res = await addAddress(newAddr);
    if (res.success) {
      addToast('Address added to your address book!');
      setIsAddingAddress(false);
      setNewAddr({
        fullName: user?.name || '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: user?.phone || ''
      });
    }
  };

  const handleDeleteAddress = async (addrId) => {
    const res = await deleteAddress(addrId);
    if (res.success) {
      addToast('Address removed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Account Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal information, security credentials, and shipping addresses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Profile Avatar & Details */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 h-fit text-center">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-indigo-50 shadow-md">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {user?.role} Account
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user?.phone || 'No phone added'}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Form & Address Book */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Edit Profile Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Personal Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  icon={Phone}
                  value={phone}
                  placeholder="+91 9876543210"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Input
                label="New Password (leave blank to keep current)"
                type="password"
                placeholder="Enter at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" isLoading={isUpdating} icon={Save}>
                Save Changes
              </Button>
            </form>
          </div>

          {/* Saved Delivery Addresses */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Saved Shipping Addresses
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingAddress ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {/* Address List */}
            {user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{addr.fullName}</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">📞 {addr.phone}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">No addresses saved yet.</p>
            )}

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Street Address / House No."
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    required
                  />
                  <Input
                    label="PIN Code"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" size="sm">
                  Save Address
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
