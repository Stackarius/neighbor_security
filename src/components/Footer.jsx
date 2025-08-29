"use client"
import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="container mx-auto px-6 grid gap-8 md:grid-cols-3">
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-white">SafeNeighborhood</h2>
                    <p className="mt-3 text-gray-400">
                        Building safer communities together through quick reporting and real-time alerts.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link href="/" className="hover:text-white">Home</Link></li>
                        <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                        <li><Link href="/report" className="hover:text-white">Report Incident</Link></li>
                        <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
                    <p>Email: <a href="mailto:support@safeneighborhood.com" className="hover:text-white">support@safeneighborhood.com</a></p>
                    <p>Phone: <a href="tel:+2348000000000" className="hover:text-white">+234 800 000 0000</a></p>
                    <div className="flex space-x-4 mt-3">
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">Facebook</a>
                        <a href="#" className="hover:text-white">Instagram</a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-5 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} SafeNeighborhood. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
