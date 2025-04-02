'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import userStore from '@/store/userStore';
import { Button } from '../ui/button';
import { FormInput } from './form-input';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const FormUser: React.FC<Props> = ({ onClose }) => {
  const { addUsers } = userStore();
  const router = useRouter();

  const userSchema = object({
    name: string().required('Поле обязательно для заполнения'),
    email: string().email('Введите корректный email').required('Поле обязательно для заполнения'),
    age: string()
      .matches(/^[1-9][0-9]*$/, 'Введите корректный возраст')
      .required('Поле обязательно для заполнения'),
  });

  const form = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: '',
    },
  });
  type FormData = InferType<typeof userSchema> & {
    name: string;
    email: string;
    age: string;
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log('data', data);

    try {
      await addUsers({
        name: data.name,
        email: data.email,
        age: data.age,
      });

      toast.success('Пользователь успешно добавлен', {
        icon: '✅',
      });
      router.push('/');
      onClose?.();
    } catch {
      toast.error('Ошибка при добавление пользователя', {
        icon: '❌',
      });
    }
  };
  const inputClass =
    'font-montserrat font-[400] placeholder-gray-300 w-[270px] mm:w-[356px] xl:w-[500px]  mb-[20px] text-[16px] leading-[20px]';

  console.log('form', form.formState.errors);

  return (
    <div className="flex justify-center items-center flex-col w-full h-auto ">
      <FormProvider {...form}>
        <h1 className="font-montserrat text-[rgb(85,87,87)] font-[500] text-[28px] xl:text-[32px] leading-[34px] xl:leading-[39px] pt-[82px] xl:pt-[76px]  pb-[40px]  ">
          Добавление пользователя
        </h1>
        <form
          className="flex justify-center items-center flex-col relative"
          onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput className={` ${inputClass} `} name="name" placeholder="Аты" required />
          <FormInput className={inputClass} placeholder="Электронная почта" name="email" required />

          <FormInput className={inputClass} name="age" placeholder="Возраст" type="age" />
          {form.formState.errors.name && (
            <p className="text-red-500 mb-5">{form.formState.errors.name.message}</p>
          )}
          {form.formState.errors.email && (
            <p className="text-red-500 mb-5">{form.formState.errors.email.message}</p>
          )}
          {form.formState.errors.age && (
            <p className="text-red-500 mb-5">{form.formState.errors.age.message}</p>
          )}

          <Button
            disabled={form.formState.isSubmitting}
            className="text-white mm:rounded-[5px] xl:rounded-[12px] h-[45px] mm:h-[56px] mm:w-[356px] xl:w-[500px] mb-[14px] bg-black xl:bg-black">
            Сохранить
          </Button>
        </form>
        <Link href={`/`}>
          <Button className="text-white mm:rounded-[5px] xl:rounded-[12px] h-[45px] mm:h-[56px] mm:w-[356px] xl:w-[500px] mb-[14px] xl:mb-[114px] bg-black xl:bg-black">
            Отмена
          </Button>
        </Link>
      </FormProvider>
    </div>
  );
};
