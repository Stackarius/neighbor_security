import React from 'react'
import { FaPen } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


const EditProfileBtn = () => {
    const router = useRouter();
    const handleEditProfile = () => {
        router.push("/profile");
    };
    return (
      <div onClick={handleEditProfile} className="flex items-center cursor-pointer bg-red-600 font-semibold text-white p-2 px-4 rounded">
        <FaPen className="inline mr-2" />
       <p>Edit Profile</p>
      </div>
    );
}

export default EditProfileBtn