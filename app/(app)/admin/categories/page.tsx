'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Navbar } from '../../(home)/navbar';
import { 
    Grid, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    Package,
    TrendingUp,
    Layers,
    Loader,
    RefreshCw,
    Menu,
    LayoutDashboard,
    Users,
    BarChart3,
    Bell,
    Settings,
    ChevronRight,
    Store,
    Car,
    Bike
} from 'lucide-react';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    subcategoryCount?: number;
    productCount?: number;
    status?: 'active' | 'inactive';
    createdAt?: string;
    _count?: {
        subcategories?: number;
        products?: number;
    };
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    category?: {
        id: string;
        name: string;
    };
    productCount?: number;
    status?: 'active' | 'inactive';
    createdAt?: string;
    _count?: {
        products?: number;
    };
}

export default function CategoriesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('categories');
    const [isSidebarOpen] = useState(true);
    const [isIconSidebarOpen, setIsIconSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState<'users' | 'staff' | 'categories' | 'ecommerce' | 'ride' | 'subcategories' | 'products' | 'brands' | 'orders' | 'analytics' | null>('categories');

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            
            if (response.ok) {
                const categoriesData = Array.isArray(data) ? data : (data.data || data.categories || []);
                setCategories(categoriesData);
            } else {
                setError(data.message || 'Failed to fetch categories');
            }
        } catch (err) {
            setError('Error connecting to server. Please try again.');
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubcategories = async () => {
        setIsLoadingSubcategories(true);
        try {
            const response = await fetch(`${API_URL}/subcategories`);
            const data = await response.json();
            
            if (response.ok) {
                const subcategoriesData = Array.isArray(data) ? data : (data.data || data.subcategories || []);
                setSubcategories(subcategoriesData);
            }
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        } finally {
            setIsLoadingSubcategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    const handleDelete = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        
        try {
            const response = await fetch(`${API_URL}/categories/${categoryId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                setCategories(prev => prev.filter(c => c.id !== categoryId));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete category');
            }
        } catch (err) {
            alert('Error deleting category. Please try again.');
            console.error('Error:', err);
        }
    };

    const handleDeleteSubcategory = async (subcategoryId: string) => {
        if (!confirm('Are you sure you want to delete this subcategory?')) return;
        
        try {
            const response = await fetch(`${API_URL}/subcategories/${subcategoryId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                setSubcategories(prev => prev.filter(s => s.id !== subcategoryId));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete subcategory');
            }
        } catch (err) {
            alert('Error deleting subcategory. Please try again.');
            console.error('Error:', err);
        }
    };

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (category.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredSubcategories = subcategories.filter(subcategory => {
        const matchesSearch = subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (subcategory.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || subcategory.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || subcategory.categoryId === categoryFilter || subcategory.category?.id === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getSubcategoryCount = (category: Category) => {
        return category.subcategoryCount || category._count?.subcategories || 0;
    };

    const getProductCount = (category: Category) => {
        return category.productCount || category._count?.products || 0;
    };

    const stats = {
        total: categories.length,
        active: categories.filter(c => c.status === 'active').length,
        inactive: categories.filter(c => c.status === 'inactive').length,
        totalProducts: categories.reduce((sum, c) => sum + getProductCount(c), 0)
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
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
                            onClick={() => setActiveSection(activeSection === 'ecommerce' ? null : 'ecommerce')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'ecommerce' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="E-commerce"
                        >
                            <Package className="w-5 h-5" />
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
                            <Settings className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 relative">
                            <Image src="https://i.pravatar.cc/100" alt="User" fill sizes="48px" className="object-cover" unoptimized />
                        </div>
                    </div>
                </aside>

                {/* Main Navigation Sidebar */}
                <aside className={`${
                    isIconSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white shadow-sm transition-all duration-300 ease-in-out fixed left-20 top-16 bottom-0 z-40 overflow-y-auto border-r border-gray-200`}>
                    <div className="p-4">
                        <div className="mb-6 px-2">
                            <h2 className="text-xl font-bold text-gray-900">Categories</h2>
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

                            {/* Category & Product Management Section */}
                            <div className="pt-4">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories & Products</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveSection(activeSection === 'categories' ? null : 'categories')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'categories' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Layers className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Categories</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'categories' ? 'rotate-90' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'categories' && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        <button 
                                            onClick={() => router.push('/admin/categories')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-blue-600 bg-blue-50 font-medium transition-all duration-200"
                                        >
                                            <span>All Categories</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/categories/add')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <span>Add Category</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/subcategories/add')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <span>Add Subcategory</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/products')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <span>All Products</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/products/add')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <span>Add Product</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Ecommerce Section */}
                            <div className="pt-4">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ecommerce</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveSection(activeSection === 'ecommerce' ? null : 'ecommerce')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'ecommerce' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Package className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Ecommerce</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'ecommerce' ? 'rotate-90' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'ecommerce' && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Orders</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Payments</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Ride Section */}
                            <div className="pt-4">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ride</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveSection(activeSection === 'ride' ? null : 'ride')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'ride' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Bike className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Taxi</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'ride' ? 'rotate-90' : ''}`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'ride' && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Bookings</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Earnings</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* System Section */}
                            <div className="pt-6 mt-4 border-t border-gray-200">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2 mt-4">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
                                    </div>
                                )}
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                    <Bell className="w-5 h-5" />
                                    {isSidebarOpen && <span className="font-medium text-sm">Notifications</span>}
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                    <Settings className="w-5 h-5" />
                                    {isSidebarOpen && <span className="font-medium text-sm">Settings</span>}
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${isIconSidebarOpen ? 'ml-[336px]' : 'ml-20'}`}>
                    <div className="container mx-auto px-6 py-10">
                {/* Error Message */}
                {error && (
                    <Card className="mb-6 bg-red-50 border-red-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <p className="text-red-700">{error}</p>
                            <Button variant="outline" size="sm" onClick={fetchCategories} className="text-red-600 border-red-300">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Category Management
                            </h1>
                            <p className="text-gray-600 text-lg">Manage your product categories and subcategories</p>
                        </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => { fetchCategories(); fetchSubcategories(); }}
                            className="rounded-2xl px-4 py-6"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={() => router.push(activeTab === 'categories' ? '/admin/categories/add' : '/admin/subcategories/add')}
                            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 shadow-xl shadow-indigo-500/30 px-6 py-6 text-base font-bold rounded-2xl"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add {activeTab === 'categories' ? 'Category' : 'Subcategory'}
                        </Button>
                    </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/80 backdrop-blur-xl border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                                    <Grid className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Categories</p>
                            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-xl border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Subcategories</p>
                            <p className="text-3xl font-black text-gray-900">{subcategories.length}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-xl border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Active Categories</p>
                            <p className="text-3xl font-black text-gray-900">{stats.active}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-xl border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
                            <p className="text-3xl font-black text-gray-900">{stats.totalProducts}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-xl border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Inactive Categories</p>
                            <p className="text-3xl font-black text-gray-900">{stats.inactive}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Categories and Subcategories */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="bg-white/80 backdrop-blur-xl border border-gray-200 p-1 rounded-xl">
                        <TabsTrigger 
                            value="categories" 
                            className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold"
                        >
                            <Grid className="w-4 h-4 mr-2" />
                            Categories ({categories.length})
                        </TabsTrigger>
                        <TabsTrigger 
                            value="subcategories" 
                            className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold"
                        >
                            <Layers className="w-4 h-4 mr-2" />
                            Subcategories ({subcategories.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Filters and Search */}
                    <Card className="my-6 bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder={`Search ${activeTab}...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 py-6 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                                        onClick={() => setStatusFilter('all')}
                                        className={`rounded-xl px-6 ${statusFilter === 'all' ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : ''}`}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'active' ? 'default' : 'outline'}
                                        onClick={() => setStatusFilter('active')}
                                        className={`rounded-xl px-6 ${statusFilter === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                                        onClick={() => setStatusFilter('inactive')}
                                        className={`rounded-xl px-6 ${statusFilter === 'inactive' ? 'bg-gradient-to-r from-gray-500 to-slate-500' : ''}`}
                                    >
                                        Inactive
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Tab Content */}
                    <TabsContent value="categories">
                        <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="font-bold text-gray-900">Name</TableHead>
                                            <TableHead className="font-bold text-gray-900">Slug</TableHead>
                                            <TableHead className="font-bold text-gray-900">Subcategories</TableHead>
                                            <TableHead className="font-bold text-gray-900">Products</TableHead>
                                            <TableHead className="font-bold text-gray-900">Status</TableHead>
                                            <TableHead className="font-bold text-gray-900 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCategories.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12">
                                                    <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                    <p className="text-gray-500 font-medium">No categories found</p>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                                        className="text-indigo-600"
                                                    >
                                                        Clear Filters
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredCategories.map((category) => (
                                                <TableRow key={category.id} className="hover:bg-indigo-50/50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                                                                <Grid className="w-5 h-5 text-indigo-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{category.name}</p>
                                                                <p className="text-xs text-gray-500 line-clamp-1">{category.description || 'No description'}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{category.slug}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                            {getSubcategoryCount(category)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            {getProductCount(category)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {category.status || 'active'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                                                                onClick={() => router.push(`/admin/categories/${category.id}`)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                                onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                                onClick={() => handleDelete(category.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Subcategories Tab Content */}
                    <TabsContent value="subcategories">
                        <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg">
                            <CardContent className="p-0">
                                {isLoadingSubcategories ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader className="w-8 h-8 text-purple-600 animate-spin" />
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                                <TableHead className="font-bold text-gray-900">Name</TableHead>
                                                <TableHead className="font-bold text-gray-900">Slug</TableHead>
                                                <TableHead className="font-bold text-gray-900">Parent Category</TableHead>
                                                <TableHead className="font-bold text-gray-900">Products</TableHead>
                                                <TableHead className="font-bold text-gray-900">Status</TableHead>
                                                <TableHead className="font-bold text-gray-900 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSubcategories.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-12">
                                                        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                        <p className="text-gray-500 font-medium">No subcategories found</p>
                                                        <Button
                                                            variant="link"
                                                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                                            className="text-purple-600"
                                                        >
                                                            Clear Filters
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredSubcategories.map((subcategory) => (
                                                    <TableRow key={subcategory.id} className="hover:bg-purple-50/50 transition-colors">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                                                    <Layers className="w-5 h-5 text-purple-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{subcategory.name}</p>
                                                                    <p className="text-xs text-gray-500 line-clamp-1">{subcategory.description || 'No description'}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{subcategory.slug}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                                {subcategory.category?.name || 'Unknown'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                {subcategory.productCount || subcategory._count?.products || 0}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${subcategory.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                                {subcategory.status || 'active'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex gap-2 justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="rounded-lg hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                                                                    onClick={() => router.push(`/admin/subcategories/${subcategory.id}`)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                                    onClick={() => router.push(`/admin/subcategories/${subcategory.id}/edit`)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                                    onClick={() => handleDeleteSubcategory(subcategory.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
}
