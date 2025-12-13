import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, AuthData } from "~/types/user";
import { loginUser, logoutUser } from "~/api/authApi";
import { useNavigate } from "react-router";

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: any) => {
        try {
            const data: AuthData = await loginUser(credentials);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};