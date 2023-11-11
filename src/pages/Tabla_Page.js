import React, { useState } from 'react';

const Tables = () => {
  const initialEntities = [
    {
      id: 1,
      name: 'Entity 1',
      permisos: [
        { id: 2,  name: 'perm1', selected: false },
        { id: 3,  name: 'perm2', selected: false },
        { id: 4,  name: 'perm3', selected: false },
      ],
    },
    {
      id: 2,
      name: 'Entity 2',
      permisos: [
        { id: 1,  name: 'perm4', selected: false },
        { id: 3, name: 'perm15', selected: false },
        { id: 4, name: 'perm6', selected: false },
      ],
    },
    {
      id: 3,
      name: 'Entity 3',
      permisos: [
        { id: 1, name: 'perm7', selected: false },
        { id: 2,  name: 'perm8', selected: false },
        { id: 4, name: 'perm19', selected: false },
      ],
    },
  ];

  const roles = ['Role1', 'Role2', 'Role3', 'Role4'];

  const [selectedRole, setSelectedRole] = useState(null);
  const [entities, setEntities] = useState(initialEntities);

  const handleRoleMouseOver = (role) => {
    setSelectedRole(role);
  };

  const handleRoleMouseOut = () => {
    setSelectedRole(null);
  };

  const handlePermissionChange = (role, isChecked) => {
    const updatedEntities = entities.map((entity) => {
      const updatedPermisos = entity.permisos.map((permiso) => {
        if (permiso.name === role) {
          return { ...permiso, selected: isChecked };
        }
        return permiso;
      });
      return { ...entity, permisos: updatedPermisos };
    });
    setEntities(updatedEntities);
  };

  return (
    <div className="table-container">
      {entities.map((entity) => (
        <table className="table" key={entity.id}>
          <thead>
            <tr>
              <th colSpan={roles.length + 1}>Entity {entity.id}</th>
            </tr>
            <tr>
              <th>Roles</th>
              {entity.permisos.map((permiso) => (
                <th key={permiso.name}>{permiso.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role}>
                <td
                  onMouseOver={() => handleRoleMouseOver(role)}
                  onMouseOut={handleRoleMouseOut}
                >
                  {role}
                  {selectedRole === role && (
                    <input
                      type="checkbox"
                      checked={
                        entity.permisos.some(
                          (permiso) =>
                            permiso.name === role && permiso.selected
                        )
                      }
                      onChange={(e) =>
                        handlePermissionChange(role, e.target.checked)
                      }
                    />
                  )}
                </td>
                {entity.permisos.map((permiso) => (
                  <td key={permiso.id}>
                    {permiso.name === role && permiso.selected ? 'X' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default Tables;