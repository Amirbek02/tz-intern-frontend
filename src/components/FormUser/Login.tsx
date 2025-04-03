'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import userStore from '@/store/userStore';
import { Button } from '../ui/button';
import { FormInput } from './form-input';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const Login: React.FC<Props> = ({ onClose }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { logins, login } = userStore();
  const router = useRouter();

  const userSchema = object({
    email: string().email('Введите корректный email').required('Поле обязательно для заполнения'),
    password: string().required('Поле обязательно для заполнения'),
  });

  const form = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  type FormData = InferType<typeof userSchema> & {
    email: string;
    password: string;
  };

  console.log(logins);

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        toast.error(response.error, { icon: '❌' });
        console.log('response', response?.error);
      }

      toast.success('Пользователь успешно добавлен', {
        icon: '✅',
      });
      console.log('role', response?.role);

      if (response?.role === 'USER') {
        router.push('/product');
      } else if (logins.role === 'ADMIN') {
        router.push('/admin');
      }

      onClose?.();
    } catch {
      toast.error('Ошибка при добавление пользователя', {
        icon: '❌',
      });

      throw new Error('Ошибка при добавление пользователя');
    }
  };
  const inputClass =
    'font-montserrat font-[400] placeholder-gray-300 w-[270px] mm:w-[356px] xl:w-[500px]  mb-[20px] text-[16px] leading-[20px]';

  return (
    <div className="flex justify-center items-center flex-col w-full h-auto ">
      <FormProvider {...form}>
        <h1 className="font-montserrat text-[rgb(85,87,87)] font-[500] text-[28px] xl:text-[32px] leading-[34px] xl:leading-[39px] pt-[82px] xl:pt-[76px]  pb-[40px]  ">
          Авторизация
        </h1>
        <form
          className="flex justify-center items-center flex-col relative"
          onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput className={inputClass} placeholder="Электронная почта" name="email" required />
          <FormInput
            className={inputClass}
            name="password"
            placeholder="Пароль"
            type={showPassword ? 'text' : 'password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[110px] right-[25px] transform -translate-y-1/2 self-center text-[rgba(0,0,0,0.44)] w-[20px] h-[14px]">
            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
          {form.formState.errors.password && (
            <p className="text-red-500 mb-5">{form.formState.errors.password.message}</p>
          )}
          {form.formState.errors.email && (
            <p className="text-red-500 mb-5">{form.formState.errors.email.message}</p>
          )}
          {logins.error && <p className="text-red-500 mb-5">{logins.error}</p>}

          <Button
            disabled={form.formState.isSubmitting}
            className="text-white mm:rounded-[5px] xl:rounded-[12px] h-[45px] mm:h-[56px] mm:w-[356px] xl:w-[500px] mb-[14px] bg-black xl:bg-black">
            Войти
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
