const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

export const logout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectAfterLogin');
    
    // Clear any session storage if used
    sessionStorage.clear();
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    
    // Trigger auth-change event for current tab
    window.dispatchEvent(new Event('auth-change'));
};

export const clearLoginCache = () => {
    // Clear all authentication and user data
    logout();
    
    // Clear any cached API responses if needed
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                if (name.includes('auth') || name.includes('user')) {
                    caches.delete(name);
                }
            });
        });
    }
};

export const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found in localStorage');
        return false;
    }

    console.log('🔍 Token found:', token.substring(0, 20) + '...');

    // Check if user data exists
    const user = getUser();
    console.log('👤 User data:', user);
    
    if (!user) {
        console.log('❌ No user data found in localStorage');
        return false;
    }

    // For now, just use local authentication (skip backend verification)
    console.log('✅ Local authentication successful');
    console.log('✅ User:', user.name, '(' + user.email + ')');
    return true;

    /* Backend verification disabled temporarily - uncomment when backend is ready
    try {
        console.log('Attempting backend verification at:', `${BACKEND_API_URL}/auth/verify`);
        const response = await fetch(`${BACKEND_API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Backend verify response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Backend verify response data:', data);
            
            // Update user data from API response (handle different formats)
            const userData = data.user || data.data?.user || data;
            if (userData && (userData.id || userData.email)) {
                const updatedUser = {
                    id: userData.id || userData._id,
                    name: userData.fullName || userData.name || userData.username,
                    email: userData.email,
                    roles: userData.roles,
                    isVerified: userData.isVerified,
                };
                console.log('Updating user data from API:', updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            console.log('✅ User authenticated via API verification');
            return true;
        } else {
            // Token is invalid according to API
            console.log('❌ API verification failed: Token is invalid (Status:', response.status, ')');
            
            // Don't clear cache immediately - check if user data exists locally
            const user = getUser();
            if (user) {
                console.log('⚠️ API rejected token but user data exists locally, clearing cache');
                clearLoginCache();
                return false;
            }
        }
    } catch (fetchError) {
        console.warn('⚠️ Cannot reach backend API for verification:', fetchError);
    }
    
    // Fall back to checking local data
    const user = getUser();
    const hasValidLocalData = !!token && !!user;
    
    if (hasValidLocalData) {
        console.log('✓ Using local authentication (token + user data found)');
        console.log('✓ Local user:', user);
    } else {
        console.log('❌ No valid local authentication data');
    }
    
    return hasValidLocalData;
    */
};

export const getUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

export const getToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
};
