import React from 'react'
import Link from "next/link"

const Header = () => {
    
    const otherLinks = [
        { id: 1, href: "/", name: "Home" },
        { id: 2, href: "#works", name: "Works" },
        { id: 3, href: "#contact", name: "Contact" },
    ];

    return (
        <nav className="relative bg-transparent w-full flex items-center p-3 z-10">
            <Link href="/" className="text-white font-semibold text-2xl mx-4">
                NSW
            </Link>
            {/* other links */}
            <div className="flex ml-auto">
                {otherLinks.map((link) => (
                    <Link
                        href={link.href}
                        key={link.id}
                        className="inline text-lg text-white px-5 py-3 mx-2 hover:text-yellow-500"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default Header