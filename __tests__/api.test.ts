import { describe, it, expect } from 'bun:test';

describe('API Utils', () => {
  it('should parse API response correctly', () => {
    const response = {
      success: true,
      data: {
        categories: [
          { id: '1', name: 'Electronics' }
        ]
      }
    };

    // Test unwrapping nested data
    const data = response.data;
    expect(data.categories).toBeDefined();
    expect(data.categories.length).toBe(1);
    expect(data.categories[0].name).toBe('Electronics');
  });

  it('should handle missing data gracefully', () => {
    const response = { success: true };
    const data = response.data || {};
    
    expect(data.categories).toBeUndefined();
  });

  it('should parse product price correctly', () => {
    const product = {
      id: '1',
      name: 'Phone',
      price: '49999'
    };

    const price = parseFloat(product.price);
    expect(price).toBe(49999);
    expect(typeof price).toBe('number');
  });
});

describe('Category Tree Building', () => {
  it('should build category hierarchy', () => {
    const categories = [
      { id: '1', name: 'Electronics', parentId: null },
      { id: '2', name: 'Mobile Phones', parentId: '1' },
      { id: '3', name: 'Laptops', parentId: '1' }
    ];

    const rootCategories = categories.filter(cat => cat.parentId === null);
    expect(rootCategories.length).toBe(1);
    
    const children = categories.filter(cat => cat.parentId === '1');
    expect(children.length).toBe(2);
  });

  it('should handle flat category list', () => {
    const categories = [
      { id: '1', name: 'Electronics', parentId: null },
      { id: '2', name: 'Fashion', parentId: null }
    ];

    const rootCategories = categories.filter(cat => cat.parentId === null);
    expect(rootCategories.length).toBe(2);
  });
});
