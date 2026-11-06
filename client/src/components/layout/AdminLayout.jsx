import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-900/50 p-6 sm:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

