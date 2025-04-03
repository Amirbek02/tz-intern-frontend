import Link from 'next/link';
import React from 'react';

export const Product: React.FC = () => {
  return (
    <div className="max-w-[1200px] m-auto mt-16">
      <div className="mt-4 w-full  p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col justify-center items-center mb-4">
          <h1>Вы успешно авторизовались</h1>
          <h2>Скоро здесь будет наши товары</h2>
        </div>
        <Link className="block mt-5" href={`/`}>
          <button className="rounded-2xl py-1.5 px-3.5 bg-gray-900 text-white">Выход</button>
        </Link>
      </div>
    </div>
  );
};
