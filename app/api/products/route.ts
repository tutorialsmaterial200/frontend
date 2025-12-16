import { NextResponse } from 'next/server';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
    stock: number;
}

interface BackendProduct {
    id: string;
    name: string;
    description: string;
    price: string;
    images: string[];
    stock: number;
    category?: {
        name: string;
    };
}

export async function GET() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';
    
    try {
        const apiUrl = `${backendUrl}/products`;
        console.log(`Fetching products from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        // Handle nested data structure from backend
        let backendProducts: BackendProduct[] = [];
        if (Array.isArray(data)) {
            backendProducts = data;
        } else if (data.data?.products && Array.isArray(data.data.products)) {
            backendProducts = data.data.products;
        } else if (data.products && Array.isArray(data.products)) {
            backendProducts = data.products;
        } else if (data.data && Array.isArray(data.data)) {
            backendProducts = data.data;
        }
        
        // Transform backend data to match frontend interface
        const products: Product[] = backendProducts.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: parseFloat(p.price),
            image: p.images && p.images.length > 0 ? p.images[0] : '/placeholder.webp',
            category: p.category?.name || 'Uncategorized',
            inStock: p.stock > 0,
            stock: p.stock,
        }));
        
        console.log(`✓ Fetched ${products.length} products from backend`);
        return NextResponse.json(products);
    } catch (error) {
        console.error('Backend fetch failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products from backend' },
            { status: 500 }
        );
    }
}
