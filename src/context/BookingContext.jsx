import { createContext, useContext, useMemo, useState } from "react";

const BookingContext = createContext(null);

const nowDateLabel = () => {
  const d = new Date();
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);

  const createBooking = ({ provider, form, consumer }) => {
    const bookingId = `b_${Date.now()}`;
    const booking = {
      id: bookingId,
      date: nowDateLabel(),
      service: provider.serviceType,
      provider: provider.name,
      providerId: provider.id,
      status: "Pending",
      consumerEmail: consumer?.email ?? form.email,
      consumerName: form.name,
      address: {
        street: form.street,
        houseNo: form.houseNo,
        pinCode: form.pinCode,
      },
      preferredDate: form.date,
      problem: form.problem,
    };

    const request = {
      id: `r_${Date.now()}`,
      bookingId,
      providerId: provider.id,
      providerName: provider.name,
      service: provider.serviceType,
      customerName: form.name,
      customerEmail: form.email,
      street: form.street,
      houseNo: form.houseNo,
      pinCode: form.pinCode,
      date: form.date,
      problem: form.problem,
      status: "New",
      createdAt: Date.now(),
    };

    setBookings((prev) => [booking, ...prev]);
    setRequests((prev) => [request, ...prev]);
    return booking;
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b)));
    setRequests((prev) => prev.filter((r) => r.bookingId !== bookingId));
  };

  const acceptRequest = (bookingId) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "Accepted" } : b)));
    setRequests((prev) => prev.map((r) => (r.bookingId === bookingId ? { ...r, status: "Accepted" } : r)));
  };

  const rejectRequest = (bookingId) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "Rejected" } : b)));
    setRequests((prev) => prev.map((r) => (r.bookingId === bookingId ? { ...r, status: "Rejected" } : r)));
  };

  const value = useMemo(
    () => ({ bookings, requests, createBooking, cancelBooking, acceptRequest, rejectRequest }),
    [bookings, requests]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  return useContext(BookingContext);
}

