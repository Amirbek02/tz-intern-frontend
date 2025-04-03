'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
import userStore from '@/store/userStore';
import { Button } from '../ui/button';
import { FormInput } from './form-input';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { InferType, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const EditUser: React.FC<Props> = ({ onClose }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { id } = useParams();
  const { editUser, user, getUserById } = userStore();
  const router = useRouter();

  const userSchema = object({
    name: string().required('Поле обязательно для заполнения'),
    email: string().email('Введите корректный email').required('Поле обязательно для заполнения'),
    password: string()
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .max(20, 'Пароль должен содержать максимум 20 символов')
      .required('Поле обязательно для заполнения'),
    age: string()
      .matches(/^[1-9][0-9]*$/, 'Введите корректный возраст')
      .required('Поле обязательно для заполнения'),
  });
  const form = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      age: '',
    },
  });

  React.useEffect(() => {
    if (id) {
      getUserById(Number(id)).then((user) => {
        if (user) {
          form.reset({
            name: user.name,
            email: user.email,
            password: '',
            age: user.age.toString(),
          });
        }
      });
    }
  }, [id, getUserById, form]);

  console.log('user', user);

  type FormData = InferType<typeof userSchema> & {
    name: string;
    email: string;
    age: string;
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log('data', data);

    try {
      await editUser(Number(id), {
        name: data.name,
        email: data.email,
        password: data.password,
        age: data.age,
      });

      toast.success('Пользователь успешно редактирован', {
        icon: '✅',
      });

      router.push('/admin');

      onClose?.();
    } catch {
      toast.error('Ошибка при редактирование пользователя', {
        icon: '❌',
      });
    }
  };

  const inputClass =
    'font-montserrat font-[400] placeholder-gray-300 w-[270px] mm:w-[356px] xl:w-[500px]  mb-[20px] text-[16px] leading-[20px]';

  return (
    <div className="flex justify-center items-center flex-col w-full h-auto ">
      <FormProvider {...form}>
        <h1 className="font-montserrat text-[rgb(85,87,87)] font-[500] text-[28px] xl:text-[32px] leading-[34px] xl:leading-[39px] pt-[82px] xl:pt-[76px]  pb-[40px]  ">
          Редактирование пользователя
        </h1>
        <form
          className="flex justify-center items-center flex-col relative"
          onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput className={` ${inputClass} `} name="name" placeholder="Аты" required />
          <FormInput className={inputClass} disabled placeholder="Email" name="email" required />
          <FormInput
            className={inputClass}
            name="password"
            placeholder="Пароль"
            type={showPassword ? 'text' : 'password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[198px] right-[25px] transform -translate-y-1/2 self-center text-[rgba(0,0,0,0.44)] w-[20px] h-[14px]">
            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
          <FormInput className={inputClass} name="age" placeholder="age" type="age" />
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
        <Link href={`/admin`}>
          <Button className="text-white mm:rounded-[5px] xl:rounded-[12px] h-[45px] mm:h-[56px] mm:w-[356px] xl:w-[500px] mb-[14px] xl:mb-[114px] bg-black xl:bg-black">
            Отмена
          </Button>
        </Link>
      </FormProvider>
    </div>
  );
};
