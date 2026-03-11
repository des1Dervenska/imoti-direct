import PropertyForm from '@/components/admin/PropertyForm';
import { isSupabaseConfigured } from '@/lib/supabase';

export const metadata = {
  title: 'Нов имот | Admin',
};

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Добави нов имот</h1>
      <PropertyForm isDemo={!isSupabaseConfigured} />
    </div>
  );
}
