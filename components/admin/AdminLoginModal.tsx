import React, { useState } from 'react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (success: boolean) => void;
  t: any;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // In a real app, this would be a secure API call.
    if (username === 'admin' && password === 'password') {
      onLogin(true);
    } else {
      setError(t.adminLoginError);
      onLogin(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{t.adminLoginTitle}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="username">{t.adminUsernameLabel}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="password">{t.adminPasswordLabel}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            {t.adminLoginButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
