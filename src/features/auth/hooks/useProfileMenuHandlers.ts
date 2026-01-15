import { useCallback } from "react";
import { useAuthContext } from "@/shared/context/AuthContext";

interface UseProfileMenuHandlersProps {
  onClose: () => void;
}

export const useProfileMenuHandlers = ({ onClose }: UseProfileMenuHandlersProps) => {
  const { signInWithGoogle, logout } = useAuthContext();

  const handleSignIn = useCallback(() => {
    void signInWithGoogle();
    onClose();
  }, [signInWithGoogle, onClose]);

  const handleSignOut = useCallback(async () => {
    onClose();
    await logout();
  }, [logout, onClose]);

  return {
    handleSignIn,
    handleSignOut,
  };
};
