'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductImage } from '@/components/ui/product-image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Navbar } from '@/components/products/Navbar';
import { SearchInput } from '@/components/products/SearchInput';
import { Categories } from '@/components/products/Categories';
import { useCart } from '@/hooks/use-cart';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number | string;
    image?: string;
    images?: (string | { url: string; alt?: string })[];
    category?: string | { id: string; name: string };
    inStock?: boolean;
    stock: number;
    isActive?: boolean;
    isApproved?: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch from backend API with all products
                console.log('Fetching products from backend...');
                const response = await fetch(`${API_URL}/products?limit=1000`);
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Handle paginated response format
                const productsData = Array.isArray(data) ? data : (data.products || data.data || []);
                // Filter to show only active AND admin-approved products on public page
                const activeProducts = productsData.filter((p: Product) => p.isActive !== false && p.isApproved !== false);
                console.log('Products loaded:', activeProducts.length, 'active & approved items out of', productsData.length, 'total');
                setProducts(activeProducts);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="w-12 h-12" />
                    <p className="text-muted-foreground">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(products.map(p => {
        if (typeof p.category === 'string') return p.category;
        return p.category?.name || 'Uncategorized';
    })))];
    
    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryName = typeof product.category === 'string' ? product.category : product.category?.name || '';
        const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Helper to get product image
    const getProductImage = (product: Product): string => {
        if (product.image) return product.image;
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            return typeof firstImage === 'string' ? firstImage : firstImage?.url || '';
        }
        return '';
    };

    // Helper to get category name
    const getCategoryName = (product: Product): string => {
        if (typeof product.category === 'string') return product.category;
        return product.category?.name || 'Uncategorized';
    };

    // Helper to get price as number
    const getPrice = (product: Product): number => {
        return typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <Categories 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div className="container mx-auto px-4 py-6">

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    <ProductImage
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Badge variant="secondary">Out of Stock</Badge>
                                        </div>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardContent className="p-3">
                                    <Badge variant="outline" className="text-xs mb-2">
                                        {getCategoryName(product)}
                                    </Badge>
                                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold">रू {getPrice(product).toFixed(2)}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span>4.5</span>
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full mt-3" 
                                        size="sm"
                                        disabled={product.stock <= 0}
                                        onClick={() => addToCart({
                                            id: product.id,
                                            name: product.name,
                                            price: getPrice(product),
                                            image: getProductImage(product),
                                            stock: product.stock,
                                        })}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
