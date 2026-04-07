import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin | ART HOUSE 94',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <AdminHeader />

      {/* Admin Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 pb-12">
        {children}
      </main>
    </div>
  );
}
