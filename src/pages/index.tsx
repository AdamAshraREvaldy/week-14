// pages/index.tsx
import { useState } from 'react';
import axios from 'axios';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

const AuthForm: React.FC<{ onSubmit: (data: AuthFormData) => void; buttonText: string }> = ({ onSubmit, buttonText }) => {
  const [formData, setFormData] = useState<AuthFormData>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {buttonText}
      </button>
    </form>
  );
};

const BookForm: React.FC<{ onSubmit: (data: { action: string; [key: string]: string }) => void; buttonText: string }> = ({ onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: '',
    pages: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ action: 'createBook', ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <label>Title:</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <label>Author:</label>
      <input type="text" name="author" value={formData.author} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <label>Publisher:</label>
      <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <label>Year:</label>
      <input type="text" name="year" value={formData.year} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <label>Pages:</label>
      <input type="text" name="pages" value={formData.pages} onChange={handleChange} required className="border border-gray-300 p-2 mb-2" />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {buttonText}
      </button>
    </form>
  );
};

const HomePage: React.FC = () => {
  const [token, setToken] = useState('');

  const handleLogin = async (data: AuthFormData) => {
    try {
      const response = await axios.post('/api', { action: 'login', ...data });
      setToken(response.data.token);
      console.log('User logged in. Token:', response.data.token);
    } catch (error) {
      console.error('Login failed:', (error as any).response?.data.message);
    }
  };

  const handleRegister = async (data: AuthFormData) => {
    try {
      const response = await axios.post('/api', { action: 'register', ...data });
      // Handle registration success (if needed)
      console.log('User registered. Token:', response.data.token);
    } catch (error) {
      console.error('Registration failed:', (error as any).response?.data.message);
    }
  };

  const handleLogout = () => {
    setToken('');
  };

  const handleCreateBook = async (data: { action: string; [key: string]: string }) => {
    try {
      const response = await axios.post('/api', data);
      console.log('Book created:', response.data.book);
    } catch (error) {
      console.error('Book creation failed:', (error as any).response?.data.message);
    }
  };

  const handleUpdateBook = async (data: { action: string; [key: string]: string }) => {
    try {
      const response = await axios.post('/api', data);
      console.log('Book updated:', response.data.book);
    } catch (error) {
      console.error('Book update failed:', (error as any).response?.data.message);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await axios.post('/api', { action: 'deleteBook', id: bookId });
      console.log('Book deleted:', response.data.book);
    } catch (error) {
      console.error('Book deletion failed:', (error as any).response?.data.message);
    }
  };

  return (
    <div className="p-4">
      {!token ? (
        <div>
          <h1 className="text-2xl mb-4">Login</h1>
          <AuthForm onSubmit={handleLogin} buttonText="Login" />

          <h1 className="text-2xl mb-4">Register</h1>
          <AuthForm onSubmit={handleRegister} buttonText="Register" />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl mb-4">Logout</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
            Logout
          </button>

          <h1 className="text-2xl mb-4">Create Book</h1>
          <BookForm onSubmit={handleCreateBook} buttonText="Create Book" />

          <h1 className="text-2xl mb-4">Update Book</h1>
          <BookForm onSubmit={handleUpdateBook} buttonText="Update Book" />

          <h1 className="text-2xl mb-4">Delete Book</h1>
          <label>Book ID:</label>
          <input type="text" onChange={(e) => handleDeleteBook(e.target.value)} className="border border-gray-300 p-2 mb-2" />

          <button onClick={() => handleDeleteBook('')} className="bg-red-500 text-white p-2 rounded">
            Delete Book
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
