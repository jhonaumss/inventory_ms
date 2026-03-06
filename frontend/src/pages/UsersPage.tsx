import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, IconButton, PageContainer, Table, Td, Th, Title2, Tr } from "../components/StyledComponents";
import { FiEdit, FiTrash } from "react-icons/fi";
import { deleteUser, getUsers } from "../api/users";
import { ConfirmModal } from "../components/ConfirmModal";
import type { User } from "../models/User";


export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
  };

  const handleDelete = async (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedUser(null);
  };
  const handleConfirmDelete = async () => {
    if (selectedUser && selectedUser.id !== undefined) {
      await deleteUser(selectedUser.id.toString());
      setShowModal(false);
      setSelectedUser(null);
      fetchUsers();
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/users/edit/${id}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleName = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Administrador";
      case "ROLE_MANAGER":
        return "Gerente";
      case "ROLE_SALES":
        return "Vendedor";
      default:
        return role;
    }
  }

  return (
    <PageContainer>
      <Header>
        <Title2>Usuarios</Title2>
        <Button onClick={() => navigate("/users/new")}>Agregar Usuario Nuevo</Button>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>Nombre de usuario</Th>
            <Th>Email</Th>
            <Th>Rol</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((currentUser) => (
            <Tr key={currentUser.id}>
              <Td>{currentUser.username}</Td>
              <Td>{currentUser.email}</Td>
              <Td>{getRoleName(currentUser.role)}</Td>
              <Td>
                <IconButton onClick={() => currentUser.id !== undefined && handleEdit(currentUser.id)}><FiEdit /></IconButton>
                <IconButton onClick={() => handleDelete(currentUser)}><FiTrash /></IconButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {selectedUser && (
        <ConfirmModal
          show={showModal}
          title="Confirmar borrar usuario"
          message={`¿Estás seguro de eliminar el usuario "${selectedUser.username}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </PageContainer>
  );
};
