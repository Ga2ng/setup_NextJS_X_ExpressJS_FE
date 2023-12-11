// 'use client'
'use client'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Authenticated from '@/layouts/Authenticated';

const Dashboard = () => {
  
  return (
    <Authenticated >
      {( auth ) => (
        <div className='bg-black' >
          <div className='text-[50px] text-red-800'>Welcome, {auth.nama_lengkap} to Dashboard</div>
          <div className='text-[20px] text-blue-500'>Jenis Kelamin : {auth.jenis_kelamin}</div>
          <div className='text-[20px] text-green-800'>tanggal : , {auth.tanggal_lahir} to Dashboard</div>
          <div className='text-[20px] text-yellow-800'>alamat : , {auth.alamat} to Dashboard</div>
        </div>
      )}
    </Authenticated>
  )
}

export default Dashboard