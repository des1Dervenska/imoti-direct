import UnusedStoragePanel from '@/components/admin/UnusedStoragePanel';

export const metadata = {
  title: 'Storage cleanup | Admin',
};

export default function AdminStoragePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Почистване на storage</h1>
      <p className="text-gray-600 mb-6">
        Намери и изтрий Supabase снимки, които не се използват от нито една обява или постер.
      </p>
      <UnusedStoragePanel />
    </div>
  );
}
