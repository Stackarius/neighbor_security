import React, { useEffect } from "react";
import { LogOutIcon } from "lucide-react";
import { logout } from "@/lib/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.refresh()
  };

  return (
    <button
      onClick={() => {
        handleLogout();
        toast.success("Logout successful");
        router.refresh()
      }}
      className="inline-flex text-white items-center font-bold px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-center"
    >
      <LogOutIcon className="h-4 w-4 mr-3" /> Logout
    </button>
  );
};

export default LogoutButton;
