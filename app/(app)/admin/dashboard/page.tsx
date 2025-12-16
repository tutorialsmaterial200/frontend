'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '../../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';
import { 
    ecommerceStats, 
    riderStats,
    iconSidebarItems,
    quickActionsData,
    userManagementSubmenu,
    staffManagementSubmenu,
    categoryManagementSubmenu,
    ecommerceSubmenu,
    rideSubmenu,
    systemMenu
} from './dashboardData';
import { 
    Users, 
    Package, 
    ShoppingCart, 
    DollarSign, 
    TrendingUp, 
    Settings,
    BarChart3,
    Shield,
    Store,
    Tag,
    Percent,
    FileText,
    Grid,
    Layers,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Bike,
    Menu,
    ChevronRight,
    LayoutDashboard,
    UserCog,
    UserCheck,
    Car,
    Headphones,
    FileCheck,
    CreditCard,
    UserPlus,
    HelpCircle
} from 'lucide-react';

interface User {
    name?: string;
    email?: string;
    role?: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('ecommerce');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isIconSidebarOpen, setIsIconSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState<'users' | 'staff' | 'categories' | 'ecommerce' | 'ride' | 'subcategories' | 'products' | 'brands' | 'orders' | 'analytics' | null>('users');

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
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

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

    const getCurrentStats = () => {
        return activeTab === 'Rider' ? riderStats : ecommerceStats;
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
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                            <img src="https://i.pravatar.cc/100" alt="User" className="w-full h-full object-cover" />
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
                            <h2 className="text-xl font-bold text-gray-900">Dashboards</h2>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="space-y-1">
                            {/* Dashboard */}
                            <button
                                onClick={() => {}}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 border-l-4 border-blue-600"
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
                                            <span>Payment Team</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>KYC Team</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Seller Management</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Driver Management</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Product Management</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>User Management</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Order Management</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Delivery Management</span>
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
                                            ? 'bg-gray-100 text-gray-900' 
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
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>All Products</span>
                                        </button>
                                        <button
                                          onClick={() => router.push('/admin/products/add')}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                                            <span>Add Product </span>
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
                                            <span>Markup Price</span>
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
                                    <UserCog className="w-5 h-5" />
                                    {isSidebarOpen && <span className="font-medium text-sm">Subadmin</span>}
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                                    <HelpCircle className="w-5 h-5" />
                                    {isSidebarOpen && <span className="font-medium text-sm">Customer Support</span>}
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
                <div className={`flex-1 ${
                    isIconSidebarOpen ? 'ml-80' : 'ml-20'
                } transition-all duration-300`}>
                <div className="container mx-auto px-6 py-10">
                    {/* Show Dashboard Content when activeSection is null or 'users' with dashboard view */}
                    {!activeSection ? (
                        <>
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-4 rounded-2xl shadow-2xl shadow-orange-500/40">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                                    <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-blue-200 bg-blue-50 text-blue-700 font-semibold">
                                    Trial Days: <span className="font-bold ml-1">588</span>
                                </Badge>
                                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30 font-semibold">
                                    Quick-Delivery
                                </Button>
                                <Button size="icon" variant="ghost" className="hover:bg-gray-100 rounded-xl">
                                    <Bell className="w-5 h-5" />
                                </Button>
                                <Badge className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-4 py-2 font-bold shadow-lg">ADMIN</Badge>
                            </div>
                        </div>

                        {/* Usage Progress Card */}
                        <Card className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200/50 shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
                                            <Package className="w-10 h-10 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 mb-3 text-lg">
                                                You have used <span className="font-bold text-orange-600">4.39%</span> of free plan service. 
                                                Please upgrade your plan to get unlimited service.
                                            </p>
                                            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/40 font-semibold">
                                                Upgrade Now
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-28 h-28 relative">
                                            <svg className="w-28 h-28 transform -rotate-90">
                                                <circle cx="56" cy="56" r="48" stroke="#fee2e2" strokeWidth="10" fill="none" />
                                                <circle 
                                                    cx="56" 
                                                    cy="56" 
                                                    r="48" 
                                                    stroke="url(#gradient)" 
                                                    strokeWidth="10" 
                                                    fill="none"
                                                    strokeDasharray={`${2.51 * 48 * 0.0439} ${2.51 * 48}`}
                                                    strokeLinecap="round"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#f97316" />
                                                        <stop offset="100%" stopColor="#ef4444" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">4.39%</span>
                                                <span className="text-xs text-gray-600 font-semibold">progress</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs Navigation */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
                        <TabsList className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border-2 border-gray-200/50">
                            <TabsTrigger 
                                value="Rider" 
                                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6"
                            >
                                Rider
                            </TabsTrigger>
                            <TabsTrigger 
                                value="ecommerce" 
                                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6"
                            >
                                Ecommerce
                            </TabsTrigger>
                        </TabsList>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            {getCurrentStats().map((stat, index) => (
                                <Card key={index} className="bg-white/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200/50 hover:scale-105 hover:border-gray-300/50">
                                    <CardContent className="p-7">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{stat.value}</h3>
                                                </div>
                                                <p className="text-gray-700 font-semibold mb-3">{stat.label}</p>
                                                {stat.change && (
                                                    <div className="flex items-center gap-2">
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                                                            stat.trend === 'up' ? 'bg-green-100' : 
                                                            stat.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                                                        }`}>
                                                            {stat.trend === 'up' ? (
                                                                <ArrowUpRight className="w-3 h-3 text-green-600" />
                                                            ) : stat.trend === 'down' ? (
                                                                <ArrowDownRight className="w-3 h-3 text-red-600" />
                                                            ) : null}
                                                            <span className={`text-xs font-semibold ${
                                                                stat.trend === 'up' ? 'text-green-600' : 
                                                                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                                            }`}>
                                                                {stat.change}
                                                            </span>
                                                        </div>
                                                        {stat.subtitle && (
                                                            <span className="text-xs text-gray-500">{stat.subtitle}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`${stat.color} p-4 rounded-2xl shadow-xl`}>
                                                <stat.icon className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Tabs>

                    {/* Quick Actions */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-8">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-white/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200/50 hover:scale-105 group">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-2xl group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300 shadow-lg">
                                            <Users className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Users</h3>
                                            <p className="text-sm text-gray-600">Manage users</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200/50 hover:scale-105 group">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300 shadow-lg">
                                            <ShoppingCart className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Orders</h3>
                                            <p className="text-sm text-gray-600">View orders</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200/50 hover:scale-105 group">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300 shadow-lg">
                                            <BarChart3 className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Analytics</h3>
                                            <p className="text-sm text-gray-600">View reports</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200/50 hover:scale-105 group">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-2xl group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300 shadow-lg">
                                            <Settings className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Settings</h3>
                                            <p className="text-sm text-gray-600">Configure</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                        </>
                    ) : activeSection === 'users' ? (
                        <>
                        {/* User Management Content */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-2xl shadow-blue-500/40">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">User Management</h1>
                                        <p className="text-gray-600 mt-1">Manage all users, customers, merchants, and drivers</p>
                                    </div>
                                </div>
                            </div>

                            {/* User Management Submenu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {userManagementSubmenu.map((item, idx) => (
                                    <Card 
                                        key={idx}
                                        onClick={() => item.path && router.push(item.path)}
                                        className={`cursor-pointer border-2 border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${item.path ? 'bg-blue-50' : 'bg-white/80'}`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        </>
                    ) : activeSection === 'categories' ? (
                        <>
                        {/* Category Management Content */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl shadow-2xl shadow-purple-500/40">
                                        <Layers className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Categories</h1>
                                        <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
                                    </div>
                                </div>
                            </div>

                            {/* Category Management Submenu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {categoryManagementSubmenu.map((item, idx) => (
                                    <Card 
                                        key={idx}
                                        onClick={() => item.path && router.push(item.path)}
                                        className={`cursor-pointer border-2 border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${item.path ? 'bg-purple-50' : 'bg-white/80'}`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        </>
                    ) : activeSection === 'ecommerce' ? (
                        <>
                        {/* Ecommerce Content */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl shadow-2xl shadow-orange-500/40">
                                        <Package className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Ecommerce</h1>
                                        <p className="text-gray-600 mt-1">Manage orders, payments, coupons, and deals</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ecommerce Submenu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {ecommerceSubmenu.map((item, idx) => (
                                    <Card 
                                        key={idx}
                                        className="cursor-pointer border-2 border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-orange-50"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                                                </div>
                                                {item.badge && (
                                                    <Badge variant="outline" className="ml-auto">{item.badge}</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        </>
                    ) : null}
                </div>
                </div>
            </div>
        </>
    );
}