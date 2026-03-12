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
    city: row.city ?? '',
    neighborhood: row.neighborhood ?? null,
    address: row.address ?? '',
    description: row.description ?? '',
    features: Array.isArray(row.features) ? row.features : [],
    images: Array.isArray(row.images) ? row.images : [],
    mapUrl: row.map_url ?? null,
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
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
    city: property.city,
    neighborhood: property.neighborhood || null,
    address: property.address,
    description: property.description || '',
    features: property.features || [],
    images: property.images || [],
    map_url: property.mapUrl || null,
    is_featured: property.isFeatured || false,
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
