export const saveUsers = (users) => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  };
  
  export const loadUsers = () => {
    const saved = localStorage.getItem('mockUsers');
    return saved ? JSON.parse(saved) : null;
  };