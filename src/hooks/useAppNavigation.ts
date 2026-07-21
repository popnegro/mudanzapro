import { useState } from "react";
import { getPageFromPath } from "../routes";

/**
 * Custom hook to manage the application's navigation state.
 * Encapsulates page state, geographic zone selection, and view mode logic.
 */
export function useAppNavigation() {
  // Determines the initial page based on the URL path, falling back to 'inicio'.
  const [activePage, setActivePage] = useState<string>(() =>
    getPageFromPath(window.location.pathname),
  );

  // State for the selected geographic zone, used to filter directory results.
  const [selectedGeographicZone, setSelectedGeographicZone] =
    useState<string>("Gran Mendoza");

  // State to toggle between the user-facing view and the internal lead management dashboard.
  const [viewMode, setViewMode] = useState<"user" | "dashboard">("user");

  return {
    activePage,
    setActivePage,
    selectedGeographicZone,
    setSelectedGeographicZone,
    viewMode,
    setViewMode,
  };
}
