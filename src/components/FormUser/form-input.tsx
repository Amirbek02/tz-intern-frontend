'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const FormInput: React.FC<Props> = ({ className, name, label, ...props }) => {
  const { register } = useFormContext();

  return (
    <div className={className}>
      {label && <p className="font-medium mb-2">{label}</p>}

      <div className="relative">
        <Input
          className=" py-[19px] pl-[15px]  mb-[20px] rounded-[4px] xl:rounded-[12px] h-12 text-md"
          {...register(name)}
          {...props}
        />
      </div>
    </div>
  );
};
