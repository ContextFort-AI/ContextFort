// auth.js - Shared authentication functions

const API_BASE_URL = 'YOUR_API_URL'; // Define your API URL

// Storage helpers for Chrome Extension
async function saveToStorage(key, value) {
    return chrome.storage.local.set({ [key]: value });
}

async function getFromStorage(key) {
    const result = await chrome.storage.local.get(key);
    return result[key];
}

async function removeFromStorage(key) {
    return chrome.storage.local.remove(key);
}

// Storage keys
const STORAGE_KEYS_AUTH = {
    userEmail: 'userEmail',
    accessToken: 'accessToken',
    userData: 'userData'
};

/**
 * 1. Login with Email
 */
async function loginWithEmail(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        // Save email to storage
        await saveToStorage(STORAGE_KEYS_AUTH.userEmail, email);

        return {
            success: true,
            requiresOTP: data.requires_otp,
            message: data.message,
            accessToken: data.access_token, 
            user: data.user
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 2. Verify OTP
 */
async function verifyOTP(email, otpCode) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                otp_code: otpCode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'OTP verification failed');
        }

        // Save token and user data
        await saveToStorage(STORAGE_KEYS_AUTH.accessToken, data.access_token);
        await saveToStorage(STORAGE_KEYS_AUTH.userData, data.user);

        return {
            success: true,
            message: data.message,
            accessToken: data.access_token,
            user: data.user
        };

    } catch (error) {
        console.error('OTP verification error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 3. Resend OTP
 */
async function resendOTP(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to resend OTP');
        }

        return {
            success: true,
            message: data.message,
            otpCode: data.otp_code
        };

    } catch (error) {
        console.error('Resend OTP error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 4. Get Current User Info
 */
async function getCurrentUser() {
    try {
        const accessToken = await getFromStorage(STORAGE_KEYS_AUTH.accessToken);

        if (!accessToken) {
            return {
                success: false,
                isLoggedIn: false
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Token might be expired, clear storage
            await removeFromStorage(STORAGE_KEYS_AUTH.userEmail);
            await removeFromStorage(STORAGE_KEYS_AUTH.userData);
            await removeFromStorage(STORAGE_KEYS_AUTH.accessToken);
            throw new Error('Session expired');
        }

        return {
            success: true,
            isLoggedIn: true,
            user: data
        };

    } catch (error) {
        console.error('Get current user error:', error);
        return {
            success: false,
            isLoggedIn: false,
            error: error.message
        };
    }
}

async function isLoggedIn() {
    const accessToken = await getFromStorage(STORAGE_KEYS_AUTH.accessToken);
    return !!accessToken;
}

async function logout() {
    try {
        await removeFromStorage(STORAGE_KEYS_AUTH.userEmail);
        await removeFromStorage(STORAGE_KEYS_AUTH.userData);
        await removeFromStorage(STORAGE_KEYS_AUTH.accessToken);
        return {
            success: true,
            message: 'Logged out successfully'
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loginWithEmail,
        verifyOTP,
        resendOTP,
        getCurrentUser,
        isLoggedIn,
        logout,
        STORAGE_KEYS_AUTH
    };
}