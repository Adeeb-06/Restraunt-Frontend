"use client";
import React, { useState, useContext } from "react";
import { Users } from "lucide-react";
import UserManagementSearch from "@/components/admin/UserManagementSearch";
import UserManagementItem from "@/components/admin/UserManagementItem";
import AdminContext from "@/app/context/adminContext";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const adminContext = useContext(AdminContext);

  const { users, usersLoading, usersIsError } = adminContext || {
    users: [],
    usersLoading: false,
    usersIsError: false,
  };

  const filteredUsers =
    users?.filter(
      (user) =>
        user?.restrauntName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 font-serif flex items-center gap-3">
            <Users className="text-[#e8845c]" /> User Management
          </h2>
          <p className="text-zinc-400">
            View and manage all restaurant accounts and issue access codes.
          </p>
        </div>
        <UserManagementSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="space-y-4">
        {usersLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-[#e8845c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : usersIsError ? (
          <div className="text-center py-20 text-red-500 bg-[#111111] rounded-3xl border border-red-900 shadow-lg">
            Failed to load users
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserManagementItem
              key={user?._id}
              user={{ ...user, id: user?._id }}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-[#111111] rounded-3xl border border-zinc-800/80 shadow-lg">
            <Users size={48} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-white tracking-wide">
              No users found
            </h3>
            <p className="text-zinc-500 mt-2">
              Try adjusting your search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
