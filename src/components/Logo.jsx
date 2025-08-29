import Image from "next/image";

export default function Logo() {
    return (
        <div className="">
            <Image
                src="/nsw_logo.png"
                alt="NSW Logo"
                width={50}
                height={50}
                className="w-full h-auto"
            />
        </div>
    );
}
