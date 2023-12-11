// Import modul dan komponen yang diperlukan
'use client'
import React, { useEffect, ReactNode, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

const jwt = require('jsonwebtoken');

// Mendefinisikan interface AuthenticatedProps
interface AuthenticatedProps {
  children: (auth: any) => ReactNode; // Menggunakan fungsi yang menerima prop auth
}

// Mendefinisikan komponen Authenticated
const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const router = useRouter();

  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // Fungsi untuk verifikasi token
    const tokenVerif = async () => {
      try {
        // Dapatkan token dari cookie
        const token = Cookies.get('auth_token');
        
        // Jika token tidak ada, redirect ke halaman login
        if (!token) {
          router.push('/');
          return;
        }
        
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
      // console.log('Data pengguna:', userResponse.data); 
        
        // Set state auth dengan data pengguna
        setAuth(userResponse.data);
      } catch (error) {
        // Tangani kesalahan
        if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 401) {
          console.error('Token tidak valid atau ID tidak terdaftar di server:', error);
          setAuth(null);
          router.push('/');
        } else {
          console.error('Gagal mengambil data mahasiswa:', error);
        }
      }
    };
    
    // Panggil fungsi tokenVerif
    tokenVerif();
  }, [router]);
  console.log(auth);

  // Render children komponen dengan memberikan prop auth
  return (  
    <>
      {auth && (
          <div>{children(auth)}</div>
        // <div>{children(auth)}</div>
      )}
    </>
  )
};

// Eksport komponen Authenticated
export default Authenticated;
