"use client";
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminContext from "@/app/context/adminContext";
import { User } from "@/app/types/user";
import api from "@/lib/axios";


const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        data:users,
        isLoading:usersLoading,
        isError:usersIsError,
        error:usersError,
        refetch: refetchUsers,
    } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await api.get("/api/admin/users");
            return res.data;
        },
        retry: 1,
    });
 

  return <AdminContext.Provider value={{
     users,
     refetchUsers,
     usersLoading,
     usersIsError,
     usersError,
  }}>{children}</AdminContext.Provider>;
};

export default AdminProvider;
