import React, { useState } from 'react';
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL; // Obtener la URL de la API desde una variable de entorno

const Table = () => {
    const [selecte, setSelected] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('');
    const [rolesA, setRoles] = useState('');
    const [selectedPermis, setSelectedPermis] = useState('');
    const [permis, setPermis] = useState('');
    const [IDpermis, setIDPermis] = useState('');
    const [save, setSave] = useState('');
    const [newTable, setNewTable] = useState(false)
    const [selectedRoleInput, setSelectedRoleInput] = useState(null);
    const [error, setError] = useState([''])
    let permisosMENU = []
    const permissions = ["PROJECT:WRITE", "STORE:READ", "STORE:WRITE", "PROJECT:READ", "ACCOUNT:READ_ACCESS"];
    const entities = permissions.map(permission => permission.split(':')[0]);
    const uniqueEntities = Array.from(new Set(entities));
    const [entityColumns, setEntityColumns] = useState(uniqueEntities.map(entity => {
        const entityPermissions = permissions
            .filter(permission => permission.split(':')[0] === entity)
            .map(permission => permission.split(':')[1]);
        return { entidad: entity, permisos: entityPermissions };
    }));
    const [roles, setRolesData] = useState([
        {
            id: "1",
            name: "Administrador",
            permissions: ["PROJECT:WRITE", "STORE:READ", "PROJECT:READ", "ACCOUNT:READ_ACCESS"],
        },
        {
            id: "2",
            name: "Editor",
            permissions: ["PROJECT:WRITE", "STORE:READ"],
        },
        {
            id: "3",
            name: "Visitante",
            permissions: ["ACCOUNT:READ_ACCESS"],
        },
        {
            id: "4",
            name: "Admin",
            permissions: ["PROJECT:WRITE", "STORE:READ"],
        },


    ]);


    //Funcion que al dar doble clic en el Rol aparezca el input para cambiar su nombre
    const handleRowClick = (roleId) => {
        if (selectedRoleInput === roleId)
            setSelectedRoleInput(null);
        else setSelectedRoleInput(roleId);


    };
    const handleNameChange = (roleId, newName) => {
        const updatedRoles = roles.map((role) => {
            if (role.id === roleId) {
                return { ...role, name: newName };
            }
            return role;
        });
        setRolesData(updatedRoles);
    };

    //funciones para que aparezca el checkbox en los ENTITY y seleccionar todos o desmarcarlos todos
    const handleMouseOverEntity = (entity) => {
        setSelectedEntity(entity);
    };

    const handleSelectAllChangeEntity = (entity) => {
        if (entity === rolesA) {
            setRoles('')
            if (newTable) {
                permisosMENU = [...entityColumns.flatMap(objeto => objeto.permisos.map(permiso => `${objeto.entidad}:${permiso}`))]

            } else {
                permisosMENU = [...permissions]
            }
            const entityPermissions = permisosMENU
                .filter(permission => permission.split(':')[0] === entity)
                .map(permission => permission.split(':')[1]);

            const updatedRoles = roles.map((role) => {
                const updatedPermissions = role.permissions.filter(permission => {
                    const [permissionEntity, permissionName] = permission.split(':');
                    return permissionEntity !== entity || !entityPermissions.includes(permissionName);
                });

                return {
                    ...role,
                    permissions: updatedPermissions,
                };
            });

            setRolesData(updatedRoles);
        } else {
            setRoles(entity)
            if (newTable) {
                permisosMENU = [...entityColumns.flatMap(objeto => objeto.permisos.map(permiso => `${objeto.entidad}:${permiso}`))]

            } else {
                permisosMENU = [...permissions]
            }
            const entityPermissions = permisosMENU
                .filter(permission => permission.split(':')[0] === entity)
                .map(permission => permission.split(':')[1]);

            const updatedRoles = roles.map((role) => {
                const updatedPermissions = [...role.permissions];
                entityPermissions.forEach(permission => {
                    const fullPermission = `${entity}:${permission}`;
                    if (!role.permissions.includes(fullPermission)) {
                        updatedPermissions.push(fullPermission);
                    }
                });

                return {
                    ...role,
                    permissions: updatedPermissions,
                };
            });


            setRolesData(updatedRoles);
        }
    };

    //funciones para que aparezca el checkbox en los PERMISOS y seleccionar todos o desmarcarlos todos
    const handleMouseOverPermis = (permiso, id) => {
        setSelectedPermis(permiso);
        setIDPermis(id)
    };
    const handleSelectAllChangePermis = (permiso, id) => {
        if (permis === id) {
            setPermis('')
            const updatedRoles = roles.map((role) => {
                if (role.permissions.includes(id)) {
                    const updatedPermissions = role.permissions.filter((permission) => permission !== id);
                    return {
                        ...role,
                        permissions: updatedPermissions,
                    };
                }
                return role;
            });

            setRolesData(updatedRoles);
        } else {
            setPermis(id)
            const updatedRoles = roles.map((role) => {
                if (!role.permissions.includes(id)) {
                    const updatedPermissions = [...role.permissions, id];

                    return {
                        ...role,
                        permissions: updatedPermissions,
                    };
                }
                return role;
            });

            setRolesData(updatedRoles);
        }
    };


    //funciones para que aparezca el checkbox en los ROLES y seleccionar todos o desmarcarlos todos
    const handleMouseOver = (roleId) => {
        setSelectedRole(roleId);
    };
    const handleSelectAllChange = (id) => {
        if (id === selecte) {
            setSelected('')
            const updatedRoles = roles.map((role) => {
                if (role.id === id) {
                    return {
                        ...role,
                        permissions: [], // Eliminar todos los permisos, asignando un arreglo vacío
                    };
                }
                return role;
            });

            setRolesData(updatedRoles);
        } else {
            setSelected(id)
            if (newTable) {
                permisosMENU = [...entityColumns.flatMap(objeto => objeto.permisos.map(permiso => `${objeto.entidad}:${permiso}`))]

            } else {
                permisosMENU = [...permissions]
            }

            const updatedRoles = roles.map((role) => {
                if (role.id === id) {
                    const missingPermissions = permisosMENU.filter((permission) => !role.permissions.includes(permission));
                    const updatedPermissions = [...role.permissions, ...missingPermissions];
                    return {
                        ...role,
                        permissions: updatedPermissions,
                    };

                }
                return role;
            });
            setRolesData(updatedRoles);
        }

        setSelectAll(!selectAll);

    };
    //funcion para anadir un nuevo rol
    const handleAddRow = () => {
        if (newTable) {
            permisosMENU = [...entityColumns.flatMap(objeto => objeto.permisos.map(permiso => `${objeto.entidad}:${permiso}`))]

        } else {
            permisosMENU = [...permissions]
        }
        const entitiesWithRead = permisosMENU.filter((permission) =>
            permission.endsWith(":READ")
        );
        const newRow = { id: roles.length + 1, name: "Nuevo Rol", permissions: entitiesWithRead };
        const updatedRoles = [...roles, newRow];
        setRolesData(updatedRoles);
    };

    //Funcion para eliminar un ROLE
    const handleDeleteRole = (roleId) => {
        const updatedRoles = roles.filter((role) => role.id !== roleId);
        setRolesData(updatedRoles);
    };

    //Funcion para eliminar un ENTIDAD
    const handleDeleteEntityPermissions = (entity) => {

        const filteredData = entityColumns.filter(item => item.entidad !== entity);
        setEntityColumns(filteredData);
    };

    //Funcion para eliminar un PERMISO de una ENTIDAD
    const handleDeletePermission = (permission) => {
        const [entity, perm] = permission.split(':');
        const updatedPermissions = entityColumns.map((item) => {
            if (item.entidad === entity) {
                const updatedPermisos = item.permisos.filter((permiso) => permiso !== perm);

                if (updatedPermisos.length === 0) {
                    return null
                }

                return { ...item, permisos: updatedPermisos };
            }
            return item;
        });
        // Filtrar y eliminar las entidades que quedaron como null
        const filteredPermissions = updatedPermissions.filter((item) => item !== null)
        setEntityColumns(filteredPermissions);

        const updatedRoles = roles.map((role) => {
            if (role.permissions.includes(permission)) {
                const updatedPermissionsROLE = role.permissions.filter(
                    (permissionFILTER) => permissionFILTER !== permission
                );
                return {
                    ...role,
                    permissions: updatedPermissionsROLE
                };
            }
            return role;
        });

        // Actualizar el estado con los roles actualizados
        setRolesData(updatedRoles);


    };
    //funcion para mostrar las "X" o "" dependiendo de los valores de la data
    const ROWS = (entityColumn_entidad, role_permissions) => {
        switch (true) {
            case selectedRole !== entityColumn_entidad && role_permissions:
                return "X";
            default:
                return null;
        }
    };
    //funcion para guardar los datos (los muestro en pantalla )
    const handleSave = () => {

        setSave(roles)
    }

    const [showModal, setShowModal] = useState(false);
    const [newPermission, setNewPermission] = useState('');

    const handleAddPermission = () => {
        // Lógica para mostrar el modal y capturar el nuevo permiso
        setShowModal(true);
    };
    const isValidPermission = (permission) => {
        // Implement your validation logic here
        // For example, check if the permission string matches the expected format
        const regex = /^[A-Z_]+:[A-Z_]+$/;
        return regex.test(permission);
    };


    const handleModalOk = () => {
        // Validar si la cadena de permiso es válida
        if (isValidPermission(newPermission)) {
            const [entidad, permisos] = newPermission.split(':');
            const objetoConvertido = {
                entidad: entidad,
                permisos: permisos.split(','),
            };
            const existeEntidad = entityColumns.some(item => item.entidad === objetoConvertido.entidad);

            if (existeEntidad) {

                if (permissions.includes(newPermission)) {
                    alert("EL permiso de la Entidad ya existe")
                } else {
                    setNewTable(true)
                    if (newTable) {
                        permisosMENU = [...entityColumns.flatMap(objeto => objeto.permisos.map(permiso => `${objeto.entidad}:${permiso}`))]

                    } else {
                        permisosMENU = [...permissions]
                    }
                    permisosMENU.push(newPermission)
                    const entities = permisosMENU.map(permission => permission.split(':')[0]);
                    const uniqueEntities = Array.from(new Set(entities));
                    setEntityColumns(uniqueEntities.map(entity => {
                        const entityPermissions = permisosMENU
                            .filter(permission => permission.split(':')[0] === entity)
                            .map(permission => permission.split(':')[1]);
                        return { entidad: entity, permisos: entityPermissions };
                    }));

                }
            } else {
                setNewTable(true)

                // Crear un nuevo arreglo actualizado con el objetoConvertido
                const updatedEntityColumns = [
                    ...entityColumns,
                    objetoConvertido
                ];



                // Actualizar el estado utilizando setEntityColumns
                setEntityColumns(updatedEntityColumns);
            }


            // Cerrar el modal y reiniciar los valores
            setShowModal(false);
            setNewPermission('');
            setError('')
        } else {
            // La cadena de permiso no es válida, mostrar mensaje de error o realizar alguna acción
            setError("Error de sintaxis, el formato correto debe ser: STORE:READ ")
        }
    };


    const createRoles = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/roles`, roles);
            console.log('Roles creados:', response.data);
            // Realizar acciones adicionales después de crear los roles
        } catch (error) {
            console.error('Error al crear los roles:', error);
        }
    };

    const updateRoles = async () => {
        try {
            const response = await axios.put(`${API_URL}/api/roles`, roles);
            console.log('Roles actualizados:', response.data);
            // Realizar acciones adicionales después de actualizar los roles
        } catch (error) {
            console.error('Error al actualizar los roles:', error);
        }
    };

    const deleteRoles = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/roles`, id);
            console.log('Roles eliminados:', response.data);
            // Realizar acciones adicionales después de eliminar los roles
        } catch (error) {
            console.error('Error al eliminar los roles:', error);
        }
    };


    return (
        <div className='table-container'>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', borderBottom: '1px solid black' }}></th>
                        {entityColumns.map(entityColumn => (
                            <th
                                key={entityColumn.entidad}
                                style={{ padding: '10px', borderBottom: '1px solid black' }}
                                colSpan={entityColumn.permisos.length}
                                onMouseOver={() => handleMouseOverEntity(entityColumn.entidad)}
                                onMouseLeave={() => handleMouseOverEntity()}
                            >
                                {entityColumn.entidad.charAt(0).toUpperCase() + entityColumn.entidad.slice(1).toLowerCase().replace(/_/g, ' ')}
                                {selectedEntity === entityColumn.entidad && (
                                    <>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelectAllChangeEntity(entityColumn.entidad)}
                                            checked={rolesA === entityColumn.entidad}
                                        />
                                        <button className="delete-icon" onClick={() => handleDeleteEntityPermissions(entityColumn.entidad)}>
                                            🗑️
                                        </button>
                                    </>
                                )}
                            </th>
                        ))}

                    </tr>
                    <tr>
                        <th style={{ padding: '10px', borderBottom: '1px solid black' }}>Roles</th>
                        {entityColumns.map(entityColumn =>
                            entityColumn.permisos.map(permiso => (
                                <th
                                    onMouseOver={() => handleMouseOverPermis(permiso, `${entityColumn.entidad}:${permiso}`)}
                                    onMouseLeave={() => handleMouseOverPermis()}
                                    key={`${entityColumn.entidad}:${permiso}`}
                                    style={{ padding: '10px', borderBottom: '1px solid black' }}
                                >
                                    {permiso.charAt(0).toUpperCase() + permiso.slice(1).toLowerCase().replace(/_/g, ' ')}
                                    {selectedPermis === permiso && IDpermis === `${entityColumn.entidad}:${permiso}` && (
                                        <>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectAllChangePermis(permiso, `${entityColumn.entidad}:${permiso}`)}
                                                checked={permis === `${entityColumn.entidad}:${permiso}`}
                                            />
                                            <button className="delete-icon" onClick={() => handleDeletePermission(`${entityColumn.entidad}:${permiso}`)}>
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                </th>
                            ))
                        )}


                    </tr>

                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.id} onDoubleClick={() => handleRowClick(role.id)}>
                            <td className='delete-cell' style={{ padding: '10px', border: '1px solid black' }} onMouseOver={() => handleMouseOver(role.id)} onMouseLeave={() => handleMouseOver()}>
                                {role.name}
                                {selectedRoleInput === role.id && (
                                    <input
                                        type="text"
                                        onChange={(e) => handleNameChange(role.id, e.target.value)}
                                        value={role.name}
                                        style={{
                                            padding: '5px',
                                            marginLeft: '5px',
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            fontSize: '16px',
                                            width: '100px',
                                        }}
                                    />
                                )}
                                {selectedRole === role.id && (
                                    <>
                                        <input type="checkbox" onChange={() => handleSelectAllChange(role.id)} checked={selecte === role.id} />
                                        <button className="delete-icon" onClick={() => handleDeleteRole(role.id)}>
                                            🗑️
                                        </button>
                                    </>

                                )}


                            </td>
                            {entityColumns.map(entityColumn =>
                                entityColumn.permisos.map(permiso => (
                                    <td key={`${entityColumn.entidad}:${permiso}`} style={{ padding: '10px', border: '1px solid black' }}>
                                        {ROWS(entityColumn.entidad, role.permissions.includes(`${entityColumn.entidad}:${permiso}`))}
                                    </td>
                                ))
                            )}
                            {
                                role.id.toString() === '1' &&
                                <th rowSpan={roles.length}>
                                    <button className='add-row-button' onClick={handleAddPermission}>Agregar Permiso</button>
                                </th>
                            }



                        </tr>
                    ))}


                    <tr style={{ color: 'white' }}>
                        <td colSpan="100">
                            <button className="add-row-button" onClick={handleAddRow}>
                                Agregar fila
                            </button>
                        </td>
                    </tr>
                </tbody>

            </table>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                    <button
                        className="save-Button"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button className="save-Button" onClick={createRoles}>Crear Roles</button>
                    <button className="save-Button" onClick={updateRoles}>Actualizar Roles</button>
                    <button className="save-Button" onClick={() => deleteRoles(id)}>Eliminar Roles</button>
                </div>
                {showModal && (
                    <div style={{ backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "4px" }}>
                        <input
                            type="text"
                            value={newPermission}
                            onChange={(e) => setNewPermission(e.target.value)}
                            style={{ width: "50%", padding: "8px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <button
                            onClick={handleModalOk}
                            style={{
                                backgroundColor: "#4caf50",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                textAlign: "center",
                                textDecoration: "none",
                                display: "inline-block",
                                fontSize: "14px",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Ok
                        </button>
                        {error !== '' && (
                            <p> {error}</p>
                        )

                        }
                    </div>
                )}
                {save !== '' && (
                    <pre>
                        <code>{JSON.stringify(save, null, 4)}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}

export default Table;