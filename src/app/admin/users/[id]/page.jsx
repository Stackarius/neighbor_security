'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation"; // For grabbing [id] from URL
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function User() {
    const [user, setUser] = useState(null);
    const { id } = useParams(); // Get the dynamic route param
    const router = useRouter()

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

    return (
        <div className="p-6">
            <div className='flex flex-row '>
                <ArrowLeft className="mr-2 mt-1 cursor-pointer" onClick={() => router.back()} />
                <h1 className="text-2xl font-bold mb-4">User Details</h1>
            </div>
            {!user ? <div>Loading...</div> : <div className='px-4'>
                <CldImage
                    src={user.avatar_url || `https://res.cloudinary.com/dmucxf1kk/image/upload/v1754767385/cld-sample.jpg`}
                    width={150}
                    height={150}
                    alt="User Avatar"
                    className="rounded-full my-4 w-[200px] h-[200px] object-cover"
                />
                <p className="mb-2"><strong>Name:</strong> {user.full_name}</p>
                <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="mb-2"><strong>Phone:</strong> {user.phone}</p>
                <p className="mb-2"><strong>Address:</strong> {user.address}</p>
                <p className="mb-2"><strong>Role:</strong> {user.user_role}</p>
            </div>}


        </div>
    );
}
