import PostersForm from '@/components/admin/PostersForm';
import { getHomePosters } from '@/lib/banners';

export const metadata = {
  title: 'Рекламни постери | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminPostersPage() {
  const { data, error } = await getHomePosters();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Рекламни постери (3 броя)</h1>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">{error}</div>}
      <PostersForm initialPosters={data || []} />
    </div>
  );
}
