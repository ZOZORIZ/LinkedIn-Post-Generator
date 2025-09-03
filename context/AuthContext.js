import { createContext,useContext,useState,useEffect } from "react";

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user,setUser ] = useState(null);
    const [loading, setLoading ] = useState(true);
    const [picture, setPicture ] = useState(null);


    const value = { user ,loading,picture};

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
              const response = await fetch('/api/auth/status', { credentials: 'include' });
              const data = await response.json();
              if (data.isLoggedIn) {
                setUser(data.userName || '');
                setPicture(data.picture || '');
              } else {
                setUser(null);
              }
              
              console.log('Auth status:', data);
            } catch (error) {
              console.error('Error checking auth status:', error);
            } finally {
                setLoading(false)
            }
        }
        checkAuthStatus();
    
    },[]);

    return(
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    );
 }; 

export const useAuth = () => {
    return useContext(AuthContext);
}