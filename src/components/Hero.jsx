"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const Hero = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;

                if (data?.user) {
                    setUser(data.user.id);

                    const { data: profile, error: profileError } = await supabase
                        .from("profiles")
                        .select("user_role")
                        .eq("id", data.user.id)
                        .single();

                    if (profileError) throw profileError;

                    setRole(profile.user_role); // store the role string
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);

    // Determine the dashboard link based on role
    let dashboardLink = "/login";
    let dashboardText = "Report an Incident";
    if (user) {
        if (role === "admin") {
            dashboardLink = "/admin";
            dashboardText = "Go to Admin Dashboard";
        } else {
            dashboardLink = "/dashboard";
            dashboardText = "Go to Dashboard";
        }
    }

    return (
        <section className="relative mt-0 bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white pt-28 md:pt-40 pb-18">
            <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">

                {/* Left Content */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        Stay Safe. <span className="text-yellow-400">Stay Alert.</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-lg">
                        Report incidents, connect with your neighborhood, and keep your community safe.
                        Together, we make our streets secure.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            href={dashboardLink}
                            className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
                        >
                            {dashboardText}
                        </Link>
                        <Link
                            href="#works"
                            className="px-6 py-3 rounded-lg border border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Right Image / Illustration */}
                <div className="flex-1 flex justify-center relative">
                    <div className="relative w-72 h-72 md:w-96 md:h-96">
                        <Image
                            src="/security_illustration.png"
                            alt="Neighborhood Security Illustration"
                            fill
                            className="object-contain drop-shadow-lg animate-bounce-slow"
                        />
                    </div>
                </div>
            </div>

            {/* Subtle background effect */}
            <div className="absolute inset-0 bg-[url('/grid.jpg')] bg-contain no-repeat opacity-10 pointer-events-none"></div>
        </section>
    );
};

export default Hero;
