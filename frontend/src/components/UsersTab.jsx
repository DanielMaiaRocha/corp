import { motion } from "framer-motion";
import { Trash, Edit } from "lucide-react";
import { useState, useEffect } from "react"; // Adicione useEffect
import EditUserModal from "./EditUserModal"; // Importe o modal de edição de usuários
import { useUserStore } from "../../stores/useUserStore.js"; // Importe o store de usuários

const UsersList = () => {
    const { deleteUser, users, fetchUsers, loading } = useUserStore(); // Adicione loading
    const [editingUser, setEditingUser] = useState(null); // Estado para controlar o usuário em edição

    // Carregar usuários ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user) => {
        setEditingUser(user); // Abre o modal com o usuário selecionado
    };

    const handleUpdate = () => {
        setEditingUser(null); // Fecha o modal após a atualização
    };

    // Exibir um indicador de carregamento enquanto os dados são buscados
    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <>
            <motion.div
                className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead className='bg-gray-700'>
                        <tr>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Name
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Email
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Role
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-100 divide-y divide-gray-700'>
                        {users?.map((user) => (
                            <tr key={user._id} className='hover:bg-gray-200'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='ml-4'>
                                            <div className='text-sm font-medium text-black'>
                                                {user.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>{user.email}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-700'>{user.role}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2'>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className='text-blue-400 hover:text-blue-300'
                                    >
                                        <Edit className='h-5 w-5' />
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className='text-red-400 hover:text-red-300'
                                    >
                                        <Trash className='h-5 w-5' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Modal de Edição de Usuário */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default UsersList;