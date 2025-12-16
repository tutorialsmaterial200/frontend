import { getUser } from './auth';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MERCHANT' | 'RIDER' | 'SUPPORT';

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
    CUSTOMER: '/',
    ADMIN: '/admin/dashboard',
    MERCHANT: '/merchant/dashboard',
    RIDER: '/rider/dashboard',
    SUPPORT: '/support/dashboard',
};

export const getRoleDashboard = (role: UserRole): string => {
    return ROLE_DASHBOARDS[role] || '/';
};

export const redirectToRoleDashboard = (): string => {
    const user = getUser();
    
    if (!user || !user.roles || user.roles.length === 0) {
        return '/';
    }

    // Get the first role (primary role)
    const primaryRole = user.roles[0] as UserRole;
    
    // Check for priority roles
    if (user.roles.includes('ADMIN')) {
        return ROLE_DASHBOARDS.ADMIN;
    }
    if (user.roles.includes('MERCHANT')) {
        return ROLE_DASHBOARDS.MERCHANT;
    }
    if (user.roles.includes('RIDER')) {
        return ROLE_DASHBOARDS.RIDER;
    }
    if (user.roles.includes('SUPPORT')) {
        return ROLE_DASHBOARDS.SUPPORT;
    }
    
    return ROLE_DASHBOARDS.CUSTOMER;
};

export const hasRole = (role: UserRole): boolean => {
    const user = getUser();
    return user?.roles?.includes(role) || false;
};

export const hasAnyRole = (roles: UserRole[]): boolean => {
    const user = getUser();
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
};

export const isCustomerOnly = (): boolean => {
    const user = getUser();
    if (!user?.roles || user.roles.length === 0) return true;
    return user.roles.length === 1 && user.roles[0] === 'CUSTOMER';
};
