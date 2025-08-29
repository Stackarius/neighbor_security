"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState } from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log(formData);
            setLoading(false);
            setSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Header */}
            <div className="text-center py-12 px-6">
                <h1 className="text-4xl font-bold mb-2 mt-8 md:mt-20">Contact Us</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Have questions, feedback, or just want to say hello? Use the form below, reach out via our contact info, or learn more about the developer.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Send a Message</h2>

                    {submitted && (
                        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                            Thank you! Your message has been sent.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Your Email"
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Your Message..."
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-700 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>

                {/* Right Side - Contact Info + Map */}
                <div className="w-full lg:w-1/2 bg-blue-50 p-8 flex flex-col justify-center gap-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">Get in Touch</h2>
                    <p className="text-gray-700">
                        Reach us via email, phone, or visit our office. We’re always happy to hear from you!
                    </p>

                    <div className="space-y-3">
                        <p><span className="font-semibold">Email:</span> support@example.com</p>
                        <p><span className="font-semibold">Phone:</span> +234 123 456 7890</p>
                        <p><span className="font-semibold">Address:</span> 123 Main Street, Lagos, Nigeria</p>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex gap-4 mt-2 text-blue-600">
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors"><FaTwitter size={24} /></a>
                        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors"><FaLinkedin size={24} /></a>
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors"><FaGithub size={24} /></a>
                        <a href="mailto:developer@example.com" className="hover:text-blue-800 transition-colors"><FaEnvelope size={24} /></a>
                    </div>

                    {/* Interactive Google Map */}
                    <div className="mt-4 w-full h-64 rounded-lg overflow-hidden shadow">
                        <iframe
                            title="Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1153.0816302601609!2d4.415960715160774!3d7.69506573065662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1756493292112!5m2!1sen!2sng"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* About Developer Section */}
            <div className="max-w-6xl mx-auto my-12 bg-white shadow-lg rounded-lg p-8 py-12 text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">About the Developer</h2>
                <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                    This application was developed by <span className="font-semibold">Stackr</span>, a passionate
                    student and aspiring tech entrepreneur. Focused on building clean, user-friendly applications
                    with modern web technologies.
                </p>

                <div className="flex justify-center gap-6 text-blue-600">
                    <a href="https://twitter.com/Stackarius" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors"><FaTwitter size={28} /></a>
                    <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors"><FaLinkedin size={28} /></a>
                    <a href="https://github.com/Stackarius" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors"><FaGithub size={28} /></a>
                    <a href="mailto:developer@example.com" className="hover:text-blue-800 transition-colors"><FaEnvelope size={28} /></a>
                </div>
            </div>

            <Footer />
        </div>
    );
}
