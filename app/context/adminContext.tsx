import { createContext } from "react";
import { User } from "../types/user";

interface AdminContextType {
    users: User[] | undefined;
    refetchUsers: () => void;
    usersLoading: boolean;
    usersIsError: boolean;
    usersError: Error | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

export default AdminContext;

