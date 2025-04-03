'use client';
import userStore from '@/store/userStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

export const ShowUser: React.FC = () => {
  const { id } = useParams();

  const { user, getUserById } = userStore();

  React.useEffect(() => {
    if (id) {
      getUserById(Number(id));
    }
  }, []);

  console.log('user', user);

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 ">Информация о пользователе</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div>
          <p className="text-gray-800 font-semibold">
            <b>Имя: </b> {user.name}
          </p>
          <p className="text-gray-800 font-semibold">
            <b>Электронная почта: </b>
            {user.email}
          </p>
          <p className="text-gray-800 font-semibold">
            <b>Возраст: </b> {user.age}
          </p>
        </div>
        <Link className="block mt-5" href={`/admin`}>
          <button className="rounded-2xl py-1.5 px-3.5 bg-gray-900 text-white">Назад</button>
        </Link>
      </div>
    </div>
  );
};
