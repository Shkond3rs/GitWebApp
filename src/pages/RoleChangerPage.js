import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SecondaryNavBar from '../components/navigation/SecondaryNavBar';
import './RoleChangerPage.css';

const RoleChangerPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/get_all');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsAdmin(user.roles.includes('ROLE_ADMIN'));
    setIsDropdownOpen(false);
  };

  const handleRoleChange = () => {
    setIsAdmin(!isAdmin);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    const updatedRoles = isAdmin ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER'];
    const roleIds = updatedRoles.map((role) => {
      return role === 'ROLE_ADMIN' ? 2 : 1; // Adjust according to your role IDs in the database
    });

    try {
      await axios.put('http://localhost:8080/api/users/update_roles', {
        userId: selectedUser.id,
        roleIds: roleIds,
      });
      alert('User roles updated successfully');
    } catch (error) {
      console.error('Error updating user roles:', error);
      alert('Failed to update user roles');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="role-changer-container">
        <div className="gray-background">
          <div className="form-block">
            <p>Редактировать права пользователя</p>
            <div className="search-user">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
              />
              {isDropdownOpen && (
                <div className="dropdown-content" ref={dropdownRef}>
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="dropdown-item"
                      onClick={() => handleUserSelect(user)}
                    >
                      {user.email}
                      <span className="role-label">
                        {user.roles.includes('ROLE_ADMIN') ? 'Администратор' : 'Пользователь'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedUser && (
              <>
                <div className="role-selection">
                  <label>Администратор</label>
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={handleRoleChange}
                  />
                </div>
                <button className="submit-button" onClick={handleSave}>
                  Сохранить изменения
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleChangerPage;
