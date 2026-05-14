import { createContext, useContext, useEffect, useMemo, useState } from "react";

const BookingContext = createContext(null);

const STORAGE_BOOKINGS = "servease_bookings";
const STORAGE_REQUESTS = "servease_requests";
const STORAGE_PROVIDER_NOTIFICATIONS = "servease_provider_notifications";

function readJsonArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readProviderNotifications() {
  return readJsonArray(STORAGE_PROVIDER_NOTIFICATIONS).map((n) => ({
    ...n,
    read: n.read === true,
  }));
}

const nowDateLabel = () => {
  const d = new Date();
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => readJsonArray(STORAGE_BOOKINGS));
  const [requests, setRequests] = useState(() => readJsonArray(STORAGE_REQUESTS));
  const [providerNotifications, setProviderNotifications] = useState(readProviderNotifications);

  useEffect(() => {
    localStorage.setItem(STORAGE_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PROVIDER_NOTIFICATIONS, JSON.stringify(providerNotifications));
  }, [providerNotifications]);

  const createBooking = ({ provider, form, consumer }) => {
    const bookingId = `b_${Date.now()}`;
    const providerAccountId = provider.userId ?? null;

    const booking = {
      id: bookingId,
      date: nowDateLabel(),
      service: provider.serviceType,
      provider: provider.name,
      providerId: provider.id,
      providerAccountId,
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
      providerAccountId,
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

    if (providerAccountId) {
      const note = {
        id: `n_${Date.now()}`,
        providerAccountId,
        bookingId,
        message: "New booking received",
        read: false,
        createdAt: Date.now(),
      };
      setProviderNotifications((prev) => [note, ...prev]);
    }

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

  const markNotificationsReadForProvider = (providerAccountId) => {
    setProviderNotifications((prev) =>
      prev.map((n) => (n.providerAccountId === providerAccountId ? { ...n, read: true } : n))
    );
  };

  const value = useMemo(
    () => ({
      bookings,
      requests,
      providerNotifications,
      createBooking,
      cancelBooking,
      acceptRequest,
      rejectRequest,
      markNotificationsReadForProvider,
    }),
    [bookings, requests, providerNotifications]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  return useContext(BookingContext);
}
