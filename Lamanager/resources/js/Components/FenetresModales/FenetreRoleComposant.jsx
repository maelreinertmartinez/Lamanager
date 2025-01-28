import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/rolePopup.css";

const RoleManagementPopup = ({ onClose }) => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ id: null, nom: "", nombre_heure: "" });
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (newRole.nom && newRole.nombre_heure) {
      try {
        const response = isEditing
          ? await axios.put(`/api/roles/${newRole.id}`, newRole)
          : await axios.post('/api/roles', newRole);

        const updatedRole = response.data;

        if (isEditing) {
          setRoles(roles.map(role => (role.id === updatedRole.id ? updatedRole : role)));
        } else {
          setRoles([...roles, updatedRole]);
        }

        setNewRole({ id: null, nom: "", nombre_heure: "" });
        setShowCreationForm(false);
        setIsEditing(false);
      } catch (error) {
        console.error('Erreur lors de l\'ajout ou de la modification du rôle:', error);
      }
    }
  };

  const handleEditRole = (id) => {
    const roleToEdit = roles.find((role) => role.id === id);
    setNewRole(roleToEdit);
    setShowCreationForm(true);
    setIsEditing(true);
  };

  const handleAddClick = () => {
    setNewRole({ id: null, nom: "", nombre_heure: "" });
    setShowCreationForm(true);
    setIsEditing(false);
  };

  const toggleRoleActive = (id) => {
    setRoles(roles.map(role => role.id === id ? { ...role, active: !role.active } : role));
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Gestion des rôles</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="roles-and-form">
          <div className="roles-section">
            <div className="roles-header">
              <h3>Rôles</h3>
              <button className="add-btn" onClick={handleAddClick}>Ajouter</button>
            </div>
            <ul>
              {roles.map((role) => (
                <li key={role.id}>
                  {role.nom} ({role.nombre_heure}h)
                  <button onClick={() => handleEditRole(role.id)}>✏️</button>
                </li>
              ))}
            </ul>
          </div>
          {showCreationForm && (
            <div className="creation-section">
              <h3>{isEditing ? "Modification" : "Création"}</h3>
              <label>
                {isEditing ? "Modifier le nom du rôle" : "Nom du rôle"}
                <input
                  type="text"
                  value={newRole.nom}
                  onChange={(e) => setNewRole({ ...newRole, nom: e.target.value })}
                />
              </label>
              <label>
                {isEditing ? "Modifier le nombre d'heures" : "Nombre d'heures"}
                <input
                  type="number"
                  value={newRole.nombre_heure}
                  onChange={(e) => setNewRole({ ...newRole, nombre_heure: e.target.value })}
                />
              </label>
              <div className="action-buttons">
                <button className="add-button" onClick={handleAddRole}>{isEditing ? "Modifier" : "Ajouter"}</button>
                <button className="cancel-button" onClick={() => setShowCreationForm(false)}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPopup;