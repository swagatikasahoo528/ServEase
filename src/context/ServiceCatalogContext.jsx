import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  providers as mockProviders,
  services as mockServices,
} from "../services/mockData";
import { useAuth } from "./AuthContext";
import {
  makeUserProviderListingId,
  parseUserProviderListingId,
} from "../utils/providerIds";

const STORAGE_PROVIDER_SERVICES = "servease_provider_services";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80";

const ServiceCatalogContext = createContext(null);

function slugify(name) {
  return (
    String(name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "service"
  );
}

function normalizeName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Map a provider-entered name to a built-in service id when names match, else custom-* */
export function resolveCatalogServiceId(serviceName) {
  const norm = normalizeName(serviceName);
  const mockHit = mockServices.find((s) => normalizeName(s.name) === norm);
  if (mockHit) return mockHit.id;
  return `custom-${slugify(serviceName)}`;
}

function readAllProviderServiceMaps() {
  try {
    const raw = localStorage.getItem(STORAGE_PROVIDER_SERVICES);
    if (!raw) return {};
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

function writeAllProviderServiceMaps(map) {
  localStorage.setItem(STORAGE_PROVIDER_SERVICES, JSON.stringify(map));
}

function defaultServicesForUserId(userId) {
  // No default provider services included by default.
  return [];
}

function enrichOffering(item) {
  const name = String(item.name ?? "").trim();
  const catalogServiceId =
    item.catalogServiceId || resolveCatalogServiceId(name);
  return { ...item, name, catalogServiceId };
}

function migrateMap(map) {
  const out = {};
  Object.keys(map).forEach((uid) => {
    out[uid] = (map[uid] || []).map(enrichOffering);
  });
  return out;
}

export function ServiceCatalogProvider({ children }) {
  const { users } = useAuth();
  const [providerOfferingsMap, setProviderOfferingsMap] = useState(() =>
    migrateMap(readAllProviderServiceMaps()),
  );

  const userIdsFingerprint = useMemo(
    () =>
      users
        .map((u) => u.id)
        .sort()
        .join("|"),
    [users],
  );

  useEffect(() => {
    setProviderOfferingsMap((prev) => {
      const disk = migrateMap(readAllProviderServiceMaps());
      const next = {};
      users.forEach((u) => {
        const id = u.id;
        if (Object.prototype.hasOwnProperty.call(prev, id)) next[id] = prev[id];
        else if (disk[id]) next[id] = disk[id];
      });
      const prevKeys = Object.keys(prev).sort().join("|");
      const nextKeys = Object.keys(next).sort().join("|");
      if (prevKeys === nextKeys) {
        if (nextKeys === "") return prev;
        const keys = Object.keys(next);
        if (keys.every((k) => prev[k] === next[k])) return prev;
      }
      return next;
    });
  }, [userIdsFingerprint, users]);

  useEffect(() => {
    writeAllProviderServiceMaps(providerOfferingsMap);
  }, [providerOfferingsMap]);

  const eligibleProviders = useMemo(
    () =>
      users.filter(
        (u) =>
          u.role === "provider" &&
          u.approvalStatus === "approved" &&
          (u.accountStatus ?? "active") === "active",
      ),
    [users],
  );

  const setOfferingsForUser = useCallback((userId, list) => {
    const enriched = list.map(enrichOffering);
    setProviderOfferingsMap((prev) => ({ ...prev, [userId]: enriched }));
  }, []);

  const getOfferingsForUser = useCallback(
    (userId) => {
      if (Object.prototype.hasOwnProperty.call(providerOfferingsMap, userId)) {
        return providerOfferingsMap[userId];
      }
      const diskMap = migrateMap(readAllProviderServiceMaps());
      if (Object.prototype.hasOwnProperty.call(diskMap, userId)) {
        return diskMap[userId];
      }
      return defaultServicesForUserId(userId);
    },
    [providerOfferingsMap],
  );

  const mergedBrowseServices = useMemo(() => {
    const byId = new Map();
    mockServices.forEach((s) => byId.set(s.id, { ...s }));

    eligibleProviders.forEach((u) => {
      const offers = getOfferingsForUser(u.id);
      offers.forEach((off) => {
        const id = off.catalogServiceId;
        if (!byId.has(id)) {
          byId.set(id, {
            id,
            name: off.name,
            description: `Book trusted professionals for ${off.name}.`,
            image: PLACEHOLDER_IMAGE,
          });
        }
      });
    });

    return Array.from(byId.values());
  }, [eligibleProviders, getOfferingsForUser, providerOfferingsMap]);

  const getProvidersForService = useCallback(
    (serviceId) => {
      const mockSvc = mockServices.find((s) => s.id === serviceId);
      const mockNameNorm = mockSvc ? normalizeName(mockSvc.name) : null;

      const fromMock = mockProviders.filter((p) => p.serviceId === serviceId);

      const fromUsers = [];
      eligibleProviders.forEach((u) => {
        const offers = getOfferingsForUser(u.id);
        offers.forEach((off) => {
          if (off.catalogServiceId === serviceId) {
            fromUsers.push({
              id: makeUserProviderListingId(u.id, off.catalogServiceId),
              userId: u.id,
              name: u.name,
              serviceId: off.catalogServiceId,
              serviceType: off.name,
              location: u.location?.trim() || "Service area — contact provider",
              rating: 4.6,
              price: off.price,
              reviews: ["Registered provider on ServEase."],
            });
          } else if (mockNameNorm && normalizeName(off.name) === mockNameNorm) {
            fromUsers.push({
              id: makeUserProviderListingId(u.id, mockSvc.id),
              userId: u.id,
              name: u.name,
              serviceId: mockSvc.id,
              serviceType: off.name,
              location: u.location?.trim() || "Service area — contact provider",
              rating: 4.6,
              price: off.price,
              reviews: ["Registered provider on ServEase."],
            });
          }
        });
      });

      // De-dupe user rows (same user could match twice if catalog id + name match)
      const seen = new Set();
      const dedupedUsers = fromUsers.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      return [...fromMock, ...dedupedUsers];
    },
    [eligibleProviders, getOfferingsForUser],
  );

  const resolveProviderByListingId = useCallback(
    (listingId) => {
      const parsed = parseUserProviderListingId(String(listingId));
      if (parsed) {
        const u = users.find((x) => x.id === parsed.userId);
        if (!u || u.role !== "provider") return null;
        const offers = getOfferingsForUser(u.id);
        const off = offers.find(
          (o) => o.catalogServiceId === parsed.catalogServiceId,
        );
        if (!off) return null;
        return {
          id: listingId,
          userId: u.id,
          name: u.name,
          serviceId: off.catalogServiceId,
          serviceType: off.name,
          location: u.location?.trim() || "Service area — contact provider",
          rating: 4.6,
          price: off.price,
          reviews: ["Registered provider on ServEase."],
        };
      }
      return mockProviders.find((p) => p.id === listingId) ?? null;
    },
    [users, getOfferingsForUser],
  );

  const value = useMemo(
    () => ({
      mergedBrowseServices,
      getProvidersForService,
      resolveProviderByListingId,
      setOfferingsForUser,
      getOfferingsForUser,
    }),
    [
      mergedBrowseServices,
      getProvidersForService,
      resolveProviderByListingId,
      setOfferingsForUser,
      getOfferingsForUser,
    ],
  );

  return (
    <ServiceCatalogContext.Provider value={value}>
      {children}
    </ServiceCatalogContext.Provider>
  );
}

export function useServiceCatalog() {
  const ctx = useContext(ServiceCatalogContext);
  if (!ctx)
    throw new Error(
      "useServiceCatalog must be used within ServiceCatalogProvider",
    );
  return ctx;
}
