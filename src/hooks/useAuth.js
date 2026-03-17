import { useAuthContext } from '../context/AuthContext';

// Convenience hook to access AuthContext
const useAuth = () => useAuthContext();

export { useAuth };
export default useAuth;
