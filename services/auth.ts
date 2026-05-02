import type { User } from "@/types/domain";

const mockUser: User = {
  id: "mock-user-1",
  name: "Derma User",
  email: "hello@dermascan.app"
};

export const signIn = async (email: string, _password: string): Promise<User> => ({
  ...mockUser,
  email
});

export const signUp = async (name: string, email: string, _password: string): Promise<User> => ({
  ...mockUser,
  name,
  email
});

export const signOut = async (): Promise<void> => undefined;

export const getCurrentUser = async (): Promise<User> => mockUser;
