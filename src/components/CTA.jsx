"use client"
import React from "react";

const CTA = () => {
    return (
        <section className="bg-yellow-500 py-20">
            <div className="container mx-auto px-6 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Ready to Make Your Neighborhood Safer?
                </h2>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    Join our community today and start reporting incidents, staying informed,
                    and protecting what matters most.
                </p>
                <div className="mt-8">
                    <a
                        href="/signup"
                        className="inline-block px-8 py-4 bg-white text-yellow-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTA;
