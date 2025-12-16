'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '../../(home)/navbar';
import { 
    Layers, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    ArrowLeft,
    Grid,
    Package,
    TrendingUp
} from 'lucide-react';

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    categoryName: string;
    description: string;
    productCount: number;
    status: 'active' | 'inactive';
    createdAt: string;
}

export default function SubcategoriesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Mock data - replace with API call
    const subcategories: Subcategory[] = [
        {
            id: '1',
            name: 'Smartphones',
            slug: 'smartphones',
            categoryId: '1',
            categoryName: 'Electronics',
            description: 'Mobile phones and accessories',
            productCount: 18,
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            name: 'Laptops',
            slug: 'laptops',
            categoryId: '1',
            categoryName: 'Electronics',
            description: 'Laptops and notebooks',
            productCount: 12,
            status: 'active',
            createdAt: '2024-01-16'
        },
        {
            id: '3',
            name: 'Men\'s Clothing',
            slug: 'mens-clothing',
            categoryId: '2',
            categoryName: 'Fashion',
            description: 'Clothing for men',
            productCount: 34,
            status: 'active',
            createdAt: '2024-01-20'
        },
        {
            id: '4',
            name: 'Women\'s Clothing',
            slug: 'womens-clothing',
            categoryId: '2',
            categoryName: 'Fashion',
            description: 'Clothing for women',
            productCount: 45,
            status: 'active',
            createdAt: '2024-01-21'
        },
        {
            id: '5',
            name: 'Furniture',
            slug: 'furniture',
            categoryId: '3',
            categoryName: 'Home & Living',
            description: 'Home furniture',
            productCount: 20,
            status: 'active',
            createdAt: '2024-02-01'
        }
    ];

    const categories = [
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Fashion' },
        { id: '3', name: 'Home & Living' }
    ];

    const filteredSubcategories = subcategories.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || sub.categoryId === categoryFilter;
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const stats = {
        total: subcategories.length,
        active: subcategories.filter(s => s.status === 'active').length,
        inactive: subcategories.filter(s => s.status === 'inactive').length,
        totalProducts: subcategories.reduce((sum, s) => sum + s.productCount, 0)
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 p-8 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/dashboard')}
                        className="mb-4 hover:bg-white/60 backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Subcategory Management
                            </h1>
                            <p className="text-gray-600 text-lg">Manage subcategories for your product categories</p>
                        </div>
                        <Button
                            onClick={() => router.push('/admin/subcategories/add')}
                            className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 shadow-xl shadow-violet-500/30 px-6 py-6 text-base font-bold rounded-2xl"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Subcategory
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/80 backdrop-blur-xl border-violet-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Subcategories</p>
                            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-xl border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Active Subcategories</p>
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

                    <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center shadow-lg">
                                    <Grid className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Parent Categories</p>
                            <p className="text-3xl font-black text-gray-900">{categories.length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6 bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search subcategories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 py-6 rounded-xl border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('all')}
                                    className={`rounded-xl ${categoryFilter === 'all' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : ''}`}
                                >
                                    All Categories
                                </Button>
                                {categories.map(cat => (
                                    <Button
                                        key={cat.id}
                                        variant={categoryFilter === cat.id ? 'default' : 'outline'}
                                        onClick={() => setCategoryFilter(cat.id)}
                                        className={`rounded-xl ${categoryFilter === cat.id ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : ''}`}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                                <Button
                                    variant={statusFilter === 'active' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('active')}
                                    className={`rounded-xl ${statusFilter === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`rounded-xl ${statusFilter === 'inactive' ? 'bg-gradient-to-r from-gray-500 to-slate-500' : ''}`}
                                >
                                    Inactive
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subcategories Table */}
                <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg">
                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-4 px-4 font-bold text-gray-900">Subcategory</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-900">Parent Category</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-900">Products</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubcategories.map((sub) => (
                                        <tr key={sub.id} className="border-b border-gray-100 hover:bg-violet-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-bold text-gray-900">{sub.name}</p>
                                                    <p className="text-sm text-gray-500">{sub.description}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant="outline" className="border-indigo-300 text-indigo-600 font-semibold">
                                                    {sub.categoryName}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-orange-500" />
                                                    <span className="font-bold text-gray-900">{sub.productCount}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant={sub.status === 'active' ? 'default' : 'secondary'} className={`${sub.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white font-bold`}>
                                                    {sub.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg hover:bg-violet-50 hover:text-violet-600"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredSubcategories.length === 0 && (
                            <div className="text-center py-12">
                                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No subcategories found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCategoryFilter('all');
                                    }}
                                    className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
