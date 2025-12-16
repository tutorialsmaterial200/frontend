'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '../../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';
import { 
    Store, 
    Clock,
    FileText,
    AlertCircle,
    Upload,
    CheckCircle,
    XCircle,
    RefreshCw,
    ArrowLeft,
    Loader,
    Building,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    FileCheck
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    isMerchantVerified?: boolean;
    merchantStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMIT';
}

interface MerchantData {
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
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export default function MerchantVerificationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [merchant, setMerchant] = useState<MerchantData | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    
    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        storeAddress: '',
        storePhone: '',
        businessLicense: '',
        panNumber: '',
        bankAccountName: '',
        bankAccountNumber: '',
        bankName: '',
    });

    useEffect(() => {
        const verifyAccess = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            const userData = getUser();
            if (!userData || !hasRole('MERCHANT')) {
                router.push('/');
                return;
            }

            setUser(userData);
            await fetchMerchantData(userData.id);
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

    const fetchMerchantData = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/merchants/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const merchantData = data.data || data;
                setMerchant(merchantData);
                // Pre-fill form with existing data
                setFormData({
                    storeName: merchantData.storeName || '',
                    storeDescription: merchantData.storeDescription || '',
                    storeAddress: merchantData.storeAddress || '',
                    storePhone: merchantData.storePhone || '',
                    businessLicense: merchantData.businessLicense || '',
                    panNumber: merchantData.panNumber || '',
                    bankAccountName: merchantData.bankAccountName || '',
                    bankAccountNumber: merchantData.bankAccountNumber || '',
                    bankName: merchantData.bankName || '',
                });
            }
        } catch (error) {
            console.error('Error fetching merchant data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/merchants/${merchant?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    status: 'PENDING', // Reset status to pending on resubmit
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Application resubmitted successfully! Please wait for admin review.' });
                await fetchMerchantData(user?.id || '');
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to resubmit application' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error submitting application. Please try again.' });
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading verification status...</p>
                    </div>
                </div>
            </>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'REJECTED': return <XCircle className="w-5 h-5 text-red-600" />;
            case 'PENDING': return <Clock className="w-5 h-5 text-yellow-600" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/merchant/dashboard')}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Merchant Verification</h1>
                            <p className="text-gray-600">Manage your verification status and documents</p>
                        </div>
                    </div>

                    {/* Status Card */}
                    <Card className="mb-8 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    {getStatusIcon(merchant?.status || 'PENDING')}
                                    Verification Status
                                </CardTitle>
                                <Badge className={getStatusColor(merchant?.status || 'PENDING')}>
                                    {merchant?.status || 'PENDING'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {merchant?.status === 'PENDING' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-6 h-6 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-yellow-900">Application Under Review</h4>
                                            <p className="text-yellow-800 text-sm mt-1">
                                                Your merchant application is currently being reviewed by our team. 
                                                This usually takes 24-48 hours. You&apos;ll receive a notification once approved.
                                            </p>
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-yellow-800">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>Application submitted</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-yellow-800">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>Documents uploaded</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-yellow-800">
                                                    <Clock className="w-4 h-4 text-yellow-600" />
                                                    <span>Awaiting admin verification</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {merchant?.status === 'APPROVED' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-green-900">Verification Approved</h4>
                                            <p className="text-green-800 text-sm mt-1">
                                                Congratulations! Your merchant account has been verified. You now have full access to all merchant features.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {merchant?.status === 'REJECTED' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-red-900">Verification Rejected</h4>
                                            <p className="text-red-800 text-sm mt-1">
                                                Unfortunately, your application was not approved. Please review the reason below and resubmit with the correct information.
                                            </p>
                                            {merchant.rejectionReason && (
                                                <div className="mt-3 p-3 bg-white rounded-lg border border-red-200">
                                                    <p className="text-sm font-medium text-red-900">Reason for rejection:</p>
                                                    <p className="text-sm text-red-700 mt-1">{merchant.rejectionReason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
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

                    {/* Resubmit Form - Only show if rejected */}
                    {merchant?.status === 'REJECTED' && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 text-purple-600" />
                                    Resubmit Application
                                </CardTitle>
                                <CardDescription>
                                    Update your information and resubmit for verification
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleResubmit} className="space-y-6">
                                    {/* Store Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Building className="w-5 h-5 text-purple-600" />
                                            Store Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Name *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="storeName"
                                                    value={formData.storeName}
                                                    onChange={handleInputChange}
                                                    placeholder="Your Store Name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Phone *
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input
                                                        type="tel"
                                                        name="storePhone"
                                                        value={formData.storePhone}
                                                        onChange={handleInputChange}
                                                        placeholder="+977 98XXXXXXXX"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Address *
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    name="storeAddress"
                                                    value={formData.storeAddress}
                                                    onChange={handleInputChange}
                                                    placeholder="Full store address"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Description
                                            </label>
                                            <textarea
                                                name="storeDescription"
                                                value={formData.storeDescription}
                                                onChange={handleInputChange}
                                                placeholder="Describe your store and products..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Business Documents */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <FileCheck className="w-5 h-5 text-purple-600" />
                                            Business Documents
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Business License Number *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="businessLicense"
                                                    value={formData.businessLicense}
                                                    onChange={handleInputChange}
                                                    placeholder="License number"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    PAN Number *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="panNumber"
                                                    value={formData.panNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="PAN number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-purple-600" />
                                            Bank Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bank Name *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="bankName"
                                                    value={formData.bankName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Nepal Bank Limited"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account Holder Name *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="bankAccountName"
                                                    value={formData.bankAccountName}
                                                    onChange={handleInputChange}
                                                    placeholder="Account holder name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bank Account Number *
                                            </label>
                                            <Input
                                                type="text"
                                                name="bankAccountNumber"
                                                value={formData.bankAccountNumber}
                                                onChange={handleInputChange}
                                                placeholder="Account number"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/merchant/dashboard')}
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
                                                    Resubmitting...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Resubmit Application
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Application Details */}
                    <Card className="mt-8 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                Application Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Store Name</p>
                                        <p className="font-medium">{merchant?.storeName || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Store Address</p>
                                        <p className="font-medium">{merchant?.storeAddress || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Store Phone</p>
                                        <p className="font-medium">{merchant?.storePhone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Business License</p>
                                        <p className="font-medium">{merchant?.businessLicense || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">PAN Number</p>
                                        <p className="font-medium">{merchant?.panNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Bank Details</p>
                                        <p className="font-medium">
                                            {merchant?.bankName ? `${merchant.bankName} - ${merchant.bankAccountNumber}` : 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                                <p>Submitted on: {merchant?.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : 'N/A'}</p>
                                <p>Last updated: {merchant?.updatedAt ? new Date(merchant.updatedAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
