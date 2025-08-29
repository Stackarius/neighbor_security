"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Detect scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { id: 1, href: "/", name: "Home" },
        { id: 2, href: "#works", name: "How It Works" },
        { id: 3, href: "/contact", name: "Contact" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${scrolled ? "backdrop-blur-md bg-black/80 shadow-md" : "bg-transparent"}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                    <Logo />
                    <div className="hidden md:flex gap-8 items-center">
                        {/* desktop links */}
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none z-[60]">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu outside nav height context */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center gap-6 text-lg font-medium z-40"
                    >
                        {navLinks.map((link) => (
                            <Link key={link.id} href={link.href} className="text-white hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/login" className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg font-semibold transition" onClick={() => setIsOpen(false)}>
                            Report Now
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
};

export default Header;
