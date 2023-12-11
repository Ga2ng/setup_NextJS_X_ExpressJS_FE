// pages/login.js
"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from 'next/navigation';

const jwt = require('jsonwebtoken');

const LoginPage = () => {
  const router = useRouter();
  const [nama_lengkap, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const apiUrl = "http://127.0.0.1:8000/login";
      const response = await axios.post(apiUrl, { nama_lengkap, password });
  
      // Mendapatkan token dari respons
      const { token } = response.data;
      console.log('token res', token);

      // Menyimpan token dalam cookie dengan masa berlaku (misalnya, 1 jam)
      Cookies.set("auth_token", token, { expires: 15 / (24 * 60) }); //  1 / 0.5 -> untuk 1hari
  
      // Mengirim token ke server di setiap permintaan selanjutnya
      const apiWithToken = axios.create({
        baseURL: "http://127.0.0.1:8000",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Mendapatkan informasi pengguna dari token
      const { id: userId } = jwt.decode(token);
      // Melakukan permintaan GET dengan menyertakan ID pengguna dalam URL
      const userResponse = await apiWithToken.get(`/mahasiswa/${userId}`);
      console.log('Data pengguna:', userResponse.data);
      // Redirect atau lakukan aksi lain setelah login berhasil
      router.push('/mahasiswa');
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    }
  };
  

  return (
    <div className="text-black min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login Page</h1>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Username:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={nama_lengkap}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Password:</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
