import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Check, Info, Settings, Search, Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelectAddress: (
    address: string,
    departmentId: string,
    lat?: number,
    lng?: number,
  ) => void;
  placeholder: string;
  label: string;
  brandId: string;
  error?: string;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as { env: Record<string, string> }).env
    ?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as { GOOGLE_MAPS_PLATFORM_KEY?: string })
    .GOOGLE_MAPS_PLATFORM_KEY ||
  "";

// Define a more specific type for the google object on the window
interface CustomWindow extends Window {
  google?: typeof google;
}
declare const window: CustomWindow;

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

// Elegant local suggestions for Mendoza & CABA to act as an offline/development fallback
const FALLBACK_SUGGESTIONS: Record<
  string,
  { address: string; deptId: string; lat: number; lng: number }[]
> = {
  mendoza: [
    {
      address: "Av. San Martín 1200, Mendoza Capital, Mendoza",
      deptId: "capital",
      lat: -32.8894,
      lng: -68.8446,
    },
    {
      address: "Arístides Villanueva 350, Mendoza Capital, Mendoza",
      deptId: "capital",
      lat: -32.8902,
      lng: -68.8523,
    },
    {
      address: "Av. Belgrano 980, Mendoza Capital, Mendoza",
      deptId: "capital",
      lat: -32.8885,
      lng: -68.8491,
    },
    {
      address: "Av. San Martín 1500, Godoy Cruz, Mendoza",
      deptId: "godoy_cruz",
      lat: -32.9254,
      lng: -68.8431,
    },
    {
      address: "Panamericana 2501, Godoy Cruz, Mendoza",
      deptId: "godoy_cruz",
      lat: -32.9542,
      lng: -68.8681,
    },
    {
      address: "Mitre 450, Chacras de Coria, Luján de Cuyo, Mendoza",
      deptId: "lujan_de_cuyo",
      lat: -32.9812,
      lng: -68.8741,
    },
    {
      address: "Guardia Vieja 1200, Vistalba, Luján de Cuyo, Mendoza",
      deptId: "lujan_de_cuyo",
      lat: -33.0034,
      lng: -68.8952,
    },
    {
      address: "Av. Bandera de los Andes 3500, Guaymallén, Mendoza",
      deptId: "guaymallen",
      lat: -32.8984,
      lng: -68.8052,
    },
    {
      address: "Adolfo Calle 1250, Dorrego, Guaymallén, Mendoza",
      deptId: "guaymallen",
      lat: -32.9102,
      lng: -68.8234,
    },
    {
      address: "Sarmiento 1050, Maipú Centro, Maipú, Mendoza",
      deptId: "maipu",
      lat: -32.9785,
      lng: -68.7845,
    },
    {
      address: "Av. Boulogne Sur Mer 2500, Las Heras, Mendoza",
      deptId: "las_heras",
      lat: -32.8643,
      lng: -68.8485,
    },
    {
      address: "Av. Mitre 500, San Rafael, Mendoza",
      deptId: "san_rafael",
      lat: -34.6177,
      lng: -68.3301,
    },
  ],
  miranda: [
    {
      address: "Av. Cabildo 2200, Belgrano, CABA",
      deptId: "capital",
      lat: -34.5612,
      lng: -58.4556,
    },
    {
      address: "Av. Santa Fe 3200, Palermo, CABA",
      deptId: "capital",
      lat: -34.5823,
      lng: -58.4112,
    },
    {
      address: "Av. de Mayo 850, Monserrat, CABA",
      deptId: "capital",
      lat: -34.6087,
      lng: -58.3802,
    },
    {
      address: "Av. Corrientes 1500, San Nicolás, CABA",
      deptId: "capital",
      lat: -34.6038,
      lng: -58.3889,
    },
    {
      address: "Av. del Libertador 2500, Recoleta, CABA",
      deptId: "capital",
      lat: -34.5801,
      lng: -58.4011,
    },
    {
      address: "Av. Rivadavia 5000, Caballito, CABA",
      deptId: "capital",
      lat: -34.6189,
      lng: -58.4356,
    },
    {
      address: "Av. Juramento 1800, Belgrano, CABA",
      deptId: "capital",
      lat: -34.5582,
      lng: -58.4485,
    },
    {
      address: "Av. San Martín 2000, Villa Crespo, CABA",
      deptId: "capital",
      lat: -34.6012,
      lng: -58.4512,
    },
    {
      address: "Av. Montes de Oca 800, Barracas, CABA",
      deptId: "capital",
      lat: -34.6302,
      lng: -58.3741,
    },
    {
      address: "Av. Las Heras 2200, Recoleta, CABA",
      deptId: "capital",
      lat: -34.5867,
      lng: -58.3976,
    },
  ],
};

// General fallback merging all address sources
const NATIONAL_FALLBACK = [
  ...FALLBACK_SUGGESTIONS.mendoza,
  ...FALLBACK_SUGGESTIONS.miranda,
];

export default function AddressAutocomplete({
  value,
  onChange,
  onSelectAddress,
  placeholder,
  label,
  brandId,
  error,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<
    {
      description: string;
      placeId?: string;
      mock?: boolean;
      deptId?: string;
      lat?: number;
      lng?: number;
    }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null,
  );

  // Dynamic branding classes
  const brandColors = {
    mendoza: {
      ring: "focus:ring-amber-500 focus:border-amber-500",
      badge: "bg-amber-50 text-amber-700 border-amber-100",
      highlight: "hover:bg-amber-50 text-amber-900",
      dot: "bg-amber-500",
    },
    miranda: {
      ring: "focus:ring-sky-600 focus:border-sky-600",
      badge: "bg-sky-50 text-sky-700 border-sky-100",
      highlight: "hover:bg-sky-50 text-sky-900",
      dot: "bg-sky-500",
    },
    empresas: {
      ring: "focus:ring-emerald-600 focus:border-emerald-600",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      highlight: "hover:bg-emerald-50 text-emerald-900",
      dot: "bg-emerald-500",
    },
  }[brandId] || {
    ring: "focus:ring-amber-500 focus:border-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    highlight: "hover:bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically load Google Maps script if valid key exists
  useEffect(() => {
    if (!hasValidKey) return;

    const loadScript = () => {
      if (window.google?.maps?.places) {
        initServices();
        return;
      }

      // Check if already in process of loading
      const existingScript = document.getElementById("google-maps-api-script");
      if (existingScript) {
        existingScript.addEventListener("load", initServices);
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-api-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initServices;
      document.head.appendChild(script);
    };

    const initServices = () => {
      try {
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current =
            new window.google.maps.places.AutocompleteService();
          // PlacesService requires a DOM element as anchor
          const dummyDiv = document.createElement("div");
          placesServiceRef.current =
            new window.google.maps.places.PlacesService(dummyDiv);
          setIsSdkLoaded(true);
        }
      } catch (err) {
        console.error("Error initializing Google Maps Services:", err);
      }
    };

    loadScript();
  }, [hasValidKey]);

  const performLocalFallback = useCallback(
    (text: string) => {
      const query = text.toLowerCase();
      const source =
        brandId === "mendoza"
          ? FALLBACK_SUGGESTIONS.mendoza
          : brandId === "miranda"
            ? FALLBACK_SUGGESTIONS.miranda
            : NATIONAL_FALLBACK;

      const filtered = source
        .filter((item) => item.address.toLowerCase().includes(query))
        .map((item) => ({
          description: item.address,
          mock: true,
          deptId: item.deptId,
          lat: item.lat,
          lng: item.lng,
        }));

      // If query didn't match our narrow preset, offer generalized mock options based on query
      if (filtered.length === 0) {
        const suffix =
          brandId === "mendoza"
            ? ", Mendoza, Argentina"
            : ", CABA, Buenos Aires, Argentina";
        const guessedDept = detectDepartmentId(text, brandId);
        filtered.push({
          description: `${text}${suffix}`,
          mock: true,
          deptId: guessedDept,
          lat: brandId === "mendoza" ? -32.8894 : -34.5612,
          lng: brandId === "mendoza" ? -68.8446 : -58.4556,
        });
      }

      setSuggestions(filtered);
    },
    [brandId],
  );

  // Handle Input Changes & fetch autocomplete predictions
  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      if (isSdkLoaded && autocompleteServiceRef.current) {
        // Build location restrictions/biases based on brand
        const bounds =
          brandId === "mendoza"
            ? { north: -32.5, south: -33.5, east: -68.0, west: -69.2 } // Mendoza area
            : brandId === "miranda"
              ? { north: -34.3, south: -34.9, east: -58.1, west: -58.9 } // Buenos Aires CABA area
              : undefined;

        const request: google.maps.places.AutocompletionRequest = {
          input: value,
          componentRestrictions: { country: "AR" },
          types: ["address", "geocode", "establishment"],
        };

        if (bounds) {
          // Use search bias to prioritize relevant local brand boundaries
          request.locationBias = new window.google.maps.LatLngBounds(
            { lat: bounds.south, lng: bounds.west },
            { lat: bounds.north, lng: bounds.east },
          );
        }

        autocompleteServiceRef.current.getPlacePredictions(
          request,
          (predictions, status) => {
            setIsLoading(false);
            if (
              status === window.google?.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              setSuggestions(
                predictions.map((p) => ({
                  description: p.description,
                  placeId: p.place_id,
                })),
              );
            } else {
              // Try local lookup if no Google API results
              performLocalFallback(value);
            }
          },
        );
      } else {
        // Key is missing or script not loaded, run full local fuzzy match
        setIsLoading(false);
        performLocalFallback(value);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [value, isSdkLoaded, brandId, performLocalFallback, hasValidKey]);

  // Maps geocoded text to specific DB department items
  const detectDepartmentId = (address: string, brand: string): string => {
    const lowercase = address.toLowerCase();

    if (brand === "miranda") {
      // For CABA, default to 'capital' as it represents urban/city center multiplier (1.0)
      return "capital";
    }

    // Mendoza departments mapping
    if (lowercase.includes("godoy cruz") || lowercase.includes("godoycruz"))
      return "godoy_cruz";
    if (
      lowercase.includes("luján") ||
      lowercase.includes("lujan") ||
      lowercase.includes("chacras") ||
      lowercase.includes("vistalba") ||
      lowercase.includes("carrodilla")
    )
      return "lujan_de_cuyo";
    if (
      lowercase.includes("guaymallén") ||
      lowercase.includes("guaymallen") ||
      lowercase.includes("dorrego") ||
      lowercase.includes("villa nueva")
    )
      return "guaymallen";
    if (
      lowercase.includes("maipú") ||
      lowercase.includes("maipu") ||
      lowercase.includes("luzuriaga")
    )
      return "maipu";
    if (
      lowercase.includes("las heras") ||
      lowercase.includes("lasheras") ||
      lowercase.includes("challao")
    )
      return "las_heras";
    if (lowercase.includes("san rafael") || lowercase.includes("sanrafael"))
      return "san_rafael";
    if (lowercase.includes("alvear")) return "general_alvear";
    if (lowercase.includes("malargüe") || lowercase.includes("malargue"))
      return "malargue";
    if (lowercase.includes("tunuyán") || lowercase.includes("tunuyan"))
      return "tunuyan";
    if (lowercase.includes("tupungato")) return "tupungato";
    if (lowercase.includes("san carlos") || lowercase.includes("sancarlos"))
      return "san_carlos";

    return "capital"; // Default to central Capital
  };

  const handleSelect = (item: (typeof suggestions)[0]) => {
    onChange(item.description);
    setIsOpen(false);

    if (item.mock && item.deptId) {
      // Fallback selection triggers immediate calculation with detected coordinates
      onSelectAddress(item.description, item.deptId, item.lat, item.lng);
    } else if (item.placeId && placesServiceRef.current) {
      // Real Google Place Details Retrieval
      placesServiceRef.current.getDetails(
        {
          placeId: item.placeId,
          fields: ["formatted_address", "address_components", "geometry"],
        },
        (place, status) => {
          if (
            status === window.google?.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            const formattedAddress =
              place.formatted_address || item.description;
            const detectedDept = detectDepartmentId(formattedAddress, brandId);
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            onSelectAddress(formattedAddress, detectedDept, lat, lng);
          } else {
            // Error fallback
            const detectedDept = detectDepartmentId(item.description, brandId);
            onSelectAddress(item.description, detectedDept);
          }
        },
      );
    } else {
      const detectedDept = detectDepartmentId(item.description, brandId);
      onSelectAddress(item.description, detectedDept);
    }
  };

  return (
    <div ref={containerRef} className="space-y-1.5 relative w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-extrabold text-gray-700 block uppercase tracking-wide">
          {label}
        </label>

        {/* Clean status badge indicating real Google Maps vs smart simulator */}
        {isSdkLoaded ? (
          <span
            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-100`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Google Maps Activo
          </span>
        ) : (
          <span
            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${brandColors.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${brandColors.dot}`} />{" "}
            Simulador Inteligente
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-4 w-4 text-gray-400" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-white border ${
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-gray-200 " + brandColors.ring
          } rounded-xl pl-9 pr-10 py-3 text-sm focus:outline-none focus:ring-2 text-gray-800 font-semibold transition-all duration-150`}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-300" />
          )}
        </div>
      </div>

      {error && (
        <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
          <Info className="w-3 h-3 text-red-500" /> {error}
        </p>
      )}

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto animate-fade-in divide-y divide-gray-50">
          {suggestions.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-3 text-xs flex items-center gap-2.5 transition font-semibold cursor-pointer ${brandColors.highlight}`}
            >
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-gray-800">{item.description}</p>
                {item.mock && (
                  <p className="text-[9px] text-gray-400 font-medium">
                    Autocompletado sugerido para{" "}
                    {brandId === "mendoza" ? "Mendoza" : "CABA"}
                  </p>
                )}
              </div>
              <Check className="w-3.5 h-3.5 text-transparent hover:text-gray-400" />
            </button>
          ))}

          {/* Prompt instruction if Google Maps secret is not yet set up */}
          {!isSdkLoaded && (
            <div className="bg-slate-50 p-3 text-[10px] text-gray-500 font-medium space-y-1.5">
              <div className="flex gap-1.5 text-gray-600 font-bold">
                <Settings className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>¿Quieres conectar con Google Maps Real?</span>
              </div>
              <p className="leading-relaxed">
                Obtén resultados de todo el país y cálculos exactos de ruta
                agregando tu clave en la sección de secretos.
              </p>
              <div className="bg-white border border-gray-100 rounded-lg p-2 font-mono text-[9px] text-gray-600">
                GOOGLE_MAPS_PLATFORM_KEY = &quot;tu_clave_api&quot;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
