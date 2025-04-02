'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import userStore, { GetUser } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';

export function TableDemo({ users }: { users: GetUser[] }) {
  const { deleteUser } = userStore();
  const handleDelete = async (id: number) => {
    await deleteUser(id);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">№</TableHead>
          <TableHead>Имя</TableHead>
          <TableHead>Электронная почта</TableHead>
          <TableHead>Возраст</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users?.map((invoice, idx) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>
                <Link href={`/user/${invoice.id}`}>{invoice.name}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/user/${invoice.id}`}>{invoice.email}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/user/${invoice.id}`}>{invoice.age}</Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2 h-10 mr-4">
                  <Image
                    onClick={() => handleDelete(invoice.id)}
                    className="mr-4"
                    src="deleteIcon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href={`/edit/${invoice.id}`}>
                    <Image src="editIcon.svg" alt="" width={20} height={20} />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="h-20">
            <TableCell colSpan={5} className="text-center">
              Нет данных
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
