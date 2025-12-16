import { 
    Users, 
    Package, 
    ShoppingCart, 
    DollarSign, 
    TrendingUp,
    Grid,
    Layers,
    Tag,
    FileText,
    Store,
    Percent,
    BarChart3
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatItem {
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    subtitle: string;
}

// Ecommerce Stats Data
export const ecommerceStats: StatItem[] = [
    { 
        label: 'Category', 
        value: '8', 
        icon: Grid, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Sub Category', 
        value: '23', 
        icon: Layers, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Products', 
        value: '136', 
        icon: Package, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Brands', 
        value: '0', 
        icon: Tag, 
        color: 'bg-yellow-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Catalogue', 
        value: '0', 
        icon: FileText, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Merchants', 
        value: '5', 
        icon: Store, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: ''
    },
    { 
        label: 'Merchant Types', 
        value: '5', 
        icon: Store, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Deals', 
        value: '2', 
        icon: Percent, 
        color: 'bg-orange-500', 
        change: '+0%',
        trend: 'up',
        subtitle: 'Since last week'
    },
    { 
        label: 'Pending Merchants', 
        value: '0', 
        icon: Store, 
        color: 'bg-orange-500', 
        change: '',
        trend: 'neutral',
        subtitle: ''
    },
    { 
        label: 'Total Orders', 
        value: '38', 
        icon: ShoppingCart, 
        color: 'bg-orange-500', 
        change: '',
        trend: 'neutral',
        subtitle: ''
    },
];

// Rider Stats Data
export const riderStats: StatItem[] = [
    { 
        label: 'Active Riders', 
        value: '45', 
        icon: Users, 
        color: 'bg-purple-500', 
        change: '+7%', 
        trend: 'up', 
        subtitle: 'Since last week' 
    },
    { 
        label: 'Total Rides', 
        value: '567', 
        icon: TrendingUp, 
        color: 'bg-purple-500', 
        change: '+12%', 
        trend: 'up', 
        subtitle: 'Since last week' 
    },
    { 
        label: 'Revenue', 
        value: 'रू 89,456', 
        icon: DollarSign, 
        color: 'bg-purple-500', 
        change: '+15%', 
        trend: 'up', 
        subtitle: 'Since last week' 
    },
];

// Sidebar Navigation Items
export const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'users', label: 'User Management', icon: 'Users', hasSubmenu: true },
    { id: 'staff', label: 'Staff Management', icon: 'UserCog', hasSubmenu: true },
    { id: 'categories', label: 'Categories', icon: 'Layers', hasSubmenu: true },
    { id: 'ecommerce', label: 'Ecommerce', icon: 'Package', hasSubmenu: true },
    { id: 'ride', label: 'Taxi', icon: 'Bike', hasSubmenu: true },
];

// Icon Sidebar Items
export const iconSidebarItems = [
    { id: 'users', icon: 'LayoutDashboard', label: 'User Management', section: 'users' },
    { id: 'categories', icon: 'Grid', label: 'Categories', section: 'categories' },
    { id: 'subcategories', icon: 'Layers', label: 'Subcategories', section: 'subcategories' },
    { id: 'products', icon: 'FileText', label: 'Products', section: 'products' },
    { id: 'ecommerce', icon: 'Package', label: 'E-commerce', section: 'ecommerce' },
    { id: 'brands', icon: 'Tag', label: 'Brands', section: 'brands' },
    { id: 'orders', icon: 'ShoppingCart', label: 'Orders', section: 'orders' },
    { id: 'analytics', icon: 'BarChart3', label: 'Analytics', section: 'analytics' },
];

// Quick Actions Data
export const quickActionsData = [
    {
        title: 'Users',
        subtitle: 'Manage users',
        icon: 'Users',
        bgColor: 'from-blue-100 to-cyan-100',
        hoverColor: 'group-hover:from-blue-500 group-hover:to-cyan-500',
        iconColor: 'text-blue-600 group-hover:text-white'
    },
    {
        title: 'Orders',
        subtitle: 'View orders',
        icon: 'ShoppingCart',
        bgColor: 'from-green-100 to-emerald-100',
        hoverColor: 'group-hover:from-green-500 group-hover:to-emerald-500',
        iconColor: 'text-green-600 group-hover:text-white'
    },
    {
        title: 'Analytics',
        subtitle: 'View reports',
        icon: 'BarChart3',
        bgColor: 'from-purple-100 to-pink-100',
        hoverColor: 'group-hover:from-purple-500 group-hover:to-pink-500',
        iconColor: 'text-purple-600 group-hover:text-white'
    },
    {
        title: 'Settings',
        subtitle: 'Configure',
        icon: 'Settings',
        bgColor: 'from-orange-100 to-red-100',
        hoverColor: 'group-hover:from-orange-500 group-hover:to-red-500',
        iconColor: 'text-orange-600 group-hover:text-white'
    },
];

// User Management Submenu
export const userManagementSubmenu = [
    { label: 'All Users', icon: 'Users', path: '/admin/users' },
    { label: 'Customers', icon: 'UserCheck', path: null },
    { label: 'Sellers/Merchants', icon: 'Store', path: '/admin/merchants' },
    { label: 'Drivers/Riders', icon: 'Car', path: '/admin/riders' },
    { label: 'Support Staff', icon: 'Headphones', path: null },
    { label: 'KYC Verification', icon: 'FileCheck', path: null },
    { label: 'Payment Management', icon: 'CreditCard', path: null },
    { label: 'Create User', icon: 'UserPlus', path: null },
];

// Staff Management Submenu
export const staffManagementSubmenu = [
    { label: 'All Staff' },
    { label: 'Support Team' },
    { label: 'Payment Team' },
    { label: 'KYC Team' },
    { label: 'Seller Management' },
    { label: 'Driver Management' },
    { label: 'Product Management' },
    { label: 'User Management' },
    { label: 'Order Management' },
    { label: 'Delivery Management' },
    { label: 'Role Assignment' },
    { label: 'Add Staff Member' },
];

// Category & Product Management Submenu
export const categoryManagementSubmenu = [
    { label: 'All Categories', path: '/admin/categories' },
    { label: 'Add Category', path: '/admin/categories/add' },
    { label: 'All Subcategories', path: '/admin/subcategories' },
    { label: 'Add Subcategory', path: '/admin/subcategories/add' },
    { label: 'All Product',  path: '/admin/products' },
    { label: 'Product Tags', path: null },
];

// Ecommerce Submenu
export const ecommerceSubmenu = [
    { label: 'Order', badge: '0' },
    { label: 'Payments' },
    { label: 'Coupon' },
    { label: 'Deals' },
    { label: 'Markup Price' },
    { label: 'Sales Report' },
];

// Ride Submenu
export const rideSubmenu = [
    { label: 'Bookings' },
    { label: 'Earnings' },
];

// System Menu
export const systemMenu = [
    { label: 'Notifications', icon: 'Bell' },
    { label: 'Subadmin', icon: 'UserCog' },
    { label: 'Customer Support', icon: 'HelpCircle' },
    { label: 'Settings', icon: 'Settings' },
];
