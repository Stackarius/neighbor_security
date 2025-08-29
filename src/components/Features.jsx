"use client"
import React from "react";
import { Shield, AlertTriangle, Users } from "lucide-react"; 

const HowItWorks = () => {
    const steps = [
        {
            icon: <AlertTriangle className="w-10 h-10 text-yellow-400" />,
            title: "Report Incidents",
            desc: "Quickly report suspicious activity, theft, or emergencies in your area.",
        },
        {
            icon: <Shield className="w-10 h-10 text-blue-400" />,
            title: "Stay Protected",
            desc: "Admins and security personnel get instant alerts to respond quickly.",
        },
        {
            icon: <Users className="w-10 h-10 text-green-400" />,
            title: "Build Community",
            desc: "Work together with neighbors to make your community safer.",
        },
    ];

    return (
        <section id="works" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    How It <span className="text-yellow-500">Works</span>
                </h2>
                <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                    Our platform makes safety simple: report issues, get help, and
                    collaborate with your community.
                </p>

                <div className="mt-12 grid md:grid-cols-3 gap-10">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
                        >
                            <div className="flex justify-center">{step.icon}</div>
                            <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                            <p className="mt-3 text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
