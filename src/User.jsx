import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";
import Card from "./Card";

export default function Users() {
  const [editUser, setEditUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editUser) {
      setUserName(editUser.username || "");
      setEmail(editUser.email || "");
    }
  }, [editUser]);

  const fetchUsers = async (search = "") => {
    let query = supabase.from("users").select("*");
    if (search) query = query.ilike("username", `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const addUsers = async (user) => {
    const { data, error } = await supabase.from("users").insert([user]).select();
    if (error) throw error;
    return data[0];
  };

  const updateUsers = async (user) => {
    const { data, error } = await supabase
      .from("users")
      .update({ username: user.username, email: user.email })
      .eq("id", user.id)
      .select();
    if (error) throw error;
    return data[0];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", { search }],
    queryFn: () => fetchUsers(search),
    keepPreviousData: true,
  });

  const addUserMutation = useMutation({
    mutationFn: addUsers,
    onSuccess: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "users",
      }),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUsers,
    onSuccess: () =>
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "users",
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      updateUserMutation.mutate({ id: editUser.id, username: userName, email });
      setEditUser(null);
    } else {
      addUserMutation.mutate({ username: userName, email });
    }
    setUserName("");
    setEmail("");
  };

  const handleEdit = (user) => setEditUser(user);

  if (isLoading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-black flex flex-col items-center p-5">
      <h1 className="text-4xl font-bold mb-5">Attenders Dashboard</h1>
      <input
        type="search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg mb-8 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-10"
      >
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all duration-200"
        >
          {editUser ? "Update" : "Add"}
        </button>
      </form>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.map((user) => (
          <Card
            key={user.id}
            name={user.username}
            id={user.id}
            email={user.email}
            button="Edit"
            onClick={() => handleEdit(user)}
          />
        ))}
      </div>
    </div>
  );
}