'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Authenticated from '@/layouts/Authenticated';

// Interface untuk tipe data mahasiswa
interface Mahasiswa {
  id: string;
  nama_lengkap: string;
  // Tambahkan field lainnya sesuai kebutuhan
}

const MahasiswaPage: React.FC = () => {
  const router = useRouter();
  const [mahasiswaData, setMahasiswaData] = useState<Mahasiswa[]>([]);
  useEffect(() => {
    // Fungsi untuk mengambil data mahasiswa dari API
    const fetchData = async () => {
      try {
        const token = Cookies.get('auth_token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        // Melakukan permintaan dengan header yang disiapkan
        const response = await axios.get<Mahasiswa[]>('http://localhost:8000/mahasiswa', { headers });
        const data = response.data;
        // Set data mahasiswa ke state
        setMahasiswaData(data);
      } catch (error) {
        console.log(error);
        
      }
    }
    // Panggil fungsi fetchData
    fetchData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('auth_token');
    router.push('/');
  }
  
  return (
    <Authenticated>
      {( auth ) => (
        <>
          <h1>MahasiswaPage, welcome {auth.nama_lengkap}</h1>
          <button onClick={handleLogout} className='bg-red-500'>Logout</button>
          <div>
            {mahasiswaData.map((mahasiswa) => (
              <div key={mahasiswa.id}>
                <p>Nama Lengkap: {mahasiswa.nama_lengkap}</p>
                {/* Tambahkan field lainnya sesuai kebutuhan */}
              </div>
            ))}
          </div>
        </>
      )}
    </Authenticated>
  );
};

export default MahasiswaPage;