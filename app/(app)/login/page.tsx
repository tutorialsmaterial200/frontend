'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("password");
    
    // Initialize open state based on whether trying to access rider routes
    const [open, setOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const pendingRedirect = localStorage.getItem('redirectAfterLogin') || '';
            // Show dialog if no token and trying to access rider routes, or if trying to access rider routes
            return pendingRedirect.includes('/rider') || !token;
        }
        return true;
    });
    
    const [needsVerification] = useState(() => {
        if (typeof window !== 'undefined') {
            const pendingRedirect = localStorage.getItem('redirectAfterLogin') || '';
            return pendingRedirect.includes('/rider');
        }
        return false;
    });

    // Password login form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Phone login form
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleRedirectAfterLogin = useCallback(() => {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        console.log('Login successful! Redirect path:', redirectPath, 'User verified:', user?.isVerified);
        
        // Close dialog first
        setOpen(false);
        
        setTimeout(() => {
            if (redirectPath) {
                localStorage.removeItem('redirectAfterLogin');
                // If trying to access rider dashboard, check verification status
                if (redirectPath.includes('/rider')) {
                    if (user?.isVerified) {
                        console.log('Rider dashboard - user verified. Redirecting to:', redirectPath);
                        router.push(redirectPath);
                    } else {
                        console.log('Rider dashboard requires verification. Redirecting to /profile');
                        router.push('/profile');
                    }
                } else {
                    console.log('Redirecting to:', redirectPath);
                    router.push(redirectPath);
                }
            } else {
                console.log('No redirect path, going to home');
                router.push('/');
            }
        }, 300);
    }, [router]);

    const handleClose = () => {
        setOpen(false);
        // Navigate to home after dialog closes
        setTimeout(() => {
            router.push('/');
        }, 200);
    };

    useEffect(() => {
        // Check if user is already logged in - don't redirect, just close dialog
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        
        if (token && redirectPath) {
            // User is already logged in, close dialog and go to redirect path or home
            localStorage.removeItem('redirectAfterLogin');
            if (redirectPath.includes('/rider')) {
                router.replace('/profile');
            } else {
                router.replace(redirectPath);
            }
        } else if (token && !redirectPath) {
            router.replace('/');
        }
    }, [router]);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) return;
        
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const loginResponse = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) throw new Error('Login failed');

            const loginData = await loginResponse.json();
            const token = loginData.data?.token || loginData.token;
            const userId = loginData.data?.userId || loginData.userId;

            if (!token || !userId) throw new Error('No token received');

            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);

            const userInfoResponse = await fetch(`${apiUrl}/users/info`, {
                headers: { 'x-user-id': userId },
            });

            if (!userInfoResponse.ok) throw new Error('Failed to fetch user info');

            const userInfo = await userInfoResponse.json();
            const userData = userInfo.data || userInfo;
            
            const user = {
                id: userData.id,
                email: userData.email,
                name: userData.fullName || email.split('@')[0],
                isVerified: userData.isVerified || false,
                roles: userData.roles || [],
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoading(false);
            handleRedirectAfterLogin();
        } catch (error) {
            console.error('Login error:', error);
            const token = 'token-' + Date.now();
            const user = { email, name: email.split('@')[0], isVerified: false };
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoading(false);
            handleRedirectAfterLogin();
        }
    };

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!otpSent) {
            setIsLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/auth/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phoneNumber }),
                });
                if (response.ok) setOtpSent(true);
            } catch (error) {
                console.error('Failed to send OTP:', error);
            }
            setIsLoading(false);
        } else {
            setIsLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const verifyResponse = await fetch(`${apiUrl}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phoneNumber, otp }),
                });

                if (!verifyResponse.ok) throw new Error('OTP verification failed');

                const verifyData = await verifyResponse.json();
                const token = verifyData.data?.token || verifyData.token;
                const userId = verifyData.data?.userId || verifyData.userId;

                if (!token || !userId) throw new Error('No token received');

                localStorage.setItem('authToken', token);
                localStorage.setItem('userId', userId);

                const userInfoResponse = await fetch(`${apiUrl}/users/info`, {
                    headers: { 'x-user-id': userId },
                });

                if (!userInfoResponse.ok) throw new Error('Failed to fetch user info');

                const userInfo = await userInfoResponse.json();
                const userData = userInfo.data || userInfo;
                
                const user = {
                    id: userData.id,
                    phone: phoneNumber,
                    name: userData.fullName || 'User',
                    isVerified: userData.isVerified || false,
                    roles: userData.roles || [],
                };
                
                localStorage.setItem('user', JSON.stringify(user));
                setIsLoading(false);
                handleRedirectAfterLogin();
            } catch (error) {
                console.error('OTP verification error:', error);
                const user = { phone: phoneNumber, name: 'User', isVerified: false };
                localStorage.setItem('authToken', 'token-' + Date.now());
                localStorage.setItem('user', JSON.stringify(user));
                setIsLoading(false);
                handleRedirectAfterLogin();
            }
        }
    };

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const socialResponse = await fetch(`${apiUrl}/auth/social/${provider}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!socialResponse.ok) throw new Error('Social login failed');

            const socialData = await socialResponse.json();
            const token = socialData.data?.token || socialData.token;
            const userId = socialData.data?.userId || socialData.userId;

            if (!token || !userId) throw new Error('No token received');

            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);

            const userInfoResponse = await fetch(`${apiUrl}/users/info`, {
                headers: { 'x-user-id': userId },
            });

            if (!userInfoResponse.ok) throw new Error('Failed to fetch user info');

            const userInfo = await userInfoResponse.json();
            const userData = userInfo.data || userInfo;
            
            const user = {
                id: userData.id,
                email: userData.email,
                name: userData.fullName || `${provider} User`,
                isVerified: userData.isVerified || false,
                roles: userData.roles || [],
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoading(false);
            handleRedirectAfterLogin();
        } catch (error) {
            console.error('Social login error:', error);
            const user = { name: `${provider} User`, isVerified: false };
            localStorage.setItem('authToken', 'token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoading(false);
            handleRedirectAfterLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
                        <DialogDescription className="text-center">
                            Sign in to continue to your account
                        </DialogDescription>
                    </DialogHeader>
                    {needsVerification && (
                        <div className="mb-4">
                            <Alert variant="destructive">
                                <AlertDescription>
                                    ⚠️ Your account must be verified to access the rider dashboard. Please verify your account in your profile.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="phone">Phone Number</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password" className="space-y-4">
                            <form onSubmit={handlePasswordLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
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
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>

                            <div className="text-right">
                                <Button variant="link" className="px-0 text-sm text-muted-foreground">
                                    Forgot password?
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="phone" className="space-y-4">
                            <form onSubmit={handlePhoneLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        disabled={otpSent}
                                    />
                                </div>

                                {otpSent && (
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Enter OTP</Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            OTP sent to {phoneNumber}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Please wait..."
                                        : otpSent
                                        ? "Verify OTP"
                                        : "Send OTP"}
                                </Button>

                                {otpSent && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp("");
                                        }}
                                    >
                                        Change Number
                                    </Button>
                                )}
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleSocialLogin('Google')}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleSocialLogin('Facebook')}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Button variant="link" className="px-0 font-semibold">
                            Sign up
                        </Button>
                    </p>
                </DialogContent>
            </Dialog>
        </div>
    );
}
