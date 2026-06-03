export interface Tour {
  id: number;
  name: string;
  category: string;
  badge: string;
  badgeClass: string;
  price: number;
  rating: number;
  reviews: number;
  tag: string;
  image: string;
  desc: string;
  duration: string;
  difficulty: string;
  included: string[];
  itinerary?: { time: string; title: string; desc: string; }[];
  photos?: string[];
}

export interface Reservation {
  id: number;
  ticketCode: string;
  createdAt: string;
  tourId: number;
  tourName: string;
  tourImage: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: string;
  status: string;
  hotelName?: string;
  roomNumber?: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
