'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Navbar } from '../../../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';
import {
    Store,
    CheckCircle,
    XCircle,
    Search,
    Loader,
    Eye,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    FileCheck,
    Building,
    Plus,
    CreditCard,
    User
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface KYCVerification {
    id: string;
    documentType: string;
    documentNumber: string;
    documentFront?: string;
    documentBack?: string;
    selfie?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    verifiedAt?: string;
    createdAt: string;
    updatedAt: string;
    type?: string; // 'MERCHANT' or 'DRIVER'
    purpose?: string; // Alternative field for KYC type
    user?: {
        id: string;
        name: string;
        email: string;
    };
    merchant?: {
        id: string;
        storeName: string;
        storeDescription?: string;
        storeAddress?: string;
        storePhone?: string;
        businessLicense?: string;
        panNumber?: string;
        bankAccountName?: string;
        bankAccountNumber?: string;
        bankName?: string;
    };
}

interface Merchant {
    id: string;
    storeName: string;
    storeDescription?: string;
    storeAddress?: string;
    storePhone?: string;
    businessLicense?: string;
    panNumber?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankName?: string;
    status?: string;
    isActive?: boolean;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export default function AdminMerchantVerificationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [adminUserId, setAdminUserId] = useState<string>('');
    const [kycVerifications, setKycVerifications] = useState<KYCVerification[]>([]);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [activeTab, setActiveTab] = useState<'kyc' | 'merchants'>('kyc');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [selectedKyc, setSelectedKyc] = useState<KYCVerification | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const [formData, setFormData] = useState({
        userId: '',
        storeName: '',
        storeSlug: '',
        description: '',
        idFrontUrl: '',
        idBackUrl: '',
        selfieUrl: '',
        businessDocUrl: '',
    });

    const resetForm = () => {
        setFormData({
            userId: '',
            storeName: '',
            storeSlug: '',
            description: '',
            idFrontUrl: '',
            idBackUrl: '',
            selfieUrl: '',
            businessDocUrl: '',
        });
        setEditMode(false);
    };

    const fetchKycVerifications = useCallback(async (userId?: string) => {
        try {
            const response = await fetch(`${API_URL}/kyc/all`, {
                headers: {
                    'x-user-id': userId || adminUserId,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const kycData = Array.isArray(data) ? data : (data.data || data.verifications || []);
                // Filter out driver KYC verifications - only show merchant KYC
                const merchantKycData = kycData.filter((kyc: KYCVerification) => {
                    const kycType = kyc.type?.toUpperCase() || kyc.purpose?.toUpperCase() || '';
                    // Exclude if explicitly marked as DRIVER/RIDER
                    if (kycType.includes('DRIVER') || kycType.includes('RIDER')) {
                        return false;
                    }
                    // Include if it has merchant association or is marked as MERCHANT
                    return kyc.merchant || kycType.includes('MERCHANT') || kycType === '';
                });
                setKycVerifications(merchantKycData);
            }
        } catch (error) {
            console.error('Error fetching KYC verifications:', error);
        }
    }, [adminUserId]);

    const fetchMerchants = useCallback(async () => {
        try {
            console.log('Fetching merchants from API');
            const response = await fetch(`${API_URL}/merchants`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Merchants response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Merchants data:', data);
                const merchantsData = Array.isArray(data) ? data : (data.data || data.merchants || []);
                setMerchants(merchantsData);
            } else {
                console.error('Failed to fetch merchants:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching merchants:', error);
        }
    }, []);

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

            setAdminUserId(userData.id);
            await Promise.all([
                fetchKycVerifications(userData.id),
                fetchMerchants()
            ]);
            setIsLoading(false);
        };

        verifyAccess();
    }, [router, fetchKycVerifications, fetchMerchants]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddMerchant = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/merchants/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': formData.userId,
                },
                body: JSON.stringify({
                    storeName: formData.storeName,
                    storeSlug: formData.storeSlug || formData.storeName.toLowerCase().replace(/\s+/g, '-'),
                    description: formData.description,
                    idFrontUrl: formData.idFrontUrl,
                    idBackUrl: formData.idBackUrl,
                    selfieUrl: formData.selfieUrl,
                    businessDocUrl: formData.businessDocUrl || undefined,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Merchant request submitted successfully!' });
                await fetchMerchants();
                setShowAddForm(false);
                resetForm();
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to submit merchant request' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error submitting KYC' });
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleEditMerchant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKyc) return;
        
        setIsSubmitting(true);
        setMessage(null);

        try {
            // Submit updated KYC data
            const response = await fetch(`${API_URL}/kyc/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': selectedKyc.user?.id || '',
                },
                body: JSON.stringify({
                    ...formData,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'KYC information updated and resubmitted!' });
                await fetchKycVerifications();
                setSelectedKyc(null);
                setEditMode(false);
                resetForm();
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to update KYC' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating KYC' });
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const openEditForm = (kyc: KYCVerification) => {
        setFormData({
            userId: kyc.user?.id || '',
            storeName: kyc.merchant?.storeName || '',
            storeSlug: '',
            description: kyc.merchant?.storeDescription || '',
            idFrontUrl: kyc.documentFront || '',
            idBackUrl: kyc.documentBack || '',
            selfieUrl: kyc.selfie || '',
            businessDocUrl: '',
        });
        setEditMode(true);
        setSelectedKyc(kyc);
    };

    const handleApprove = async (kycId: string) => {
        setIsProcessing(kycId);
        try {
            const response = await fetch(`${API_URL}/kyc/${kycId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': adminUserId,
                },
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'KYC approved successfully!' });
                await fetchKycVerifications();
                setSelectedKyc(null);
            } else {
                setMessage({ type: 'error', text: 'Failed to approve KYC' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error processing request' });
            console.error('Error:', error);
        } finally {
            setIsProcessing(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleReject = async (kycId: string) => {
        if (!rejectionReason.trim()) {
            setMessage({ type: 'error', text: 'Please provide a rejection reason' });
            return;
        }

        setIsProcessing(kycId);
        try {
            const response = await fetch(`${API_URL}/kyc/${kycId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': adminUserId,
                },
                body: JSON.stringify({ 
                    rejectionReason: rejectionReason 
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'KYC rejected successfully!' });
                await fetchKycVerifications();
                setSelectedKyc(null);
                setRejectionReason('');
            } else {
                setMessage({ type: 'error', text: 'Failed to reject KYC' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error processing request' });
            console.error('Error:', error);
        } finally {
            setIsProcessing(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredKyc = kycVerifications.filter(kyc => {
        const matchesSearch = 
            kyc.merchant?.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kyc.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kyc.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kyc.documentNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || kyc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredMerchants = merchants.filter(merchant => {
        const matchesSearch = 
            merchant.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            merchant.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            merchant.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            merchant.storePhone?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
            case 'PENDING':
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
        }
    };

    const pendingCount = kycVerifications.filter(k => k.status === 'PENDING').length;
    const totalMerchants = merchants.length;

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading merchants...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 pt-24">
                <div className="container mx-auto max-w-7xl">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/dashboard')}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
                                <FileCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Merchant Verification</h1>
                                <p className="text-gray-600">Review and approve merchant applications</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {pendingCount > 0 && (
                                <Badge className="bg-yellow-100 text-yellow-700 px-4 py-2 text-lg">
                                    {pendingCount} Pending KYC
                                </Badge>
                            )}
                            <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-lg">
                                {totalMerchants} Merchants
                            </Badge>
                            <Button variant="outline" onClick={() => { fetchKycVerifications(); fetchMerchants(); }}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                            <Button 
                                onClick={() => { resetForm(); setShowAddForm(true); }}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Merchant
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <Button
                            variant={activeTab === 'kyc' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('kyc')}
                            className={activeTab === 'kyc' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                        >
                            <FileCheck className="w-4 h-4 mr-2" />
                            KYC Verifications ({kycVerifications.length})
                        </Button>
                        <Button
                            variant={activeTab === 'merchants' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('merchants')}
                            className={activeTab === 'merchants' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                        >
                            <Store className="w-4 h-4 mr-2" />
                            Merchant Accounts ({merchants.length})
                        </Button>
                    </div>

                    {/* Add Merchant Form */}
                    {showAddForm && (
                        <Card className="mb-8 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="w-5 h-5 text-purple-600" />
                                    Request Merchant Account
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddMerchant} className="space-y-6">
                                    {/* User ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            User ID *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                name="userId"
                                                value={formData.userId}
                                                onChange={handleInputChange}
                                                placeholder="Enter user ID"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">User ID of the customer requesting to become a merchant</p>
                                    </div>

                                    {/* Store Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Name *
                                            </label>
                                            <div className="relative">
                                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    name="storeName"
                                                    value={formData.storeName}
                                                    onChange={handleInputChange}
                                                    placeholder="Store name"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Slug
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    name="storeSlug"
                                                    value={formData.storeSlug}
                                                    onChange={handleInputChange}
                                                    placeholder="my-store (auto-generated if empty)"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Store Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Describe the store..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    {/* ID Documents */}
                                    <div className="pt-4 border-t">
                                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                                            <FileCheck className="w-4 h-4 text-purple-600" />
                                            Identity Documents
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ID Front URL *
                                                </label>
                                                <Input
                                                    type="url"
                                                    name="idFrontUrl"
                                                    value={formData.idFrontUrl}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com/id-front.jpg"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ID Back URL *
                                                </label>
                                                <Input
                                                    type="url"
                                                    name="idBackUrl"
                                                    value={formData.idBackUrl}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com/id-back.jpg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Selfie URL *
                                                </label>
                                                <Input
                                                    type="url"
                                                    name="selfieUrl"
                                                    value={formData.selfieUrl}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com/selfie.jpg"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Business Document URL (Optional)
                                                </label>
                                                <Input
                                                    type="url"
                                                    name="businessDocUrl"
                                                    value={formData.businessDocUrl}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com/business-doc.jpg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => { setShowAddForm(false); resetForm(); }}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Submit Merchant Request
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

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

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        placeholder={activeTab === 'kyc' ? "Search by store name, owner name, document number..." : "Search by store name, owner name, phone..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                {activeTab === 'kyc' && (
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                )}
                                <Badge className="bg-purple-100 text-purple-700 self-center px-4 py-2">
                                    {activeTab === 'kyc' ? `${filteredKyc.length} verifications` : `${filteredMerchants.length} merchants`}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KYC Verifications Table */}
                    {activeTab === 'kyc' && (
                    <Card>
                        <CardContent className="p-0">
                            {filteredKyc.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No KYC verifications found</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Store / User</TableHead>
                                            <TableHead>Document Info</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Business Details</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredKyc.map((kyc) => (
                                            <TableRow key={kyc.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                            <Store className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{kyc.merchant?.storeName || 'N/A'}</p>
                                                            <p className="text-xs text-gray-500">{kyc.user?.name || 'Unknown User'}</p>
                                                            <p className="text-xs text-gray-400">{kyc.user?.email || ''}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium text-sm">{kyc.documentType}</p>
                                                    <p className="text-xs text-gray-500">{kyc.documentNumber}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm">{kyc.merchant?.storePhone || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{kyc.merchant?.storeAddress || ''}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs space-y-1">
                                                        <p>License: {kyc.merchant?.businessLicense || 'N/A'}</p>
                                                        <p>PAN: {kyc.merchant?.panNumber || 'N/A'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getStatusBadge(kyc.status)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setSelectedKyc(kyc)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                            onClick={() => openEditForm(kyc)}
                                                            title="Edit/Resubmit"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                        {kyc.status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => handleApprove(kyc.id)}
                                                                    disabled={isProcessing === kyc.id}
                                                                    title="Approve"
                                                                >
                                                                    {isProcessing === kyc.id ? (
                                                                        <Loader className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    onClick={() => setSelectedKyc(kyc)}
                                                                    disabled={isProcessing === kyc.id}
                                                                    title="Reject"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                    )}

                    {/* Merchants Table */}
                    {activeTab === 'merchants' && (
                    <Card>
                        <CardContent className="p-0">
                            {filteredMerchants.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No merchants found</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Store Name</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Business Details</TableHead>
                                            <TableHead>Bank Info</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMerchants.map((merchant) => (
                                            <TableRow key={merchant.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                            <Store className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{merchant.storeName}</p>
                                                            <p className="text-xs text-gray-500">{merchant.storeAddress || 'No address'}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium">{merchant.user?.name || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{merchant.user?.email || 'N/A'}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm">{merchant.storePhone || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500 max-w-[150px] truncate">{merchant.storeDescription || ''}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs space-y-1">
                                                        <p>License: {merchant.businessLicense || 'N/A'}</p>
                                                        <p>PAN: {merchant.panNumber || 'N/A'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs space-y-1">
                                                        <p>{merchant.bankName || 'N/A'}</p>
                                                        <p className="text-gray-500">{merchant.bankAccountNumber || 'N/A'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {merchant.isActive !== false ? (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-700 border-gray-200">Inactive</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                    )}

                    {/* KYC Detail Modal */}
                    {selectedKyc && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Store className="w-5 h-5 text-purple-600" />
                                            {editMode ? 'Edit KYC' : (selectedKyc.merchant?.storeName || 'KYC Verification')}
                                        </CardTitle>
                                        {!editMode && getStatusBadge(selectedKyc.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {editMode ? (
                                        /* Edit Form */
                                        <form onSubmit={handleEditMerchant} className="space-y-6">
                                            {/* Previous Rejection Reason */}
                                            {selectedKyc.rejectionReason && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <p className="text-sm font-medium text-red-900">Previous Rejection Reason:</p>
                                                    <p className="text-sm text-red-700 mt-1">{selectedKyc.rejectionReason}</p>
                                                </div>
                                            )}
                                            
                                            {/* Store Information */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <Building className="w-4 h-4" />
                                                    Store Information
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                                                        <Input
                                                            name="storeName"
                                                            value={formData.storeName}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder="Enter store name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Slug</label>
                                                        <Input
                                                            name="storeSlug"
                                                            value={formData.storeSlug}
                                                            onChange={handleInputChange}
                                                            placeholder="my-store (auto-generated if empty)"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                        <textarea
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleInputChange}
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            placeholder="Describe the store..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Identity Documents */}
                                            <div className="space-y-4 pt-4 border-t">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <FileCheck className="w-4 h-4" />
                                                    Identity Documents
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Front URL *</label>
                                                        <Input
                                                            name="idFrontUrl"
                                                            value={formData.idFrontUrl}
                                                            onChange={handleInputChange}
                                                            placeholder="https://example.com/id-front.jpg"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Back URL *</label>
                                                        <Input
                                                            name="idBackUrl"
                                                            value={formData.idBackUrl}
                                                            onChange={handleInputChange}
                                                            placeholder="https://example.com/id-back.jpg"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selfie URL *</label>
                                                        <Input
                                                            name="selfieUrl"
                                                            value={formData.selfieUrl}
                                                            onChange={handleInputChange}
                                                            placeholder="https://example.com/selfie.jpg"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Doc URL</label>
                                                        <Input
                                                            name="businessDocUrl"
                                                            value={formData.businessDocUrl}
                                                            onChange={handleInputChange}
                                                            placeholder="https://example.com/business-doc.jpg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-4 border-t">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        resetForm();
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="bg-purple-600 hover:bg-purple-700"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 mr-2" />
                                                            Resubmit for Verification
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* View Details */
                                        <>
                                            {/* Document Info */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <FileCheck className="w-4 h-4" />
                                                    KYC Document
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Document Type</p>
                                                        <p className="font-medium">{selectedKyc.documentType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Document Number</p>
                                                        <p className="font-medium">{selectedKyc.documentNumber}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Store Info */}
                                            <div className="space-y-4 pt-4 border-t">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <Building className="w-4 h-4" />
                                                    Store Information
                                                </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Store Name</p>
                                                <p className="font-medium">{selectedKyc.merchant?.storeName || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Phone</p>
                                                <p className="font-medium">{selectedKyc.merchant?.storePhone || 'N/A'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500">Address</p>
                                                <p className="font-medium">{selectedKyc.merchant?.storeAddress || 'N/A'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500">Description</p>
                                                <p className="font-medium">{selectedKyc.merchant?.storeDescription || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner Info */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h4 className="font-semibold">Owner Information</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Name</p>
                                                <p className="font-medium">{selectedKyc.user?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Email</p>
                                                <p className="font-medium">{selectedKyc.user?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Documents */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Business Documents
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Business License</p>
                                                <p className="font-medium">{selectedKyc.merchant?.businessLicense || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">PAN Number</p>
                                                <p className="font-medium">{selectedKyc.merchant?.panNumber || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Bank Name</p>
                                                <p className="font-medium">{selectedKyc.merchant?.bankName || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Account Number</p>
                                                <p className="font-medium">{selectedKyc.merchant?.bankAccountNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rejection Reason Input (for pending KYC) */}
                                    {selectedKyc.status === 'PENDING' && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <h4 className="font-semibold text-red-600">Rejection Reason (if rejecting)</h4>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Enter reason for rejection..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    )}

                                    {/* Previous Rejection Reason */}
                                    {selectedKyc.rejectionReason && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-sm font-medium text-red-900">Previous Rejection Reason:</p>
                                            <p className="text-sm text-red-700 mt-1">{selectedKyc.rejectionReason}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedKyc(null);
                                                setRejectionReason('');
                                                resetForm();
                                            }}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => openEditForm(selectedKyc)}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Edit / Resubmit
                                        </Button>
                                        {selectedKyc.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApprove(selectedKyc.id)}
                                                    disabled={isProcessing === selectedKyc.id}
                                                >
                                                    {isProcessing === selectedKyc.id ? (
                                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleReject(selectedKyc.id)}
                                                    disabled={isProcessing === selectedKyc.id}
                                                >
                                                    {isProcessing === selectedKyc.id ? (
                                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                    )}
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
