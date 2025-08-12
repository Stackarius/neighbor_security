import React, {useState} from 'react'
import Link from "next/link"
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isOpen, setOpen] = useState(false)

    const otherLinks = [
        { id: 1, href: "/", name: "Home" },
        { id: 2, href: "#works", name: "Works" },
        { id: 3, href: "#contact", name: "Contact" },
    ];

    return (
        <nav className="fixed top-0 bg-transparent w-full flex items-center justify-between p-3 z-10">
            <Link href="/">
                <Image
                    alt='nsw logo'
                    src="/nsw_logo.png"
                    height={100}
                    width={100}
                    className='object-cover '
                />
            </Link>
            {/*  */}
            <button
                className="sm:hidden bg-black p-1 rounded relative text-xl outline-none z-40 ransition-all duration-300 ease-in-out overflow-y-visible"
                onClick={() => setOpen(!isOpen)}
                aria-label="Toggle navigation"
            >
                {!isOpen ? <Menu className='text-white' /> : <FaTimes className='text-white' />}
            </button>

            {/* other links */}
            <div className="hidden sm:flex gap-6 transition-all duration-300">
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
            {/* Mobile Navigation */}
            {isOpen && <div className={`fixed flex flex-col items-center justify-center top-0 right-[100%] z-20 p-10 bg-gray-900 shadow-lg transition-all duration-300 ease-in-out sm:hidden ${isOpen ? 'w-full mx-w[400px] h-full left-[0%] opacity-100 transition-all duration-400 ease-in-out' : ' opacity-0'
                }`}>
                {otherLinks.map((link) => (
                    <Link
                        href={link.href}
                        key={link.id}
                        className="inline text-lg text-white px-5 py-3 mx-2 hover:text-yellow-500"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>}
        </nav>
    )
}

export default Header