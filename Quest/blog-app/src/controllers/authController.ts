import { loginUser, logoutUser, registerUser } from "../models/authModel";

export const handleRegister = async (email: string, password: string) => {
  try {
    const result = await registerUser(email, password);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const result = await loginUser(email, password);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const handleLogout = async () => {
  try {
    await logoutUser();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};