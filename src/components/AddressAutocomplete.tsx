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

const viteEnv = (import.meta as unknown as { env?: Record<string, string> }).env;

const API_KEY =
  (typeof process !== "undefined" ? process.env.GOOGLE_MAPS_PLATFORM_KEY : undefined) ||
  viteEnv?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as { GOOGLE_MAPS_PLATFORM_KEY?: string }).GOOGLE_MAPS_PLATFORM_KEY ||
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
  ],
  caba: [
    {
      address: "Av. Cabildo 2200, Belgrano, CABA",
      deptId: "caba",
      lat: -34.559,
      lng: -58.456,
    },
  ],
};

// ... rest of component remains unchanged
