import { motion } from "framer-motion";
import { Trash, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import EditUserModal from "./EditUserModal";
import { useUserStore } from "../../stores/useUserStore";

const UsersList = () => {
    const { deleteUser, users, fetchUsers, loading } = useUserStore();
    const [editingUser, setEditingUser] = useState(null);
    const [expandedUserId, setExpandedUserId] = useState(null); // Estado para controlar o usuário expandido

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

    const toggleExpand = (userId) => {
        setExpandedUserId((prevId) => (prevId === userId ? null : userId));
    };

    // Exibir um indicador de carregamento enquanto os dados são buscados
    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <>
            <motion.div
                className="bg-gray-50 shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto p-4 mb-32"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hidden md:grid grid-cols-4 gap-4 text-sm font-medium text-gray-300 uppercase bg-gray-700 p-4 rounded-lg">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Actions</div>
                </div>
                <div className="space-y-4">
                    {users?.map((user) => (
                        <motion.div
                            key={user._id}
                            className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="md:hidden flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-black">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-700">{user.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleExpand(user._id)}
                                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                                >
                                    {expandedUserId === user._id ? (
                                        <ChevronUp className="h-5 w-5" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {expandedUserId === user._id && (
                                <div className="md:hidden mt-4 space-y-2">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Role:</span> {user.role}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="hidden md:grid md:grid-cols-4 gap-4 items-center">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-black">
                                            {user.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-700">{user.email}</div>
                                <div className="text-sm text-gray-700">{user.role}</div>
                                <div className="flex space-x-2 justify-end">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
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