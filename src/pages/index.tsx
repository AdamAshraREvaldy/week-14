// pages/index.tsx
import { useState } from 'react';
import axios from 'axios';

const AuthForm: React.FC<{ onSubmit: (data: { action: string; [key: string]: string }) => void; buttonText: string }> = ({ onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  }; 

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />

      <button type="submit">{buttonText}</button>
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label>Author:</label>
      <input type="text" name="author" value={formData.author} onChange={handleChange} required />

      <label>Publisher:</label>
      <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} required />

      <label>Year:</label>
      <input type="text" name="year" value={formData.year} onChange={handleChange} required />

      <label>Pages:</label>
      <input type="text" name="pages" value={formData.pages} onChange={handleChange} required />

      <button type="submit">{buttonText}</button>
    </form>
  );
};

const HomePage: React.FC = () => {
  const [token, setToken] = useState('');

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post('/api', { action: 'login', ...data });
      setToken(response.data.token);
      console.log('User logged in. Token:', response.data.token);
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };

  const handleLogout = () => {
    setToken('');
  };

  const handleCreateBook = async (data: { [key: string]: string }) => {
    try {
      const response = await axios.post('/api', { action: 'createBook', ...data });
      console.log('Book created:', response.data.book);
    } catch (error) {
      console.error('Book creation failed:', error.response.data.message);
    }
  };

  const handleUpdateBook = async (data: { [key: string]: string }) => {
    try {
      const response = await axios.post('/api', { action: 'updateBook', ...data });
      console.log('Book updated:', response.data.book);
    } catch (error) {
      console.error('Book update failed:', error.response.data.message);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await axios.post('/api', { action: 'deleteBook', id: bookId });
      console.log('Book deleted:', response.data.book);
    } catch (error) {
      console.error('Book deletion failed:', error.response.data.message);
    }
  };

  return (
    <div>
      {!token ? (
        <div>
          <h1>Login</h1>
          <AuthForm onSubmit={handleLogin} buttonText="Login" />
        </div>
      ) : (
        <div>
          <h1>Logout</h1>
          <button onClick={handleLogout}>Logout</button>

          <h1>Create Book</h1>
          <BookForm onSubmit={handleCreateBook} buttonText="Create Book" />

          <h1>Update Book</h1>
          <BookForm onSubmit={handleUpdateBook} buttonText="Update Book" />

          <h1>Delete Book</h1>
          <label>Book ID:</label>
          <input type="text" onChange={(e) => handleDeleteBook(e.target.value)} />

          <button>Delete Book</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
