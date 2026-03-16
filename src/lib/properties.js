/**
 * =============================================================================
 * PROPERTIES DATA ACCESS LAYER
 * =============================================================================
 *
 * Unified API for accessing properties data.
 * Works with mock data when Supabase is not configured,
 * and with Supabase when it is.
 *
 * =============================================================================
 */

import { supabase, isSupabaseConfigured } from './supabase';
import {
  properties as mockProperties,
  PROPERTY_STATUS,
  PROPERTY_CATEGORY,
} from '@/data/properties';

// =============================================================================
// HELPER: Transform Supabase row to app format
// =============================================================================

function transformProperty(row) {
  if (!row) return null;

  return {
    id: row.id ?? null,
    slug: row.slug ?? '',
    title: row.title ?? '',
    titleEn: row.title_en ?? null,
    category: row.category ?? '',
    type: row.type ?? '',
    status: row.status ?? PROPERTY_STATUS.ACTIVE,
    price: row.price != null ? parseFloat(row.price) : 0,
    currency: row.currency ?? 'EUR',
    area: row.area != null ? parseFloat(row.area) : 0,
    rooms: row.rooms ?? null,
    floor: row.floor ?? null,
    totalFloors: row.total_floors ?? null,
    yearBuilt: row.year_built ?? null,
    yearBuiltStatus: row.year_built_status ?? null,
    city: row.city ?? '',
    cityEn: row.city_en ?? null,
    neighborhood: row.neighborhood ?? null,
    neighborhoodEn: row.neighborhood_en ?? null,
    address: row.address ?? '',
    addressEn: row.address_en ?? null,
    description: row.description ?? '',
    descriptionEn: row.description_en ?? null,
    features: Array.isArray(row.features) ? row.features : [],
    featuresEn: Array.isArray(row.features_en) ? row.features_en : [],
    images: Array.isArray(row.images) ? row.images : [],
    mapUrl: row.map_url ?? null,
    videoUrl: row.video_url ?? null,
    isFeatured: Boolean(row.is_featured),
    gaz: Boolean(row.gaz),
    tec: Boolean(row.tec),
    priceIncludesVat: Boolean(row.price_includes_vat),
    constructionType: row.construction_type ?? null,
    brokerNote: row.broker_note ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

// =============================================================================
// HELPER: Display values by locale (BG vs EN)
// =============================================================================

export function getDisplayText(property, locale) {
  if (!property) return null;
  const useEn = locale === 'en';
  return {
    title: (useEn && property.titleEn) ? property.titleEn : (property.title ?? ''),
    address: (useEn && property.addressEn) ? property.addressEn : (property.address ?? ''),
    neighborhood: (useEn && property.neighborhoodEn) ? property.neighborhoodEn : (property.neighborhood ?? null),
    city: (useEn && property.cityEn) ? property.cityEn : (property.city ?? ''),
    description: (useEn && property.descriptionEn) ? property.descriptionEn : (property.description ?? ''),
    features: (useEn && property.featuresEn?.length) ? property.featuresEn : (property.features ?? []),
  };
}

// =============================================================================
// HELPER: Check if value is a valid number for filtering
// =============================================================================

function isValidNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

// =============================================================================
// GET PROPERTY BY SLUG
// =============================================================================

export async function getPropertyBySlug(slug) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    return transformProperty(data);
  }

  return mockProperties.find(p => p.slug === slug) || null;
}

// =============================================================================
// GET SALE PROPERTIES
// =============================================================================

export async function getSaleProperties() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('category', PROPERTY_CATEGORY.SALE)
      .eq('status', PROPERTY_STATUS.ACTIVE)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sale properties:', error);
      return [];
    }

    return (data || []).map(transformProperty);
  }

  return mockProperties.filter(
    p => p.category === PROPERTY_CATEGORY.SALE && p.status === PROPERTY_STATUS.ACTIVE
  );
}

// =============================================================================
// GET RENT PROPERTIES
// =============================================================================

export async function getRentProperties() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('category', PROPERTY_CATEGORY.RENT)
      .eq('status', PROPERTY_STATUS.ACTIVE)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rent properties:', error);
      return [];
    }

    return (data || []).map(transformProperty);
  }

  return mockProperties.filter(
    p => p.category === PROPERTY_CATEGORY.RENT && p.status === PROPERTY_STATUS.ACTIVE
  );
}

// =============================================================================
// GET FEATURED PROPERTIES
// =============================================================================

export async function getFeaturedProperties() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .eq('status', PROPERTY_STATUS.ACTIVE)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }

    return (data || []).map(transformProperty);
  }

  return mockProperties.filter(
    p => p.isFeatured && p.status === PROPERTY_STATUS.ACTIVE
  );
}

// =============================================================================
// SEARCH PROPERTIES
// =============================================================================

export async function searchProperties(filters = {}) {
  const { category, type, city, minPrice, maxPrice, minArea, maxArea, rooms } = filters;

  if (isSupabaseConfigured) {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', PROPERTY_STATUS.ACTIVE);

    // String filters
    if (category) query = query.eq('category', category);
    if (type) query = query.eq('type', type);
    if (city) query = query.eq('city', city);

    // Numeric filters (check for valid numbers, including 0)
    if (isValidNumber(minPrice)) query = query.gte('price', minPrice);
    if (isValidNumber(maxPrice)) query = query.lte('price', maxPrice);
    if (isValidNumber(minArea)) query = query.gte('area', minArea);
    if (isValidNumber(maxArea)) query = query.lte('area', maxArea);
    if (isValidNumber(rooms)) query = query.eq('rooms', rooms);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error searching properties:', error);
      return [];
    }

    return (data || []).map(transformProperty);
  }

  // Mock data filtering
  return mockProperties.filter(p => {
    if (p.status !== PROPERTY_STATUS.ACTIVE) return false;

    // String filters
    if (category && p.category !== category) return false;
    if (type && p.type !== type) return false;
    if (city && p.city !== city) return false;

    // Numeric filters
    if (isValidNumber(minPrice) && p.price < minPrice) return false;
    if (isValidNumber(maxPrice) && p.price > maxPrice) return false;
    if (isValidNumber(minArea) && p.area < minArea) return false;
    if (isValidNumber(maxArea) && p.area > maxArea) return false;
    if (isValidNumber(rooms) && p.rooms !== rooms) return false;

    return true;
  });
}

// =============================================================================
// GET ALL PROPERTIES (for static generation)
// =============================================================================

export async function getAllProperties() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all properties:', error);
      return [];
    }

    return (data || []).map(transformProperty);
  }

  return mockProperties;
}

// =============================================================================
// GET ALL SLUGS (for static generation)
// =============================================================================

export async function getAllSlugs() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('properties')
      .select('slug');

    if (error) {
      console.error('Error fetching slugs:', error);
      return [];
    }

    return (data || []).map(row => row.slug);
  }

  return mockProperties.map(p => p.slug);
}

// =============================================================================
// ADMIN: GET ALL PROPERTIES (includes all statuses)
// =============================================================================

export async function getAllPropertiesAdmin() {
  if (!isSupabaseConfigured) {
    return { data: mockProperties, error: null, isDemo: true };
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin properties:', error);
    return { data: [], error: error.message, isDemo: false };
  }

  return { data: (data || []).map(transformProperty), error: null, isDemo: false };
}

// =============================================================================
// ADMIN: GET PROPERTY BY ID
// =============================================================================

export async function getPropertyById(id) {
  if (!isSupabaseConfigured) {
    const property = mockProperties.find(p => p.id === Number(id));
    return { data: property || null, error: null, isDemo: true };
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property by id:', error);
    return { data: null, error: error.message, isDemo: false };
  }

  return { data: transformProperty(data), error: null, isDemo: false };
}

// =============================================================================
// ADMIN: CREATE PROPERTY
// =============================================================================

function transformToSupabase(property) {
  const result = {
    slug: property.slug,
    title: property.title,
    category: property.category,
    type: property.type,
    status: property.status || PROPERTY_STATUS.ACTIVE,
    price: property.price,
    currency: property.currency || 'EUR',
    area: property.area,
    rooms: property.rooms || null,
    floor: property.floor || null,
    total_floors: property.totalFloors || null,
    year_built: property.yearBuilt || null,
    year_built_status: property.yearBuiltStatus || null,
    city: property.city,
    city_en: property.cityEn || null,
    neighborhood: property.neighborhood || null,
    neighborhood_en: property.neighborhoodEn || null,
    address: property.address,
    address_en: property.addressEn || null,
    title_en: property.titleEn || null,
    description: property.description || '',
    description_en: property.descriptionEn || null,
    features: property.features || [],
    features_en: property.featuresEn || [],
    images: property.images || [],
    map_url: property.mapUrl || null,
    video_url: property.videoUrl || null,
    is_featured: property.isFeatured || false,
    gaz: Boolean(property.gaz),
    tec: Boolean(property.tec),
    price_includes_vat: Boolean(property.priceIncludesVat),
    construction_type: property.constructionType || null,
    broker_note: property.brokerNote || null,
  };

  return result;
}

export async function createProperty(propertyData) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: 'Supabase не е конфигуриран. Моля, добавете NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local',
      isDemo: true
    };
  }

  const supabaseData = transformToSupabase(propertyData);

  const { data, error } = await supabase
    .from('properties')
    .insert([supabaseData])
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message, isDemo: false };
  }

  return { data: transformProperty(data), error: null, isDemo: false };
}

// =============================================================================
// ADMIN: UPDATE PROPERTY
// =============================================================================

export async function updateProperty(id, propertyData) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: 'Supabase не е конфигуриран. Моля, добавете NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local',
      isDemo: true
    };
  }

  const supabaseData = transformToSupabase(propertyData);

  const { data, error } = await supabase
    .from('properties')
    .update(supabaseData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message, isDemo: false };
  }

  return { data: transformProperty(data), error: null, isDemo: false };
}
