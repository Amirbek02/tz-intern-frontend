'use client';
import userStore from '@/store/userStore';
import React from 'react';
import { TableDemo } from '../Table/UserTable';
import Link from 'next/link';

export const UserList: React.FC = () => {
  const { users, getUsers } = userStore();
  console.log('user', users);

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="mt-4 w-full  p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 ">Список пользователей </h1>
        <Link href={`/create`}>
          <button className="rounded-2xl py-1.5 px-3.5 bg-gray-900 text-white">Добавить</button>
        </Link>
      </div>
      <TableDemo users={users} />
      <Link className="block mt-5" href={`/`}>
        <button className="rounded-2xl py-1.5 px-3.5 bg-gray-900 text-white">Выход</button>
      </Link>
    </div>
  );
};
