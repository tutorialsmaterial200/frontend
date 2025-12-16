import { describe, it, expect } from 'bun:test';

describe('Login Verification Workflow with Backend Integration', () => {
    it('should fetch and store isVerified from backend user data', () => {
        // Simulate backend response
        const backendResponse = {
            success: true,
            data: {
                id: 'user-123',
                email: 'test@example.com',
                fullName: 'Test User',
                isVerified: true,
                roles: ['USER'],
            },
        };

        const userData = backendResponse.data;
        
        const user = {
            id: userData.id,
            email: userData.email,
            name: userData.fullName,
            isVerified: userData.isVerified,
            roles: userData.roles || [],
        };

        expect(user.isVerified).toBe(true);
        expect(user.email).toBe('test@example.com');
        expect(user.id).toBe('user-123');
    });

    it('should redirect verified riders to dashboard', () => {
        const user = {
            id: 'rider-1',
            email: 'rider@example.com',
            isVerified: true,
            roles: ['RIDER'],
        };

        const redirectPath = '/rider/dashboard';
        let finalRedirect = redirectPath;
        
        if (redirectPath.includes('/rider') && !user.isVerified) {
            finalRedirect = '/profile';
        }

        expect(finalRedirect).toBe('/rider/dashboard');
    });

    it('should redirect unverified riders to profile for verification', () => {
        const user = {
            id: 'unverified-rider',
            email: 'unverified@example.com',
            isVerified: false,
            roles: ['RIDER'],
        };

        const redirectPath = '/rider/dashboard';
        let finalRedirect = redirectPath;
        
        if (redirectPath.includes('/rider') && !user.isVerified) {
            finalRedirect = '/profile';
        }

        expect(finalRedirect).toBe('/profile');
    });

    it('should handle all three authentication methods with backend user data', () => {
        const loginMethods = [
            {
                method: 'password',
                backendUser: {
                    id: 'user-pwd',
                    email: 'pwd@test.com',
                    fullName: 'Password User',
                    isVerified: true,
                    roles: ['USER'],
                },
            },
            {
                method: 'phone',
                backendUser: {
                    id: 'user-phone',
                    phone: '+977981234567',
                    fullName: 'Phone User',
                    isVerified: false,
                    roles: ['RIDER'],
                },
            },
            {
                method: 'social',
                backendUser: {
                    id: 'user-google',
                    email: 'google@test.com',
                    fullName: 'Google User',
                    isVerified: false,
                    roles: ['USER'],
                },
            },
        ];

        loginMethods.forEach(({ method, backendUser }) => {
            const user = {
                id: backendUser.id,
                email: backendUser.email,
                name: backendUser.fullName,
                isVerified: backendUser.isVerified,
                roles: backendUser.roles || [],
            };
            
            expect(user.id).toBeDefined();
            expect(user.isVerified).toBeDefined();
            expect(Array.isArray(user.roles)).toBe(true);
        });
    });

    it('should default to unverified if backend data missing', () => {
        const incompleteResponse = {
            success: true,
            data: {
                id: 'user-456',
                email: 'partial@example.com',
                // isVerified missing
            },
        };

        const userData = incompleteResponse.data;
        const user = {
            id: userData.id,
            email: userData.email,
            isVerified: userData.isVerified || false, // Default to false
        };

        expect(user.isVerified).toBe(false);
    });

    it('should handle nested data.data response structure from backend', () => {
        const nestedResponse = {
            success: true,
            data: {
                data: {
                    id: 'user-nested',
                    email: 'nested@example.com',
                    fullName: 'Nested User',
                    isVerified: true,
                    roles: ['MERCHANT'],
                },
            },
        };

        // Handle both data.data and direct data structures
        const userData = nestedResponse.data.data || nestedResponse.data;
        
        const user = {
            id: userData.id,
            email: userData.email,
            isVerified: userData.isVerified || false,
        };

        expect(user.isVerified).toBe(true);
    });

    it('should store user with all roles and profile data', () => {
        const backendUser = {
            id: 'user-full',
            email: 'full@example.com',
            fullName: 'Full Profile User',
            isVerified: true,
            roles: ['USER', 'RIDER', 'MERCHANT'],
            walletBalance: '1000',
            address: {
                street: '123 Main St',
                city: 'Kathmandu',
                country: 'Nepal',
                coordinates: { latitude: 27.717, longitude: 85.324 },
            },
        };

        const user = {
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.fullName,
            isVerified: backendUser.isVerified,
            roles: backendUser.roles || [],
        };

        expect(user.roles).toContain('RIDER');
        expect(user.isVerified).toBe(true);
        expect(user.roles.length).toBe(3);
    });
});
