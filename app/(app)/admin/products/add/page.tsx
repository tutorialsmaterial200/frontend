'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '../../../(home)/navbar';
import { 
    ArrowLeft,
    Upload,
    Save,
    X,
    Menu,
    LayoutDashboard,
    Users,
    Grid,
    Layers,
    FileText,
    Package,
    Tag,
    ShoppingCart,
    BarChart3,
    Bell,
    HelpCircle,
    Settings,
    ChevronRight,
    UserCheck,
    Store,
    Car,
    Loader,
    CheckCircle,
    AlertCircle,
    Plus
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId?: string;
    parentId?: string;
    parent?: {
        id: string;
        name: string;
    };
}

interface Merchant {
    id: string;
    storeName: string;
    businessName?: string;
    user?: {
        name: string;
        email?: string;
    };
}

export default function AddProductPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        comparePrice: '',
        stock: '',
        merchantId: '',
        categoryId: '',
        subcategoryId: ''
    });
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);
    const [isLoadingMerchants, setIsLoadingMerchants] = useState(true);
    const [isSidebarOpen] = useState(true);
    const [isIconSidebarOpen, setIsIconSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState<'users' | 'staff' | 'categories' | 'ecommerce' | 'ride' | 'subcategories' | 'products' | 'brands' | 'orders' | 'analytics' | null>('products');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Authorization check
    useEffect(() => {
        const verifyAccess = async () => {
            try {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    router.push('/');
                    return;
                }

                const userData = getUser();
                if (!userData || !hasRole('ADMIN')) {
                    router.push('/');
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Authorization error:', error);
                router.push('/');
            } finally {
                setAuthLoading(false);
            }
        };

        verifyAccess();
    }, [router]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/categories`);
                const data = await response.json();
                if (response.ok) {
                    let categoriesData: Category[] = [];
                    if (Array.isArray(data)) {
                        categoriesData = data;
                    } else if (data.data?.categories && Array.isArray(data.data.categories)) {
                        categoriesData = data.data.categories;
                    } else if (data.categories && Array.isArray(data.categories)) {
                        categoriesData = data.categories;
                    } else if (data.data && Array.isArray(data.data)) {
                        categoriesData = data.data;
                    }
                    setCategories(categoriesData);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        const fetchSubcategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/categories`);
                const data = await response.json();
                if (response.ok) {
                    let allCategories: Subcategory[] = [];
                    if (Array.isArray(data)) {
                        allCategories = data;
                    } else if (data.data?.categories && Array.isArray(data.data.categories)) {
                        allCategories = data.data.categories;
                    } else if (data.categories && Array.isArray(data.categories)) {
                        allCategories = data.categories;
                    } else if (data.data && Array.isArray(data.data)) {
                        allCategories = data.data;
                    }
                    // Filter subcategories (categories with parentId)
                    const subcats = allCategories.filter((cat: Subcategory) => cat.parentId || cat.parent);
                    setSubcategories(subcats);
                } else {
                    setSubcategories([]);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            } finally {
                setIsLoadingSubcategories(false);
            }
        };

        const fetchMerchants = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/merchants`);
                const data = await response.json();
                if (response.ok) {
                    let merchantsData: Merchant[] = [];
                    if (Array.isArray(data)) {
                        merchantsData = data;
                    } else if (data.data?.merchants && Array.isArray(data.data.merchants)) {
                        merchantsData = data.data.merchants;
                    } else if (data.merchants && Array.isArray(data.merchants)) {
                        merchantsData = data.merchants;
                    } else if (data.data && Array.isArray(data.data)) {
                        merchantsData = data.data;
                    }
                    setMerchants(merchantsData);
                } else {
                    setMerchants([]);
                }
            } catch (error) {
                console.error('Error fetching merchants:', error);
                setMerchants([]);
            } finally {
                setIsLoadingMerchants(false);
            }
        };

        fetchCategories();
        fetchSubcategories();
        fetchMerchants();
    }, [isAuthorized]);

    // Filter subcategories when category changes
    useEffect(() => {
        if (formData.categoryId) {
            const filtered = subcategories.filter(
                sub => sub.parentId === formData.categoryId || sub.parent?.id === formData.categoryId
            );
            setFilteredSubcategories(filtered);
            // Reset subcategory selection when category changes
            setFormData(prev => ({ ...prev, subcategoryId: '' }));
        } else {
            setFilteredSubcategories([]);
        }
    }, [formData.categoryId, subcategories]);

    const handleNameChange = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setFormData({ ...formData, name, slug });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedImages(prev => [...prev, ...newFiles]);
            
            // Create preview URLs
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('price', formData.price);
            submitData.append('stock', formData.stock);
            submitData.append('merchantId', formData.merchantId);
            submitData.append('categoryId', formData.categoryId);
            
            if (formData.subcategoryId) {
                submitData.append('subcategoryId', formData.subcategoryId);
            }
            if (formData.description) {
                submitData.append('description', formData.description);
            }
            if (formData.comparePrice) {
                submitData.append('comparePrice', formData.comparePrice);
            }
            if (formData.slug) {
                submitData.append('slug', formData.slug);
            }

            // Append images
            selectedImages.forEach((image) => {
                submitData.append('images', image);
            });

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/products/with-images`, {
                method: 'POST',
                body: submitData
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Product created successfully!' });
                setTimeout(() => {
                    router.push('/admin/products');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create product' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error creating product. Please try again.' });
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            {authLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Verifying access...</p>
                    </div>
                </div>
            ) : !isAuthorized ? (
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                             <p className="text-muted-foreground mb-4">You don&apos;t have permission to access this page. Only admins can add products.</p>
                            <Button onClick={() => router.push('/')}>Go Home</Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
            <div className="min-h-screen bg-gray-50 flex">
                {/* Icon Sidebar */}
                <aside className="w-20 bg-gradient-to-b from-purple-50 to-white shadow-sm fixed left-0 top-16 bottom-0 z-50 border-r border-gray-200 flex flex-col items-center py-6 gap-4">
                    <button 
                        onClick={() => setIsIconSidebarOpen(!isIconSidebarOpen)}
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-200"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>

                    <div className="flex-1 flex flex-col gap-3">
                        <button 
                            onClick={() => setActiveSection(activeSection === 'users' ? null : 'users')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'users' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="User Management"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'categories' ? null : 'categories')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'categories' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Categories"
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'subcategories' ? null : 'subcategories')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'subcategories' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Subcategories"
                        >
                            <Layers className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'products' ? null : 'products')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'products' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Products"
                        >
                            <FileText className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'ecommerce' ? null : 'ecommerce')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'ecommerce' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="E-commerce"
                        >
                            <Package className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'brands' ? null : 'brands')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'brands' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Brands"
                        >
                            <Tag className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'orders' ? null : 'orders')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'orders' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Orders"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'analytics' ? null : 'analytics')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'analytics' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Analytics"
                        >
                            <BarChart3 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-all duration-200">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-all duration-200">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-all duration-200">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </aside>

                {/* Main Navigation Sidebar */}
                <aside className={`${
                    isIconSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white shadow-sm transition-all duration-300 ease-in-out fixed left-20 top-16 bottom-0 z-40 overflow-y-auto border-r border-gray-200`}>
                    <div className="p-4">
                        <div className="mb-6 px-2">
                            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                        </div>

                        <nav className="space-y-1">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium text-sm">Dashboard</span>}
                            </button>

                            {/* User Management Section */}
                            <div className="pt-4">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User Management</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveSection(activeSection === 'users' ? null : 'users')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'users' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Users className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Users</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'users' ? 'rotate-90' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'users' && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        <button onClick={() => router.push('/admin/users')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Users className="w-4 h-4" />
                                            <span>All Users</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <UserCheck className="w-4 h-4" />
                                            <span>Customers</span>
                                        </button>
                                        <button onClick={() => router.push('/admin/merchants')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Store className="w-4 h-4" />
                                            <span>Sellers/Merchants</span>
                                        </button>
                                        <button onClick={() => router.push('/admin/riders')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Car className="w-4 h-4" />
                                            <span>Drivers/Riders</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Categories & Products Section */}
                            <div className="pt-4">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories & Products</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveSection(activeSection === 'categories' ? null : 'categories')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'categories' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Grid className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Categories</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'categories' ? 'rotate-90' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'categories' && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        <button onClick={() => router.push('/admin/categories')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Grid className="w-4 h-4" />
                                            <span>All Categories</span>
                                        </button>
                                        <button onClick={() => router.push('/admin/categories/add')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Plus className="w-4 h-4" />
                                            <span>Add Category</span>
                                        </button>
                                        <button onClick={() => router.push('/admin/subcategories/add')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Layers className="w-4 h-4" />
                                            <span>Add Subcategory</span>
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => setActiveSection(activeSection === 'products' ? null : 'products')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'products' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <FileText className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Products</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'products' ? 'rotate-90' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'products' && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        <button onClick={() => router.push('/admin/products')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Package className="w-4 h-4" />
                                            <span>All Products</span>
                                        </button>
                                        <button onClick={() => router.push('/admin/products/add')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-blue-600 bg-blue-50 font-medium">
                                            <Plus className="w-4 h-4" />
                                            <span>Add Product</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${isIconSidebarOpen ? 'ml-[336px]' : 'ml-20'} p-8 pt-24`}>
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/admin/products')}
                            className="mb-4 hover:bg-white/60"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
                        <p className="text-gray-600">Create a new product with images</p>
                    </div>

                    {/* Success/Error Message */}
                    {message && (
                        <Card className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <CardContent className="p-4 flex items-center gap-3">
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                                <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
                            </CardContent>
                        </Card>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card className="bg-white shadow-lg border-gray-200">
                                    <CardContent className="p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                    Product Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => handleNameChange(e.target.value)}
                                                    placeholder="e.g., iPhone 16 Pro"
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                                                    Slug
                                                </Label>
                                                <Input
                                                    id="slug"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    placeholder="auto-generated-from-name"
                                                    className="mt-1 font-mono text-sm"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Enter product description..."
                                                    className="mt-1 min-h-[120px]"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pricing & Inventory */}
                                <Card className="bg-white shadow-lg border-gray-200">
                                    <CardContent className="p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Inventory</h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                                    Price <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative mt-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">रू</span>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                        placeholder="0.00"
                                                        className="pl-8"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="comparePrice" className="text-sm font-medium text-gray-700">
                                                    Compare Price
                                                </Label>
                                                <div className="relative mt-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">रू</span>
                                                    <Input
                                                        id="comparePrice"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.comparePrice}
                                                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                                        placeholder="0.00"
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                                                    Stock <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="stock"
                                                    type="number"
                                                    min="0"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                    placeholder="100"
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Product Images */}
                                <Card className="bg-white shadow-lg border-gray-200">
                                    <CardContent className="p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Images</h2>
                                        
                                        <div className="space-y-4">
                                            {/* Image Previews */}
                                            {imagePreviews.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                                <Image
                                                                    src={preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    width={200}
                                                                    height={200}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                            {index === 0 && (
                                                                <Badge className="absolute bottom-2 left-2 bg-blue-500">Main</Badge>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload Area */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600 font-medium">Click to upload images</p>
                                                <p className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP up to 10MB each</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Category & Merchant Selection */}
                                <Card className="bg-white shadow-lg border-gray-200">
                                    <CardContent className="p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization</h2>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="merchantId" className="text-sm font-medium text-gray-700">
                                                    Merchant <span className="text-red-500">*</span>
                                                </Label>
                                                {isLoadingMerchants ? (
                                                    <div className="mt-1 flex items-center gap-2 text-gray-500">
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm">Loading merchants...</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        id="merchantId"
                                                        value={formData.merchantId}
                                                        onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Select a merchant</option>
                                                        {Array.isArray(merchants) ? merchants.map((merchant) => (
                                                            <option key={merchant.id} value={merchant.id}>
                                                                {merchant.storeName || merchant.businessName || merchant.user?.name} {merchant.user?.email ? `(${merchant.user.email})` : ''}
                                                            </option>
                                                        )) : null}
                                                    </select>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                                                    Category <span className="text-red-500">*</span>
                                                </Label>
                                                {isLoadingCategories ? (
                                                    <div className="mt-1 flex items-center gap-2 text-gray-500">
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm">Loading categories...</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        id="categoryId"
                                                        value={formData.categoryId}
                                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Select a category</option>
                                                        {Array.isArray(categories) ? categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        )) : null}
                                                    </select>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="subcategoryId" className="text-sm font-medium text-gray-700">
                                                    Subcategory
                                                </Label>
                                                {isLoadingSubcategories ? (
                                                    <div className="mt-1 flex items-center gap-2 text-gray-500">
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm">Loading subcategories...</span>
                                                    </div>
                                                ) : !formData.categoryId ? (
                                                    <p className="mt-1 text-sm text-gray-400">Select a category first</p>
                                                ) : filteredSubcategories.length === 0 ? (
                                                    <p className="mt-1 text-sm text-gray-400">No subcategories available</p>
                                                ) : (
                                                    <select
                                                        id="subcategoryId"
                                                        value={formData.subcategoryId}
                                                        onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Select a subcategory (optional)</option>
                                                        {Array.isArray(filteredSubcategories) ? filteredSubcategories.map((subcategory) => (
                                                            <option key={subcategory.id} value={subcategory.id}>
                                                                {subcategory.name}
                                                            </option>
                                                        )) : null}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <Card className="bg-white shadow-lg border-gray-200">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !formData.name || !formData.price || !formData.stock || !formData.merchantId || !formData.categoryId}
                                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Create Product
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.push('/admin/products')}
                                                className="w-full"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Info */}
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <h3 className="text-sm font-semibold text-blue-900 mb-2">API Endpoint</h3>
                                        <code className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded block break-all">
                                            POST /products/with-images
                                        </code>
                                        <p className="text-xs text-blue-600 mt-2">
                                            Uses multipart/form-data for image upload
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
            )}
        </>
    );
}
