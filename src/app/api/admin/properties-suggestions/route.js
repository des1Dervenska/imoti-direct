import { getAllPropertiesAdmin } from '@/lib/properties';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/properties-suggestions
 * Връща уникални стойности за град/квартал (БГ и EN) от всички имоти –
 * за подсказки (datalist) в админ формата. Полетата остават свободни за въвеждане.
 */
export async function GET() {
  try {
    const { data: properties, error, isDemo } = await getAllPropertiesAdmin();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const list = properties || [];
    const cities = [...new Set(list.map((p) => p.city).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const citiesEn = [...new Set(list.map((p) => p.cityEn).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const neighborhoods = [...new Set(list.map((p) => p.neighborhood).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const neighborhoodsEn = [...new Set(list.map((p) => p.neighborhoodEn).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    return NextResponse.json({
      cities,
      citiesEn,
      neighborhoods,
      neighborhoodsEn,
      isDemo: !!isDemo,
    });
  } catch (err) {
    console.error('[properties-suggestions]', err);
    return NextResponse.json(
      { error: 'Грешка при зареждане на подсказките' },
      { status: 500 }
    );
  }
}
