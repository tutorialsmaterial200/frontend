'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirectToRoleDashboard } from '@/lib/role-redirect';

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoginSuccess?: () => void;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        
        try {
                       const response = await fetch(`${BACKEND_API_URL}/auth/register`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Extract token and user data
            const token = data.data?.accessToken || data.accessToken || data.token || data.access_token;
            const refreshToken = data.data?.refreshToken || data.refreshToken;
            const userData = data.data?.user || data.user || {};

            if (!token) {
                throw new Error('Registration successful but no token received');
            }

            // Store auth token and user data
            localStorage.setItem('authToken', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify({
                id: userData.id || userData._id,
                name: userData.fullName || userData.name || name,
                email: userData.email || email,
                roles: userData.roles || ['CUSTOMER'],
                isVerified: userData.isVerified || false,
            }));
            
            // Dispatch custom event to notify other components
            window.dispatchEvent(new Event('auth-change'));
            
            setLoading(false);
            onOpenChange(false);
            onLoginSuccess?.();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            
            // Check if it's a network error (backend not accessible)
            if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
                setError(`Cannot connect to server. Please check if the backend is running on ${BACKEND_API_URL}`);
            } else {
                setError(errorMessage);
            }
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔐 Login attempt started');
        console.log('Email:', email);
        console.log('Password length:', password.length);
        console.log('Backend API URL:', BACKEND_API_URL);
        
        setError('');
        setLoading(true);
        
        try {
            console.log('Sending login request to:', `${BACKEND_API_URL}/auth/login`);
            const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();
            console.log('Login response status:', response.status);
            console.log('Login response data:', data);

            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 404 || data.message?.includes('not found') || data.message?.includes('not exist')) {
                    throw new Error('User not found. Please register first.');
                } else if (response.status === 401 || response.status === 400) {
                    throw new Error(data.message || 'Invalid email or password');
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            }

            // Check if response is empty
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Empty response from server. Please check your backend API.');
            }

            // Check for token in various possible response formats
            // Priority: data.accessToken > accessToken > token > data.token
            const token = data.data?.accessToken || data.accessToken || data.token || data.access_token || data.data?.token;
            const refreshToken = data.data?.refreshToken || data.refreshToken || data.refresh_token;
            
            if (!token) {
                console.error('No token in response. Full response:', data);
                throw new Error('Authentication token not received. Please check backend API response format.');
            }

            // Extract user data - check data.data.user first, then data.user
            const userData = data.data?.user || data.user;
            console.log('Extracted user data:', userData);
            
            if (!userData) {
                throw new Error('User data not found in response');
            }
            
            const userId = userData.id || userData._id || userData.userId;
            const userName = userData.fullName || userData.name || userData.username || email.split('@')[0];
            const userEmail = userData.email || email;
            
            console.log('User ID:', userId);
            console.log('User Name (fullName):', userName);
            console.log('User Email:', userEmail);

            // Store auth token and user data
            localStorage.setItem('authToken', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            
            const userObject = {
                id: userId,
                name: userName,
                email: userEmail,
                roles: userData.roles || ['CUSTOMER'],
                isVerified: userData.isVerified || false,
            };
            
            console.log('Storing user object:', userObject);
            localStorage.setItem('user', JSON.stringify(userObject));
            
            console.log('✅ Login successful, user data stored');
            console.log('Verify storage:', localStorage.getItem('user'));
            
            setLoading(false);
            onOpenChange(false);
            
            // Dispatch custom event to notify other components
            console.log('🔔 Dispatching auth-change event');
            window.dispatchEvent(new Event('auth-change'));
            window.dispatchEvent(new Event('storage'));
            
            // Call onLoginSuccess callback
            if (onLoginSuccess) {
                console.log('📞 Calling onLoginSuccess callback');
                onLoginSuccess();
            }
            
            // Redirect to role-based dashboard
            console.log('🚀 Redirecting to role-based dashboard');
            const dashboardUrl = redirectToRoleDashboard();
            console.log('Dashboard URL:', dashboardUrl);
            router.push(dashboardUrl);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            
            // Check if it's a network error (backend not accessible)
            if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
                setError(`Cannot connect to server. Please check if the backend is running on ${BACKEND_API_URL}`);
            } else {
                setError(errorMessage);
            }
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        // Implement social login logic
        localStorage.setItem('authToken', `${provider}-token-` + Date.now());
        onOpenChange(false);
        onLoginSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-center text-2xl">
                        {isRegisterMode ? 'Create Account' : 'Welcome Back'}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {isRegisterMode ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reg-name">Full Name</Label>
                                <Input
                                    id="reg-name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg-email">Email</Label>
                                <Input
                                    id="reg-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="reg-confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'SIGN UP'}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Button 
                                    type="button" 
                                    variant="link" 
                                    className="p-0 h-auto text-blue-600"
                                    onClick={() => {
                                        setIsRegisterMode(false);
                                        setError('');
                                    }}
                                >
                                    Sign in
                                </Button>
                            </p>
                        </form>
                    ) : (
                    <>
                    <Tabs defaultValue="password" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="phone">Phone Number</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Phone or Email</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Please enter your Phone or Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Please enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <Button type="button" variant="link" className="text-muted-foreground px-0">
                                        Forgot password?
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'LOGIN'}
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <Button 
                                        type="button" 
                                        variant="link" 
                                        className="p-0 h-auto text-blue-600"
                                        onClick={() => {
                                            setIsRegisterMode(true);
                                            setError('');
                                        }}
                                    >
                                        Sign up
                                    </Button>
                                </p>
                            </form>
                        </TabsContent>

                        <TabsContent value="phone">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6">
                        <div className="relative">
                            <Separator className="my-4" />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                                Or, login with
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSocialLogin('google')}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSocialLogin('facebook')}
                            >
                                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </div>
                    </>
                )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
