'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Navbar } from '../../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';
import {
    Package,
    Plus,
    Trash2,
    Edit,
    AlertCircle,
    CheckCircle,
    Loader,
    Upload,
    X,
    Menu,
    LayoutDashboard,
    Users,
    Grid,
    Layers,
    FileText,
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
    Headphones,
    FileCheck,
    CreditCard,
    UserPlus,
    UserCog,
    Bike
} from 'lucide-react';

interface ProductImage {
    id?: string;
    url: string;
    alt?: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    comparePrice: string;
    stock: number;
    images: (string | ProductImage)[];
    merchant: {
        id: string;
        storeName: string;
        status: string;
    };
    category: {
        id: string;
        name: string;
    };
    createdAt: string;
    isActive?: boolean;
    isApproved?: boolean;
}

interface User {
    name?: string;
    email?: string;
    role?: string;
}

interface FormData {
    name: string;
    slug: string;
    description: string;
    price: string;
    comparePrice: string;
    stock: string;
    merchantId: string;
    categoryId: string;
    images: ProductImage[];
}

export default function AdminProducts() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isIconSidebarOpen, setIsIconSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isApproving, setIsApproving] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<'users' | 'staff' | 'categories' | 'ecommerce' | 'ride' | 'subcategories' | 'products' | 'brands' | 'orders' | 'analytics' | null>('categories');
    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        slug: '',
        description: '',
        price: '',
        comparePrice: '',
        stock: '',
        merchantId: '',
        categoryId: '',
        images: []
    });

    useEffect(() => {
        const verifyAccess = async () => {
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

            setUser(userData);
            await fetchProducts();
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products?limit=1000`);
            const data = await response.json();
            if (response.ok) {
                const productsData = Array.isArray(data) ? data : (data.data || data.products || []);
                // Show all products in admin panel
                setProducts(productsData);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        setIsDeleting(productId);
        try {
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                setProducts(prev => prev.filter(p => p.id !== productId));
                setMessage({ type: 'success', text: 'Product deleted successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to delete product' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error deleting product. Please try again.' });
            console.error('Error:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleApprove = async (productId: string) => {
        setIsApproving(productId);
        try {
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: true }),
            });
            
            if (response.ok) {
                // Remove from list since it's now approved (isActive: true)
                setProducts(prev => prev.filter(p => p.id !== productId));
            } else {
                console.error('Failed to approve product');
            }
        } catch (error) {
            console.error('Error approving product:', error);
        } finally {
            setIsApproving(null);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.merchant?.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && product.isActive === true) ||
                            (statusFilter === 'inactive' && product.isActive !== true);
        return matchesSearch && matchesStatus;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
        setFormData(prev => ({
            ...prev,
            slug
        }));
    };

    const handleAddImage = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url: '', alt: '' }]
        }));
    };

    const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => 
                i === index ? { ...img, [field]: value } : img
            )
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    comparePrice: parseFloat(formData.comparePrice),
                    stock: parseInt(formData.stock),
                    merchantId: formData.merchantId,
                    categoryId: formData.categoryId,
                    images: formData.images.filter(img => img.url)
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Product created successfully!' });
                setProducts(prev => [data.data, ...prev]);
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    price: '',
                    comparePrice: '',
                    stock: '',
                    merchantId: '',
                    categoryId: '',
                    images: []
                });
                setShowForm(false);
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create product' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error creating product. Please try again.' });
            console.error('Error:', error);
        } finally {
            setFormLoading(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-muted-foreground">Loading...</p>
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
                    {/* Logo Icon */}
                    <button 
                        onClick={() => setIsIconSidebarOpen(!isIconSidebarOpen)}
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-200"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>

                    {/* Icon Menu Items */}
                    <div className="flex-1 flex flex-col gap-3">
                        <button 
                            onClick={() => setActiveSection(activeSection === 'users' ? null : 'users')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'users' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="User Management"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'categories' ? null : 'categories')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'categories' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Categories"
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'subcategories' ? null : 'subcategories')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'subcategories' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Subcategories"
                        >
                            <Layers className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'products' ? null : 'products')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'products' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Products"
                        >
                            <FileText className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'ecommerce' ? null : 'ecommerce')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'ecommerce' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="E-commerce"
                        >
                            <Package className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'brands' ? null : 'brands')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'brands' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Brands"
                        >
                            <Tag className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'orders' ? null : 'orders')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'orders' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Orders"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveSection(activeSection === 'analytics' ? null : 'analytics')}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                activeSection === 'analytics' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Analytics"
                        >
                            <BarChart3 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Bottom Icons */}
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
                        {/* Sidebar Header */}
                        <div className="mb-6 px-2">
                            <h2 className="text-xl font-bold text-gray-900">Products</h2>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="space-y-1">
                            {/* Dashboard */}
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
                                        activeSection === 'users' 
                                            ? 'bg-gray-100 text-gray-900' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Users className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Users</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                                                activeSection === 'users' ? 'rotate-90' : ''
                                            }`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'users' && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        <button 
                                            onClick={() => router.push('/admin/users')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>All Users</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <UserCheck className="w-4 h-4" />
                                            <span>Customers</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/merchants')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                                        >
                                            <Store className="w-4 h-4" />
                                            <span>Sellers/Merchants</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/merchants/verification')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                                        >
                                            <FileCheck className="w-4 h-4" />
                                            <span>Merchant Verification</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/riders')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                                        >
                                            <Car className="w-4 h-4" />
                                            <span>Drivers/Riders</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <Headphones className="w-4 h-4" />
                                            <span>Support Staff</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <FileCheck className="w-4 h-4" />
                                            <span>KYC Verification</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <CreditCard className="w-4 h-4" />
                                            <span>Payment Management</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium">
                                            <UserPlus className="w-4 h-4" />
                                            <span>Create User</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Staff Management Section */}
                            <div className="pt-4">
                                {isSidebarOpen && (
                                    <div className="px-3 mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff & Roles</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveSection(activeSection === 'staff' ? null : 'staff')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        activeSection === 'staff' 
                                            ? 'bg-gray-100 text-gray-900' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <UserCog className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Staff Management</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                                                activeSection === 'staff' ? 'rotate-90' : ''
                                            }`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'staff' && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>All Staff</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Support Team</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Role Assignment</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Add Staff Member</span>
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
                                        activeSection === 'categories' 
                                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Layers className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Categories</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                                                activeSection === 'categories' ? 'rotate-90' : ''
                                            }`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'categories' && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        <button 
                                            onClick={() => router.push('/admin/categories')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
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
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-blue-600 bg-blue-50 font-medium transition-all duration-200"
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
                                        activeSection === 'ecommerce' 
                                            ? 'bg-gray-100 text-gray-900' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Package className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Ecommerce</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                                                activeSection === 'ecommerce' ? 'rotate-90' : ''
                                            }`} />
                                        </>
                                    )}
                                </button>

                                {isSidebarOpen && activeSection === 'ecommerce' && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        <button className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Order</span>
                                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 h-5 px-1.5">0</Badge>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Payments</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Coupon</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Deals</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Sales Report</span>
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
                                        activeSection === 'ride' 
                                            ? 'bg-gray-100 text-gray-900' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Bike className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <>
                                            <span className="font-medium text-sm flex-1">Taxi</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                                                activeSection === 'ride' ? 'rotate-90' : ''
                                            }`} />
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

                            {/* Other Sections */}
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
                        {/* Header */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl shadow-2xl shadow-orange-500/40">
                                        <Package className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Products</h1>
                                        <p className="text-gray-600 mt-1">Manage and add new products ({products.length} total)</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        variant="outline"
                                        onClick={fetchProducts}
                                        className="rounded-xl"
                                    >
                                        <Loader className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        onClick={() => router.push('/admin/products/add')}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30 font-semibold"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Product
                                    </Button>
                                </div>
                            </div>

                            {/* Search and Filter */}
                            <Card className="mb-6 bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                placeholder="Search products by name, category, merchant..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 py-5 rounded-xl border-gray-300"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                                            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <Badge className="bg-orange-100 text-orange-700 self-center px-4 py-2">
                                            {filteredProducts.length} products found
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Message Alert */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                                    message.type === 'success' 
                                        ? 'bg-green-50 border border-green-200' 
                                        : 'bg-red-50 border border-red-200'
                                }`}>
                                    {message.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                                        {message.text}
                                    </span>
                                </div>
                            )}

                            {/* Add Product Form */}
                            {showForm && (
                                <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-200/50 shadow-xl mb-8">
                                    <CardHeader>
                                        <CardTitle>Create New Product</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Product Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Product Name *
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., MacBook Pro 16"
                                                        required
                                                        className="border-gray-300"
                                                    />
                                                </div>

                                                {/* Slug */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Slug
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="text"
                                                            name="slug"
                                                            value={formData.slug}
                                                            onChange={handleInputChange}
                                                            placeholder="e.g., macbook-pro-16"
                                                            className="border-gray-300 flex-1"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleGenerateSlug}
                                                            className="whitespace-nowrap"
                                                        >
                                                            Generate
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Price *
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleInputChange}
                                                        placeholder="3499.99"
                                                        step="0.01"
                                                        required
                                                        className="border-gray-300"
                                                    />
                                                </div>

                                                {/* Compare Price */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Compare Price
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        name="comparePrice"
                                                        value={formData.comparePrice}
                                                        onChange={handleInputChange}
                                                        placeholder="3999.99"
                                                        step="0.01"
                                                        className="border-gray-300"
                                                    />
                                                </div>

                                                {/* Stock */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Stock *
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        name="stock"
                                                        value={formData.stock}
                                                        onChange={handleInputChange}
                                                        placeholder="25"
                                                        required
                                                        className="border-gray-300"
                                                    />
                                                </div>

                                                {/* Merchant ID */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Merchant ID *
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        name="merchantId"
                                                        value={formData.merchantId}
                                                        onChange={handleInputChange}
                                                        placeholder="cmisz5ujk001n145yiph4s8pk"
                                                        required
                                                        className="border-gray-300"
                                                    />
                                                </div>

                                                {/* Category ID */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category ID *
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        name="categoryId"
                                                        value={formData.categoryId}
                                                        onChange={handleInputChange}
                                                        placeholder="cmisz5t9t001g145y7kbel01n"
                                                        required
                                                        className="border-gray-300"
                                                    />
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Product description..."
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                ></textarea>
                                            </div>

                                            {/* Product Images */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Product Images
                                                    </label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleAddImage}
                                                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                    >
                                                        <Plus className="w-4 h-4 mr-1" />
                                                        Add Image
                                                    </Button>
                                                </div>

                                                {formData.images.length === 0 ? (
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                                        <Upload className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                        <p className="text-gray-500 text-sm">No images added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {formData.images.map((image, index) => (
                                                            <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                                                                <div className="flex-1 space-y-2">
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Image URL"
                                                                        value={image.url}
                                                                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                                                        className="border-gray-300"
                                                                    />
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Alt text (optional)"
                                                                        value={image.alt || ''}
                                                                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                                                                        className="border-gray-300"
                                                                    />
                                                                    {image.url && (
                                                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                                                                            <Image 
                                                                                src={image.url} 
                                                                                alt="Preview" 
                                                                                fill
                                                                                sizes="80px"
                                                                                className="object-cover"
                                                                                unoptimized
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    className="text-red-600 border-red-200 hover:bg-red-50 h-fit"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Form Actions */}
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowForm(false)}
                                                    disabled={formLoading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                                    disabled={formLoading}
                                                >
                                                    {formLoading ? (
                                                        <>
                                                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                            Creating...
                                                        </>
                                                    ) : (
                                                        'Create Product'
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Products Table */}
                        <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-200/50">
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
                                        <p className="text-gray-500 text-lg">Loading products...</p>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">
                                            {searchQuery ? `No products found matching "${searchQuery}"` : 'No products yet. Create your first product!'}
                                        </p>
                                        {searchQuery && (
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                Clear Search
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/50">
                                                <TableHead className="font-semibold text-gray-700 w-16">Image</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Product Name</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Category</TableHead>
                                                <TableHead className="font-semibold text-gray-700">Merchant</TableHead>
                                                <TableHead className="font-semibold text-gray-700 text-right">Price</TableHead>
                                                <TableHead className="font-semibold text-gray-700 text-center">Stock</TableHead>
                                                <TableHead className="font-semibold text-gray-700 text-center">Created</TableHead>
                                                <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                                                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProducts.map((product) => (
                                                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <TableCell>
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 relative">
                                                            {product.images && product.images.length > 0 && (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) ? (
                                                                <Image 
                                                                    src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
                                                                    alt={typeof product.images[0] === 'string' ? product.name : (product.images[0].alt || product.name)} 
                                                                    fill
                                                                    sizes="48px"
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{product.name}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            {product.category?.name || 'N/A'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="font-medium text-gray-900">{product.merchant?.storeName || 'N/A'}</p>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div>
                                                            <p className="font-bold text-orange-600">रू{product.price}</p>
                                                            {product.comparePrice && parseFloat(product.comparePrice) > 0 && (
                                                                <p className="text-xs text-gray-400 line-through">रू{product.comparePrice}</p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={`${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                            {product.stock}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm text-gray-500">
                                                        {new Date(product.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {product.isActive ? (
                                                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex gap-2 justify-center">
                                                            {!product.isActive && (
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => handleApprove(product.id)}
                                                                    disabled={isApproving === product.id}
                                                                >
                                                                    {isApproving === product.id ? (
                                                                        <Loader className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            )}
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline" 
                                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline" 
                                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                                onClick={() => handleDelete(product.id)}
                                                                disabled={isDeleting === product.id}
                                                            >
                                                                {isDeleting === product.id ? (
                                                                    <Loader className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
