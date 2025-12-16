'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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
    Grid,
    Save,
    X,
    Menu,
    LayoutDashboard,
    Users,
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
    Headphones,
    FileCheck,
    CreditCard,
    UserPlus,
    UserCog,
    Bike,
    Loader,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function AddCategoryPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        status: 'active'
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isIconSidebarOpen, setIsIconSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState<'users' | 'staff' | 'categories' | 'ecommerce' | 'ride' | 'subcategories' | 'products' | 'brands' | 'orders' | 'analytics' | null>('categories');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleNameChange = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setFormData({ ...formData, name, slug });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Category created successfully!' });
                setTimeout(() => {
                    router.push('/admin/categories');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create category' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error creating category. Please try again.' });
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                            <Image src="https://pub-159b5a6286b349fdb22b19baaf022bad.r2.dev/Home/Slider/placeholder.webp" alt="User" fill className="object-cover" />
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
                            <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
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
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-blue-600 bg-blue-50 font-medium transition-all duration-200"
                                        >
                                            <span>Add Category</span>
                                        </button>
                                        <button 
                                            onClick={() => router.push('/admin/subcategories')}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <span>All Subcategories</span>
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
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Product Tags</span>
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
                    <div className="p-8 pt-24">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/admin/categories')}
                                className="mb-4 hover:bg-white/60 backdrop-blur-sm"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Categories
                            </Button>
                            
                            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Add New Category
                            </h1>
                            <p className="text-gray-600 text-lg">Create a new product category</p>
                        </div>

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

                        {/* Form */}
                        <Card className="max-w-3xl bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-2xl">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Category Image */}
                            <div>
                                <Label className="text-base font-bold text-gray-900 mb-3 block">Category Image</Label>
                                <div className="flex items-center gap-6">
                                    <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-indigo-300 relative">
                                        {imagePreview ? (
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <Grid className="w-20 h-20 text-indigo-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload">
                                            <Button type="button" variant="outline" className="rounded-xl cursor-pointer" asChild>
                                                <span>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload Image
                                                </span>
                                            </Button>
                                        </label>
                                        <p className="text-sm text-gray-500 mt-2">Recommended size: 800x800px</p>
                                    </div>
                                </div>
                            </div>

                            {/* Category Name */}
                            <div>
                                <Label htmlFor="name" className="text-base font-bold text-gray-900 mb-3 block">
                                    Category Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Electronics, Fashion, Food"
                                    required
                                    className="py-6 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                                />
                            </div>

                            {/* Slug (Auto-generated) */}
                            <div>
                                <Label htmlFor="slug" className="text-base font-bold text-gray-900 mb-3 block">
                                    URL Slug
                                </Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="auto-generated-from-name"
                                    className="py-6 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-base bg-gray-50"
                                />
                                <p className="text-sm text-gray-500 mt-2">Auto-generated from category name</p>
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description" className="text-base font-bold text-gray-900 mb-3 block">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this category..."
                                    rows={4}
                                    className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-base resize-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <Label className="text-base font-bold text-gray-900 mb-3 block">Status</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={formData.status === 'active' ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, status: 'active' })}
                                        className={`flex-1 rounded-xl py-6 ${formData.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formData.status === 'inactive' ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, status: 'inactive' })}
                                        className={`flex-1 rounded-xl py-6 ${formData.status === 'inactive' ? 'bg-gradient-to-r from-gray-500 to-slate-500' : ''}`}
                                    >
                                        Inactive
                                    </Button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/categories')}
                                    className="flex-1 rounded-xl py-6 text-base font-bold"
                                    disabled={isLoading}
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 shadow-xl shadow-indigo-500/30 rounded-xl py-6 text-base font-bold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Save Category
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
