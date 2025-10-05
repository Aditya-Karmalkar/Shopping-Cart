import { GET, Product } from './route';

interface ProductsResponse {
  products: Product[];
}

describe('/api/products', () => {
  it('should return products array', async () => {
    const response = await GET();
    const data = await response.json() as ProductsResponse;
    
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBe(true);
  });

  it('should return 8 products', async () => {
    const response = await GET();
    const data = await response.json() as ProductsResponse;
    
    expect(data.products).toHaveLength(8);
  });

  it('should have correct product structure', async () => {
    const response = await GET();
    const data = await response.json() as ProductsResponse;
    const product = data.products[0];
    
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('priceCents');
    expect(product).toHaveProperty('image');
    expect(typeof product.id).toBe('string');
    expect(typeof product.name).toBe('string');
    expect(typeof product.description).toBe('string');
    expect(typeof product.priceCents).toBe('number');
    expect(typeof product.image).toBe('string');
  });

  it('should return valid price values', async () => {
    const response = await GET();
    const data = await response.json() as ProductsResponse;
    
    data.products.forEach((product: Product) => {
      expect(product.priceCents).toBeGreaterThan(0);
      expect(Number.isInteger(product.priceCents)).toBe(true);
    });
  });

  it('should return unique product ids', async () => {
    const response = await GET();
    const data = await response.json() as ProductsResponse;
    const ids = data.products.map((p: Product) => p.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(ids.length);
  });
});
