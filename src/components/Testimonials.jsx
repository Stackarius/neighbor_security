"use client"
import React from "react";
import Image from "next/image";

const Testimonials = () => {
    const testimonials = [
        {
            name: "Chinedu Okafor",
            role: "Community Member",
            image: '/male.jpg',
            message:
                "This platform has made reporting incidents so easy. I feel much safer knowing our neighborhood is connected.",
        },
        {
            name: "Amina Yusuf",
            role: "Resident",
            image: '/female.jpg',
            message:
                "I love how quickly admins respond to reports. It really builds trust and makes me confident in our community.",
        },
        {
            name: "James Ade",
            role: "Neighborhood Watch",
            image: '/male.jpg',
            message:
                "With this system, we track incidents faster and prevent issues before they escalate. Game changer!",
        },
    ];

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    What Our Community Says
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg text-center"
                        >
                            <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={80}
                                height={80}
                                className="rounded-full object-cover mb-4 mx-auto border border-2-blue-900"
                            />
                            <p className="text-gray-700 italic mb-4">"{testimonial.message}"</p>
                            <h4 className="text-lg font-semibold text-gray-900">
                                {testimonial.name}
                            </h4>
                            <span className="text-sm text-gray-500">{testimonial.role}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
