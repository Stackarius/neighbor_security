'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { CldImage } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from 'lucide-react';
import { deleteUser } from '@/app/actions/adminActions';
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from 'react-toastify';

export default function User() {
    const [user, setUser] = useState(null);
    const [isDeleteOpen, setDeleteOpen] = useState(false); 
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching user:", error.message);
            } else {
                setUser(data);
            }
        };

        if (id) fetchUser();
    }, [id]);

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(id);
            setDeleteOpen(false);
            router.back();
        } catch (err) {
            toast.error(`${err.message}`)
            console.log("Error deleting user:", err.message);
        }
    };

    return (
        <div className="p-6">
            <div className='flex flex-row '>
                <ArrowLeft className="mr-2 mt-1 cursor-pointer" onClick={() => router.back()} />
                <h1 className="text-2xl font-bold mb-4">User Details</h1>
            </div>
            {!user ? (
                <div>Loading...</div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-8 px-4 md:px-10 items-center'>
                    <CldImage
                        src={user.img_url || `https://res.cloudinary.com/dmucxf1kk/image/upload/v1754767385/cld-sample.jpg`}
                        width={100}
                        height={100}
                        priority
                        alt="User Avatar"
                            className="rounded-full my-4 w-70 h-70 object-fit shadow"
                    />
                    <div>
                        <p className="mb-2 md:text-xl"><strong>Name:</strong> {user.full_name}</p>
                        <p className="mb-2 md:text-xl"><strong>Email:</strong> {user.email}</p>
                        <p className="mb-2 md:text-xl"><strong>Phone:</strong> {user.phone}</p>
                        <p className="mb-2 md:text-xl"><strong>Address:</strong> {user.address}</p>
                        <p className="mb-2 md:text-xl"><strong>Role:</strong> {user.user_role}</p>

                        {/* Delete button */}
                        <button
                            onClick={() => setDeleteOpen(true)}
                            className='bg-red-600 text-white p-2 rounded font-semibold'
                        >
                            Delete User
                        </button>

                        {/* Confirmation modal */}
                        <ConfirmModal
                            isOpen={isDeleteOpen}
                            onClose={() => setDeleteOpen(false)}
                                onConfirm={() => {
                                    handleConfirmDelete()
                                    setDeleteOpen(false)
                                 }}
                            title="Delete User"
                            description="Are you sure you want to delete this user? This action cannot be undone."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
