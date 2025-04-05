
// Define all types for the application

export interface BusRoute {
  id: string;
  route: string;
  schedule: (string | { arrival: string; departure: string; })[];
  status: string;
  type: string;
}

export interface CampusActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
}

export interface FoodOutlet {
  id: string;
  name: string;
  description: string;
  location: string;
  hours: string;
  menu: MenuItem[];
}

export type MessDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MessMenuType {
  [key in MessDay]: {
    [key in MealType]: string[];
  };
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  dateAdded: string;
}
