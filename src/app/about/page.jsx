"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaUsers, FaLightbulb, FaShieldAlt, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AboutUs() {
    const team = [
        {
            name: "Adeniran Saheed Abiodun",
            matric: "CS20230103917",
            department: "Computer Science",
            bio: "Visionary leader driving the project's strategic direction and growth.",
            img: "/male.jpg",
            twitter: "https://twitter.com/",
            linkedin: "https://linkedin.com/",
            github: "#",
        },
        {
            name: "Obabiolorun Bisola Janet",
            matric: "CS20230107198",
            department: "Computer Science",
            bio: "Manages finances and helps maintain sustainable growth.",
            img: "/female.jpg",
            twitter: "#",
            linkedin: "#",
            github: "#",
        },

    ];

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            <Header />

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative flex flex-col md:flex-row items-center justify-center py-16 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white overflow-hidden"
            >
                <motion.div
                    className="relative w-72 h-72 md:w-96 md:h-96 mb-8 md:mb-0"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Image
                        src="/security_illustration.png"
                        alt="Illustration"
                        fill
                        className="object-contain drop-shadow-xl"
                    />
                </motion.div>
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center md:text-left md:ml-12 max-w-xl"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                    <p className="text-lg md:text-xl">
                        Our mission is to create intuitive, modern, and reliable software solutions that empower users and transform ideas into reality.
                    </p>
                </motion.div>
            </motion.section>

            {/* Mission & Vision */}
            <motion.section
                className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-8"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <motion.div variants={fadeUpVariant} className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
                    <FaLightbulb size={48} className="text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 border-b-2 border-indigo-200 pb-2">Our Mission</h2>
                    <p className="text-gray-700">
                        To build technology solutions that simplify daily tasks and make life easier for students, communities, and businesses.
                    </p>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
                    <FaUsers size={48} className="text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 border-b-2 border-indigo-200 pb-2">Our Vision</h2>
                    <p className="text-gray-700">
                        To be a leading force in innovative student-focused applications, inspiring growth and digital transformation.
                    </p>
                </motion.div>
            </motion.section>

            {/* Team Section */}
            <motion.section
                className="bg-indigo-50 py-12 px-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-3xl font-bold text-indigo-700 text-center mx-auto mb-8 border-b-2 border-indigo-200 block pb-2">Meet Our Team</h2>
                <div className="max-w-6xl mx-auto items-center grid sm:grid-cols-2 md:grid-cols-2 gap-8">
                    {team.map((member, idx) => (
                        <motion.div key={idx} variants={fadeUpVariant} className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transition-transform relative group overflow-hidden">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                            <p className="text-gray-500 mb-2">{member.matric}</p>
                            <p className="text-gray-500 mb-2">{member.department}</p>
                            <p className="text-gray-700 mb-4">{member.bio}</p>
                            <div className="flex justify-center gap-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 left-0 w-full">
                                {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter size={24} /></a>}
                                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={24} /></a>}
                                {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer"><FaGithub size={24} /></a>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Core Values */}
            <motion.section
                className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div variants={fadeUpVariant} className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transition-transform">
                    <FaLightbulb size={32} className="text-indigo-600 mb-2 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                    <p className="text-gray-700">We embrace creativity and technology to solve real-world problems efficiently.</p>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transition-transform">
                    <FaShieldAlt size={32} className="text-indigo-600 mb-2 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                    <p className="text-gray-700">We value honesty, transparency, and professionalism in everything we do.</p>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transition-transform">
                    <FaSmile size={32} className="text-indigo-600 mb-2 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2">User-Centric</h3>
                    <p className="text-gray-700">Our solutions are designed with the user in mind, ensuring simplicity and reliability.</p>
                </motion.div>
            </motion.section>

            <Footer />
            <div className="absolute inset-0 bg-[url('/grid.jpg')] bg-contain no-repeat opacity-10 pointer-events-none"></div>
        </div>
    );
}
