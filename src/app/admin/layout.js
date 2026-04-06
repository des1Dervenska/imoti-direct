import AdminChrome from '@/components/admin/AdminChrome';

export const metadata = {
  title: 'Admin | ART HOUSE 94',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}
