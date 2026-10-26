// Who is using the app. Matches the roles in the backend plan.
export type UserRole = "customer" | "rider" | "restaurant_staff" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
};

// What the Login form sends
export type LoginRequest = {
  email: string;
  password: string;
};

// What the Register form sends
export type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

// What the server sends back after a successful login or register
export type AuthResponse = {
  user: User;
  token: string;
};