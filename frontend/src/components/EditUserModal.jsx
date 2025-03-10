import { useState, useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const { updateUser } = useUserStore();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        zipCode: user.zipCode,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(user._id, formData);
            onUpdate(); // Fecha o modal e atualiza a lista
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                <h2 className='text-xl font-bold mb-4'>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Name</label>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Email</label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Role</label>
                            <select
                                name='role'
                                value={formData.role}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                            >
                                <option value='customer'>Customer</option>
                                <option value='admin'>Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Phone</label>
                            <input
                                type='text'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Address</label>
                            <input
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Zip Code</label>
                            <input
                                type='text'
                                name='zipCode'
                                value={formData.zipCode}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                    </div>
                    <div className='mt-6 flex justify-end space-x-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;