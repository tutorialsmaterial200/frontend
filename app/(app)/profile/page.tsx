'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Lock, Camera, ArrowLeft, CheckCircle, XCircle, Building2, CreditCard, FileText, Bike } from 'lucide-react';
import { Navbar } from '../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { LoginDialog } from '@/components/auth/LoginDialog';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRequestingMerchant, setIsRequestingMerchant] = useState(false);
    const [isRequestingRider, setIsRequestingRider] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingLicense, setIsUploadingLicense] = useState(false);
    const [isUploadingRegistration, setIsUploadingRegistration] = useState(false);
    const [isUploadingPanVat, setIsUploadingPanVat] = useState(false);
    const [showMerchantKYCDialog, setShowMerchantKYCDialog] = useState(false);
    const [showRiderKYCDialog, setShowRiderKYCDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        avatarUrl: '',
        isVerified: false,
        isMerchantVerified: false,
        isRiderVerified: false,
        roles: [] as string[],
    });

    const [merchantKYCData, setMerchantKYCData] = useState({
        sellerType: '',
        businessName: '',
        businessType: '',
        businessAddress: '',
        businessPhone: '',
        taxId: '',
        registrationDocumentUrl: '',
        panVatDocumentUrl: '',
        bankAccountNumber: '',
        bankName: '',
        businessDescription: '',
    });

    const [riderKYCData, setRiderKYCData] = useState({
        vehicleType: '',
        vehicleModel: '',
        vehicleNumber: '',
        licenseNumber: '',
        licenseExpiry: '',
        licenseImageUrl: '',
        emergencyContact: '',
        emergencyPhone: '',
        workingHours: '',
    });

    const [passwordData, setPasswordData] = useState({
         currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                setShowLoginDialog(true);
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
                
                // Fetch fresh user data from database
                await fetchUserProfile();
            }
            setIsLoading(false);
        };

        verifyAuth();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const user = getUser();

            if (!token) {
                // Fallback to localStorage if no token
                if (user) {
                    setProfileData({
                        fullName: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        city: user.city || '',
                        province: user.province || '',
                        avatarUrl: user.avatarUrl || '',
                        isVerified: user.isVerified === true,
                        isMerchantVerified: user.isMerchantVerified === true,
                        isRiderVerified: user.isRiderVerified === true,
                        roles: user.roles || [],
                    });
                }
                return;
            }

            console.log('🔍 Fetching user profile from database...');
            console.log('🔗 Backend API URL:', BACKEND_API_URL);
            console.log('🔑 Token exists:', !!token);
            console.log('👤 User ID:', user?.id);

            // Fetch user profile from database
            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Add user ID if available
            if (user?.id) {
                headers['x-user-id'] = user.id;
            }

            const response = await fetch(`${BACKEND_API_URL}/users/me`, {
                method: 'GET',
                headers,
            });

            console.log('📡 Profile API response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Profile data from database:', result);
                console.log('📦 Raw response data:', JSON.stringify(result, null, 2));
                
                const userData = result.data || result.user || result;
                console.log('👤 User data:', userData);
                console.log('🔐 isVerified from DB:', userData.isVerified);
                console.log('🔐 isVerified === true:', userData.isVerified === true);
                console.log('👔 User roles:', userData.roles);
                console.log('🏪 Is MERCHANT:', userData.roles?.includes('MERCHANT'));
                console.log('🏪 Merchant verified:', userData.isMerchantVerified);
                console.log('🖼️ Avatar URL from DB:', userData.avatarUrl);

                // Update state with database data
                const isVerifiedValue = userData.isVerified === true;
                console.log('💾 Setting isVerified to:', isVerifiedValue);
                setProfileData({
                    fullName: userData.fullName || userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    city: userData.city || userData.state || '',
                    province: userData.province || userData.state || '',
                    avatarUrl: userData.avatarUrl || '',
                    isVerified: isVerifiedValue,
                    isMerchantVerified: userData.isMerchantVerified === true,
                    isRiderVerified: userData.isRiderVerified === true,
                    roles: userData.roles || [],
                });

                // Update localStorage with fresh data from database
                const updatedUser = {
                    id: userData.id || userData._id,
                    name: userData.fullName || userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    city: userData.city || userData.state,
                    province: userData.province || userData.state,
                    avatarUrl: userData.avatarUrl || '',
                    isVerified: userData.isVerified === true,
                    isMerchantVerified: userData.isMerchantVerified === true,
                    isRiderVerified: userData.isRiderVerified === true,
                    roles: userData.roles || [],
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('💾 Updated localStorage with DB data');
                console.log('📦 Stored user:', updatedUser);
                console.log('🖼️ Avatar URL stored:', updatedUser.avatarUrl);
                
                // Dispatch event to update navbar
                window.dispatchEvent(new Event('auth-change'));
            } else {
                console.log('⚠️ API response not OK, status:', response.status);
                const errorData = await response.json().catch(() => ({}));
                console.log('❌ Error response:', errorData);
                console.log('⚠️ Trying /users/info endpoint as fallback');
                
                // Try /users/info as fallback
                try {
                    const fallbackResponse = await fetch(`${BACKEND_API_URL}/users/info`, {
                        method: 'GET',
                        headers,
                    });
                    
                    if (fallbackResponse.ok) {
                        const fallbackResult = await fallbackResponse.json();
                        console.log('✅ Fallback /users/info successful:', fallbackResult);
                        const userData = fallbackResult.data || fallbackResult;
                        
                        const isVerifiedValue = userData.isVerified === true;
                        console.log('💾 Setting isVerified to (from /users/info):', isVerifiedValue);
                        setProfileData({
                            fullName: userData.fullName || userData.name || '',
                            email: userData.email || '',
                            phone: userData.phone || '',
                            address: userData.address?.street || userData.address || '',
                            city: userData.address?.city || userData.city || userData.state || '',
                            province: userData.address?.state || userData.province || userData.state || '',
                            avatarUrl: userData.avatarUrl || userData.profilePictureUrl || '',
                            isVerified: isVerifiedValue,
                            isMerchantVerified: userData.isMerchantVerified === true,
                            isRiderVerified: userData.isRiderVerified === true,
                            roles: userData.roles || [],
                        });
                        
                        // Update localStorage with fresh data
                        const updatedUser = {
                            id: userData.id || userData._id,
                            name: userData.fullName || userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            address: userData.address?.street || userData.address,
                            city: userData.address?.city || userData.city || userData.state,
                            province: userData.address?.state || userData.province || userData.state,
                            avatarUrl: userData.avatarUrl || userData.profilePictureUrl || '',
                            isVerified: isVerifiedValue,
                            isMerchantVerified: userData.isMerchantVerified === true,
                            isRiderVerified: userData.isRiderVerified === true,
                            roles: userData.roles || [],
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event('auth-change'));
                        return;
                    }
                } catch (fallbackError) {
                    console.error('❌ Fallback /users/info also failed:', fallbackError);
                }
                
                console.log('⚠️ Both endpoints failed, falling back to localStorage');
                // Fallback to localStorage if both API endpoints fail
                if (user) {
                    setProfileData({
                        fullName: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        city: user.city || '',
                        province: user.province || '',
                        avatarUrl: user.avatarUrl || '',
                        isVerified: user.isVerified === true,
                        isMerchantVerified: user.isMerchantVerified === true,
                        isRiderVerified: user.isRiderVerified === true,
                        roles: user.roles || [],
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error fetching user profile:', error);
            console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
            // Fallback to localStorage
            const user = getUser();
            if (user) {
                setProfileData({
                    fullName: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    city: user.city || '',
                    province: user.province || '',
                    avatarUrl: user.avatarUrl || '',
                    isVerified: user.isVerified === true,
                    isMerchantVerified: user.isMerchantVerified === true,
                    isRiderVerified: user.isRiderVerified === true,
                    roles: user.roles || [],
                });
            }
        }
    };

    const handleLoginSuccess = () => {
        setShowLoginDialog(false);
        setIsLoggedIn(true);
        // Fetch fresh user data from database
        fetchUserProfile();
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleMerchantKYCChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMerchantKYCData(prev => ({ ...prev, [name]: value }));
    };

    const handleRiderKYCChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRiderKYCData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage('Image size must be less than 2MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please upload a valid image file');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsUploadingImage(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const user = getUser();

            if (!token || !user?.id) {
                setErrorMessage('Authentication required');
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('avatar', file);

            // Upload image to backend
            const response = await fetch(`${BACKEND_API_URL}/users/profile/avatar`, {
                method: 'POST',
                headers: {
                    'x-user-id': user.id,
                },
                body: formData,
            });

            const data = await response.json();
            console.log('🖼️ Image upload response:', data);

            if (response.ok) {
                const imageUrl = data.avatarUrl || data.imageUrl || data.url;
                
                // Update profile data state
                setProfileData(prev => ({ ...prev, avatarUrl: imageUrl }));

                // Update localStorage
                const updatedUser = {
                    ...user,
                    avatarUrl: imageUrl,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Dispatch event to update navbar
                window.dispatchEvent(new Event('auth-change'));

                setSuccessMessage('Profile picture updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to upload image. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrorMessage('Failed to upload image. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max for documents)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('License image size must be less than 5MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please upload a valid image file');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsUploadingLicense(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const user = getUser();

            if (!token || !user?.id) {
                setErrorMessage('Authentication required');
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('license', file);

            // Upload license image to backend
            const response = await fetch(`${BACKEND_API_URL}/users/profile/license`, {
                method: 'POST',
                headers: {
                    'x-user-id': user.id,
                },
                body: formData,
            });

            const data = await response.json();
            console.log('📄 License upload response:', data);

            if (response.ok) {
                const licenseUrl = data.licenseImageUrl || data.imageUrl || data.url;
                
                // Update rider KYC data state
                setRiderKYCData(prev => ({ ...prev, licenseImageUrl: licenseUrl }));

                setSuccessMessage('Driver license uploaded successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to upload license. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error uploading license:', error);
            setErrorMessage('Failed to upload license. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsUploadingLicense(false);
        }
    };

    const handleRegistrationDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB max for documents)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage('Document size must be less than 10MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setErrorMessage('Please upload a valid image or PDF file');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsUploadingRegistration(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const user = getUser();

            if (!token || !user?.id) {
                setErrorMessage('Authentication required');
                return;
            }

            const formData = new FormData();
            formData.append('registration', file);

            const response = await fetch(`${BACKEND_API_URL}/users/profile/registration-doc`, {
                method: 'POST',
                headers: {
                    'x-user-id': user.id,
                },
                body: formData,
            });

            const data = await response.json();
            console.log('📄 Registration doc upload response:', data);

            if (response.ok) {
                const docUrl = data.registrationDocumentUrl || data.imageUrl || data.url;
                setMerchantKYCData(prev => ({ ...prev, registrationDocumentUrl: docUrl }));
                setSuccessMessage('Registration document uploaded successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to upload document. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error uploading registration document:', error);
            setErrorMessage('Failed to upload document. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsUploadingRegistration(false);
        }
    };

    const handlePanVatDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB max for documents)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage('Document size must be less than 10MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setErrorMessage('Please upload a valid image or PDF file');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsUploadingPanVat(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const user = getUser();

            if (!token || !user?.id) {
                setErrorMessage('Authentication required');
                return;
            }

            const formData = new FormData();
            formData.append('panvat', file);

            const response = await fetch(`${BACKEND_API_URL}/users/profile/panvat-doc`, {
                method: 'POST',
                headers: {
                    'x-user-id': user.id,
                },
                body: formData,
            });

            const data = await response.json();
            console.log('📄 PAN/VAT doc upload response:', data);

            if (response.ok) {
                const docUrl = data.panVatDocumentUrl || data.imageUrl || data.url;
                setMerchantKYCData(prev => ({ ...prev, panVatDocumentUrl: docUrl }));
                setSuccessMessage('PAN/VAT document uploaded successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to upload document. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error uploading PAN/VAT document:', error);
            setErrorMessage('Failed to upload document. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsUploadingPanVat(false);
        }
    };

    const handleBecomeMerchant = async () => {
        // Open KYC dialog instead of direct submission
        setShowMerchantKYCDialog(true);
    };

    const handleSubmitMerchantKYC = async () => {
        setIsRequestingMerchant(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Authentication token not found');
                return;
            }

            // Validate KYC fields
            if (!merchantKYCData.businessName || !merchantKYCData.businessType || !merchantKYCData.businessPhone) {
                setErrorMessage('Please fill in all required fields');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            // Validate seller type and documents
            if (!merchantKYCData.sellerType) {
                setErrorMessage('Please select a seller type');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            if (!merchantKYCData.registrationDocumentUrl) {
                setErrorMessage('Please upload business registration document');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            if (!merchantKYCData.panVatDocumentUrl) {
                setErrorMessage('Please upload PAN/VAT document');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            // Send merchant upgrade request with KYC data
            const response = await fetch(`${BACKEND_API_URL}/auth/become-merchant`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                    ...merchantKYCData,
                }),
            });

            const data = await response.json();
            console.log('🏪 Merchant upgrade response:', data);

            if (response.ok && data.success) {
                // Update local user data with MERCHANT role
                const user = getUser();
                const updatedRoles = [...(user?.roles || []), 'MERCHANT'];
                const updatedUser = {
                    ...user,
                    roles: updatedRoles,
                    name: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Update state
                setProfileData(prev => ({ ...prev, roles: updatedRoles }));

                // Dispatch event to update navbar
                window.dispatchEvent(new Event('auth-change'));

                setSuccessMessage('Successfully upgraded to MERCHANT account! You can now access your merchant dashboard.');
                setShowMerchantKYCDialog(false);
                setTimeout(() => {
                    setSuccessMessage('');
                    router.push('/merchant/dashboard');
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Failed to upgrade account. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error upgrading to merchant:', error);
            setErrorMessage('Failed to upgrade account. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsRequestingMerchant(false);
        }
    };

    const handleBecomeRider = async () => {
        // Open KYC dialog instead of direct submission
        setShowRiderKYCDialog(true);
    };

    const handleSubmitRiderKYC = async () => {
        setIsRequestingRider(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Authentication token not found');
                return;
            }

            // Validate KYC fields
            if (!riderKYCData.vehicleType || !riderKYCData.licenseNumber || !riderKYCData.licenseImageUrl) {
                setErrorMessage('Please fill in all required fields and upload your driver license');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            // Send rider upgrade request with KYC data
            const response = await fetch(`${BACKEND_API_URL}/auth/become-rider`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                    ...riderKYCData,
                }),
            });

            const data = await response.json();
            console.log('🚴 Rider upgrade response:', data);

            if (response.ok && data.success) {
                // Update local user data with RIDER role
                const user = getUser();
                const updatedRoles = [...(user?.roles || []), 'RIDER'];
                const updatedUser = {
                    ...user,
                    roles: updatedRoles,
                    name: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Update state
                setProfileData(prev => ({ ...prev, roles: updatedRoles }));

                // Dispatch event to update navbar
                window.dispatchEvent(new Event('auth-change'));

                setSuccessMessage('Successfully upgraded to RIDER account! You can now access your rider dashboard.');
                setShowRiderKYCDialog(false);
                setTimeout(() => {
                    setSuccessMessage('');
                    router.push('/rider/dashboard');
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Failed to upgrade account. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error upgrading to rider:', error);
            setErrorMessage('Failed to upgrade account. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsRequestingRider(false);
        }
    };

    const handleVerifyAccount = async () => {
        setIsVerifying(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Authentication token not found');
                return;
            }

            // Send verification request with all profile data to update in database
            const response = await fetch(`${BACKEND_API_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isVerified: true,
                    fullName: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update local user data with all fields
                const user = getUser();
                const updatedUser = {
                    ...user,
                    isVerified: true,
                    name: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Update state
                setProfileData(prev => ({ ...prev, isVerified: true }));

                // Dispatch event to update navbar
                window.dispatchEvent(new Event('auth-change'));

                setSuccessMessage('Account verified and profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Verification failed. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error verifying account:', error);
            setErrorMessage('Failed to verify account. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const user = getUser();

            if (!token) {
                setErrorMessage('Authentication token not found');
                return;
            }

            if (!user || !user.id) {
                setErrorMessage('User ID not found');
                return;
            }

            // Send profile update to backend API
            const response = await fetch(`${BACKEND_API_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-user-id': user.id,
                },
                body: JSON.stringify({
                    fullName: profileData.fullName,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    state: profileData.province,
                    zipCode: '',
                    country: 'Nepal',
                    avatarUrl: profileData.avatarUrl,
                }),
            });

            const data = await response.json();
            console.log('📝 Profile update response:', data);

            if (response.ok) {
                // Update localStorage
                const updatedUser = {
                    ...user,
                    name: profileData.fullName,
                    email: profileData.email,
                    phone: profileData.phone,
                    address: profileData.address,
                    city: profileData.city,
                    province: profileData.province,
                    avatarUrl: profileData.avatarUrl,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Dispatch event to update navbar
                window.dispatchEvent(new Event('auth-change'));

                setSuccessMessage('Profile updated successfully in database!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to update profile. Please try again.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrorMessage('New passwords do not match');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        setIsSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Authentication token not found');
                return;
            }

            // Send password change to backend API
            const response = await fetch(`${BACKEND_API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage('Password updated successfully in database!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to update password. Please check your current password.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setErrorMessage('Failed to update password. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
            <div className={`min-h-screen bg-muted/30 ${!isLoggedIn ? 'pointer-events-none blur-sm' : ''}`}>
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                    {/* Debug: Show actual isVerified state value */}
                    <div className="mb-4 p-2 bg-gray-100 rounded text-xs font-mono text-gray-600">
                        Debug: isVerified={String(profileData.isVerified)} | Type: {typeof profileData.isVerified}
                    </div>

                    {/* Verification Status Card */}
                    {profileData.isVerified ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-green-900">Account Verified</h3>
                                <p className="text-sm text-green-800 mt-1">Your account has been verified. You can now access all features including rider and merchant services.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-900">Account Not Verified</h3>
                                <p className="text-sm text-yellow-800 mt-1">Verify your account to unlock rider and merchant features.</p>
                                <Button 
                                    onClick={handleVerifyAccount}
                                    disabled={isVerifying}
                                    size="sm"
                                    className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify Account Now'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                            {errorMessage}
                        </div>
                    )}

                    {/* Quick Info Card - Show fetched data from DB */}
                    <Card className="bg-blue-50 border-blue-200 mb-6">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Full Name</p>
                                    <p className="text-lg font-semibold">{profileData.fullName || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-lg font-semibold">{profileData.email || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone Number</p>
                                    <p className="text-lg font-semibold">{profileData.phone || 'Not set'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Profile Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details and contact information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-6">
                                        <Avatar className="w-24 h-24">
                                            <AvatarImage src={profileData.avatarUrl} />
                                            <AvatarFallback className="text-2xl">
                                                {getInitials(profileData.fullName || 'User')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-semibold">{profileData.fullName}</h3>
                                                {profileData.isVerified ? (
                                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="destructive">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Not Verified
                                                        </Badge>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={handleVerifyAccount}
                                                            disabled={isVerifying}
                                                            className="h-6 text-xs"
                                                        >
                                                            {isVerifying ? 'Verifying...' : 'Verify Now'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{profileData.email}</p>
                                            {profileData.roles && profileData.roles.length > 0 && (
                                                <div className="flex gap-1">
                                                    {profileData.roles.map((role: string) => (
                                                        <Badge key={role} variant="outline" className="text-xs">
                                                            {role}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="mt-3">
                                                <input
                                                    type="file"
                                                    id="avatar-upload"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                                    disabled={isUploadingImage}
                                                >
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    {isUploadingImage ? 'Uploading...' : 'Change Photo'}
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                JPG, PNG or GIF. Max size 2MB
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="fullName">
                                                <User className="w-4 h-4 inline mr-2" />
                                                Full Name
                                            </Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                value={profileData.fullName}
                                                onChange={handleProfileChange}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                placeholder="+977 98XXXXXXXX"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="city">
                                                <MapPin className="w-4 h-4 inline mr-2" />
                                                City
                                            </Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={profileData.city}
                                                onChange={handleProfileChange}
                                                placeholder="Kathmandu"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            placeholder="Street address"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="province">Province</Label>
                                        <Input
                                            id="province"
                                            name="province"
                                            value={profileData.province}
                                            onChange={handleProfileChange}
                                            placeholder="Bagmati Province"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Change Password */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password to keep your account secure</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword">
                                            <Lock className="w-4 h-4 inline mr-2" />
                                            Current Password
                                        </Label>
                                        <Input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>

                                    <Button type="submit" disabled={isSaving} variant="outline" className="w-full md:w-auto">
                                        {isSaving ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Role Upgrade Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Become a Merchant Card - Only show if NOT a merchant AND NOT admin */}
                            {!profileData.roles.includes('MERCHANT') && !profileData.roles.includes('ADMIN') && (
                                <Card className="border-purple-200 bg-purple-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-purple-600">🏪</span>
                                            Become a Merchant
                                        </CardTitle>
                                        <CardDescription>
                                            Upgrade your account to sell products
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">Benefits:</h4>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>List and sell products</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Access merchant dashboard</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Manage inventory & orders</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Track sales & revenue</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        {!profileData.isVerified && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                                ⚠️ You must verify your account first
                                            </div>
                                        )}
                                        
                                        {profileData.isVerified && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                                📋 Click below to fill out the merchant KYC form
                                            </div>
                                        )}
                                        
                                        <Button 
                                            onClick={handleBecomeMerchant}
                                            disabled={isRequestingMerchant || !profileData.fullName || !profileData.phone || !profileData.isVerified}
                                            className="w-full bg-purple-600 hover:bg-purple-700"
                                        >
                                            {isRequestingMerchant ? 'Processing...' : 'Fill KYC Form'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Merchant Verification Pending Card - Show if user IS a merchant but NOT verified AND NOT admin */}
                            {profileData.roles.includes('MERCHANT') && !profileData.isMerchantVerified && !profileData.roles.includes('ADMIN') && (
                                <Card className="border-yellow-200 bg-yellow-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-yellow-600">⏳</span>
                                            Merchant Verification Pending
                                        </CardTitle>
                                        <CardDescription>
                                            Your merchant application is under review
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">Current Status:</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm">Account verified</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm">KYC form submitted</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm">Awaiting admin approval</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                            <p className="font-semibold mb-1">📧 What&apos;s next?</p>
                                            <p>Our team is reviewing your application. You&apos;ll receive an email once your merchant account is approved (usually within 24-48 hours).</p>
                                        </div>

                                        <Badge variant="outline" className="w-full justify-center py-2 border-yellow-500 text-yellow-700">
                                            ⏳ Verification in Progress
                                        </Badge>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Merchant Verified Card - Show if merchant AND verified AND NOT admin */}
                            {profileData.roles.includes('MERCHANT') && profileData.isMerchantVerified && !profileData.roles.includes('ADMIN') && (
                                <Card className="border-green-200 bg-green-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-green-600">✅</span>
                                            Merchant Account Active
                                        </CardTitle>
                                        <CardDescription>
                                            Your merchant account is fully verified
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">You can now:</h4>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Add and manage products</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Process customer orders</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Track sales & analytics</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Receive payments</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <Button 
                                            onClick={() => router.push('/merchant/dashboard')}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Go to Merchant Dashboard
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Become a Rider Card - Hide for admins */}
                            {!profileData.roles.includes('RIDER') && !profileData.roles.includes('ADMIN') && (
                                <Card className="border-orange-200 bg-orange-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-orange-600">🏍️</span>
                                            Become a Rider
                                        </CardTitle>
                                        <CardDescription>
                                            Upgrade your account to deliver orders
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">Benefits:</h4>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Accept delivery orders</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Access rider dashboard</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Flexible work schedule</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Track earnings & history</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        {!profileData.isVerified && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                                ⚠️ You must verify your account first
                                            </div>
                                        )}
                                        
                                        {profileData.isVerified && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                                📋 Click below to fill out the rider KYC form
                                            </div>
                                        )}
                                        
                                        <Button 
                                            onClick={handleBecomeRider}
                                            disabled={isRequestingRider || !profileData.fullName || !profileData.phone || !profileData.isVerified}
                                            className="w-full bg-orange-600 hover:bg-orange-700"
                                        >
                                            {isRequestingRider ? 'Processing...' : 'Fill KYC Form'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Rider Verification Pending Card - Show if user IS a rider but NOT verified AND NOT admin */}
                            {profileData.roles.includes('RIDER') && !profileData.isRiderVerified && !profileData.roles.includes('ADMIN') && (
                                <Card className="border-yellow-200 bg-yellow-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-yellow-600">⏳</span>
                                            Rider Verification Pending
                                        </CardTitle>
                                        <CardDescription>
                                            Your rider application is under review
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">Current Status:</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm">Account verified</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm">KYC form submitted</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm">Awaiting admin approval</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                            <p className="font-semibold mb-1">📧 What&apos;s next?</p>
                                            <p>Our team is reviewing your application. You&apos;ll receive an email once your rider account is approved (usually within 24-48 hours).</p>
                                        </div>

                                        <Badge variant="outline" className="w-full justify-center py-2 border-yellow-500 text-yellow-700">
                                            ⏳ Verification in Progress
                                        </Badge>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Rider Verified Card - Show if rider AND verified AND NOT admin */}
                            {profileData.roles.includes('RIDER') && profileData.isRiderVerified && !profileData.roles.includes('ADMIN') && (
                                <Card className="border-green-200 bg-green-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-green-600">✅</span>
                                            Rider Account Active
                                        </CardTitle>
                                        <CardDescription>
                                            Your rider account is fully verified
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">You can now:</h4>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Accept delivery requests</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>View active deliveries</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Track your earnings</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    <span>Manage delivery history</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <Button 
                                            onClick={() => router.push('/rider/dashboard')}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Go to Rider Dashboard
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rider KYC Dialog */}
            <Dialog open={showRiderKYCDialog} onOpenChange={setShowRiderKYCDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Bike className="w-6 h-6 text-orange-600" />
                            Rider KYC Verification
                        </DialogTitle>
                        <DialogDescription>
                            Complete your rider verification to start delivering
                        </DialogDescription>
                    </DialogHeader>

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitRiderKYC(); }} className="space-y-6">
                        {/* Vehicle Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Bike className="w-5 h-5" />
                                Vehicle Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="vehicleType">
                                        Vehicle Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        name="vehicleType"
                                        value={riderKYCData.vehicleType}
                                        onValueChange={(value) => setRiderKYCData(prev => ({ ...prev, vehicleType: value }))}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
                                            <SelectItem value="scooter">🛵 Scooter</SelectItem>
                                            <SelectItem value="car">🚗 Car</SelectItem>
                                            <SelectItem value="bicycle">🚴 Bicycle</SelectItem>
                                            <SelectItem value="van">🚐 Van</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="vehicleModel">
                                        Vehicle Model
                                    </Label>
                                    <Input
                                        id="vehicleModel"
                                        name="vehicleModel"
                                        value={riderKYCData.vehicleModel}
                                        onChange={handleRiderKYCChange}
                                        placeholder="e.g., Pulsar 150, Honda Activa"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="vehicleNumber">
                                        Vehicle Registration Number
                                    </Label>
                                    <Input
                                        id="vehicleNumber"
                                        name="vehicleNumber"
                                        value={riderKYCData.vehicleNumber}
                                        onChange={handleRiderKYCChange}
                                        placeholder="BA 12 PA 3456"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="licenseNumber">
                                        Driving License Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="licenseNumber"
                                        name="licenseNumber"
                                        value={riderKYCData.licenseNumber}
                                        onChange={handleRiderKYCChange}
                                        placeholder="License number"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="licenseExpiry">
                                        License Expiry Date
                                    </Label>
                                    <Input
                                        id="licenseExpiry"
                                        name="licenseExpiry"
                                        type="date"
                                        value={riderKYCData.licenseExpiry}
                                        onChange={handleRiderKYCChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="workingHours">
                                        Preferred Working Hours
                                    </Label>
                                    <Input
                                        id="workingHours"
                                        name="workingHours"
                                        value={riderKYCData.workingHours}
                                        onChange={handleRiderKYCChange}
                                        placeholder="e.g., 9 AM - 6 PM"
                                    />
                                </div>
                            </div>

                            {/* License Upload Section */}
                            <div className="mt-4">
                                <Label htmlFor="licenseImage">
                                    Driver License Photo <span className="text-red-500">*</span>
                                </Label>
                                {riderKYCData.licenseImageUrl && (
                                    <div className="relative w-full max-w-md h-48 mt-2">
                                        <Image 
                                            src={riderKYCData.licenseImageUrl} 
                                            alt="Driver License" 
                                            fill
                                            className="object-cover rounded-lg border border-gray-300"
                                        />
                                        <Badge className="absolute top-2 right-2 bg-green-500 z-10">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Uploaded
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                    <input
                                        type="file"
                                        id="license-upload"
                                        accept="image/*"
                                        onChange={handleLicenseUpload}
                                        className="hidden"
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => document.getElementById('license-upload')?.click()}
                                        disabled={isUploadingLicense}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        {isUploadingLicense ? 'Uploading...' : riderKYCData.licenseImageUrl ? 'Change License' : 'Upload License'}
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        JPG, PNG or PDF. Max size 5MB
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Emergency Contact Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Emergency Contact
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="emergencyContact">
                                        Contact Name
                                    </Label>
                                    <Input
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        value={riderKYCData.emergencyContact}
                                        onChange={handleRiderKYCChange}
                                        placeholder="Emergency contact person"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="emergencyPhone">
                                        Contact Phone
                                    </Label>
                                    <Input
                                        id="emergencyPhone"
                                        name="emergencyPhone"
                                        type="tel"
                                        value={riderKYCData.emergencyPhone}
                                        onChange={handleRiderKYCChange}
                                        placeholder="+977 98XXXXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                            <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Note:</p>
                                    <p>Your application will be reviewed by our team. You&apos;ll receive an email once your rider account is approved (usually within 24-48 hours).</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowRiderKYCDialog(false)}
                                disabled={isRequestingRider}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isRequestingRider}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {isRequestingRider ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Merchant KYC Dialog */}
            <Dialog open={showMerchantKYCDialog} onOpenChange={setShowMerchantKYCDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Building2 className="w-6 h-6 text-purple-600" />
                            Merchant KYC Verification
                        </DialogTitle>
                        <DialogDescription>
                            Complete your business verification to become a merchant
                        </DialogDescription>
                    </DialogHeader>

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitMerchantKYC(); }} className="space-y-6">
                        {/* Business Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Business Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="businessName">
                                        Business Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="businessName"
                                        name="businessName"
                                        value={merchantKYCData.businessName}
                                        onChange={handleMerchantKYCChange}
                                        placeholder="Your Store Name"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="businessType">
                                        Business Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="businessType"
                                        name="businessType"
                                        value={merchantKYCData.businessType}
                                        onChange={handleMerchantKYCChange}
                                        placeholder="e.g., Electronics, Clothing, Food"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="businessPhone">
                                        Business Phone <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="businessPhone"
                                        name="businessPhone"
                                        type="tel"
                                        value={merchantKYCData.businessPhone}
                                        onChange={handleMerchantKYCChange}
                                        placeholder="+977 98XXXXXXXX"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="taxId">
                                        Tax ID / PAN Number
                                    </Label>
                                    <Input
                                        id="taxId"
                                        name="taxId"
                                        value={merchantKYCData.taxId}
                                        onChange={handleMerchantKYCChange}
                                        placeholder="Tax identification number"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="businessAddress">
                                    Business Address
                                </Label>
                                <Input
                                    id="businessAddress"
                                    name="businessAddress"
                                    value={merchantKYCData.businessAddress}
                                    onChange={handleMerchantKYCChange}
                                    placeholder="Street address of your business"
                                />
                            </div>

                            <div>
                                <Label htmlFor="businessDescription">
                                    Business Description
                                </Label>
                                <Textarea
                                    id="businessDescription"
                                    name="businessDescription"
                                    value={merchantKYCData.businessDescription}
                                    onChange={handleMerchantKYCChange}
                                    placeholder="Describe your business and products..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Business Documents */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Business Documents
                            </h3>
                            
                            <div>
                                <Label htmlFor="sellerType">
                                    Seller Type <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="sellerType"
                                    name="sellerType"
                                    value={merchantKYCData.sellerType}
                                    onChange={(e) => setMerchantKYCData(prev => ({ ...prev, sellerType: e.target.value }))}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="">Select seller type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label>
                                        Business Registration Document <span className="text-red-500">*</span>
                                    </Label>
                                    {merchantKYCData.registrationDocumentUrl && (
                                        <div className="mt-2 relative w-full h-48">
                                            <Image 
                                                src={merchantKYCData.registrationDocumentUrl} 
                                                alt="Registration Document" 
                                                fill
                                                className="object-cover rounded-lg border border-gray-300"
                                            />
                                            <Badge className="absolute top-2 right-2 bg-green-500">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Uploaded
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        <input
                                            type="file"
                                            id="registration-upload"
                                            accept="image/*,.pdf"
                                            onChange={handleRegistrationDocUpload}
                                            className="hidden"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => document.getElementById('registration-upload')?.click()}
                                            disabled={isUploadingRegistration}
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            {isUploadingRegistration ? 'Uploading...' : merchantKYCData.registrationDocumentUrl ? 'Change Document' : 'Upload Document'}
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            JPG, PNG or PDF. Max size 10MB
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Company registration certificate or business license
                                    </p>
                                </div>

                                <div>
                                    <Label>
                                        PAN/VAT Document <span className="text-red-500">*</span>
                                    </Label>
                                    {merchantKYCData.panVatDocumentUrl && (
                                        <div className="mt-2 relative w-full h-48">
                                            <Image 
                                                src={merchantKYCData.panVatDocumentUrl} 
                                                alt="PAN/VAT Document" 
                                                fill
                                                className="object-cover rounded-lg border border-gray-300"
                                            />
                                            <Badge className="absolute top-2 right-2 bg-green-500">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Uploaded
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        <input
                                            type="file"
                                            id="panvat-upload"
                                            accept="image/*,.pdf"
                                            onChange={handlePanVatDocUpload}
                                            className="hidden"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => document.getElementById('panvat-upload')?.click()}
                                            disabled={isUploadingPanVat}
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            {isUploadingPanVat ? 'Uploading...' : merchantKYCData.panVatDocumentUrl ? 'Change Document' : 'Upload Document'}
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            JPG, PNG or PDF. Max size 10MB
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Tax registration (PAN) or VAT registration certificate
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Banking Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Banking Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="bankName">
                                        Bank Name
                                    </Label>
                                    <Input
                                        id="bankName"
                                        name="bankName"
                                        value={merchantKYCData.bankName}
                                        onChange={handleMerchantKYCChange}
                                        placeholder="e.g., Nepal Bank, NIC Asia"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="bankAccountNumber">
                                        Bank Account Number
                                    </Label>
                                    <Input
                                        id="bankAccountNumber"
                                        name="bankAccountNumber"
                                        value={merchantKYCData.bankAccountNumber}
                                        onChange={handleMerchantKYCChange}
                                        placeholder="Account number for payments"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                            <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Note:</p>
                                    <p>Your application will be reviewed by our team. You&apos;ll receive an email once your merchant account is approved (usually within 24-48 hours).</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowMerchantKYCDialog(false)}
                                disabled={isRequestingMerchant}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isRequestingMerchant}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {isRequestingMerchant ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <LoginDialog 
                open={showLoginDialog} 
                onOpenChange={setShowLoginDialog}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}
