import axios from 'axios';
import { create } from 'zustand';

export type Users = {
  name: string;
  email: string;
  password: string;
  age: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export interface GetUser {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  error: string | null;
}

export interface GetUserById {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
  error: string | null;
}
export interface User {
  users: GetUser[];
  user: GetUser;
  loading?: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  addUsers: (formData: Users) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  editUser: (id: number, formData: Users) => Promise<void>;
  getUserById: (id: number) => Promise<GetUser | undefined>;
  login: (formData: UserLogin) => Promise<GetUserById | undefined>;
  logins: GetUserById;
}

const userStore = create<User>((set) => ({
  users: [],
  user: {} as GetUser,
  logins: {} as GetUserById,
  loading: false,
  error: null,
  getUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`);
      set({ users: response.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  addUsers: async (formData: Users) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/create`, formData);
    } catch (error) {
      set({
        loading: false,
        error:
          axios.isAxiosError(error) && error.response
            ? error.response.data.message
            : 'Unknown error',
      });
    }
  },
  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  editUser: async (id: number, formData: Users) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`, formData);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...formData, age: Number(formData.age) } : user,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  getUserById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`);
      set({ user: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  login: async (formData: UserLogin) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        formData,
      );

      if (data.error) {
        set((state) => ({
          logins: { ...state.logins, error: data.error },
        }));
      } else {
        localStorage.setItem('token', data.token);
        set((state) => ({
          logins: { ...state.logins, role: data.role, email: data.email, error: null },
        }));
      }
      console.log(data, 'asdf');

      set({ logins: data ?? {}, loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
}));

export default userStore;
