import { useState, useEffect } from "react";
import { QuoteLead } from "../types";
import { INITIAL_LEADS } from "../data";

export function useLeads() {
  const [leads, setLeads] = useState<QuoteLead[]>([]);

  // Load leads from localStorage on initial render, or fallback to INITIAL_LEADS
  useEffect(() => {
    const savedLeads = localStorage.getItem("mudanzas_leads");
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        setLeads(INITIAL_LEADS);
      }
    } else {
      setLeads(INITIAL_LEADS);
    }
  }, []);

  // Save leads to localStorage and update state
  const saveLeads = (updatedLeads: QuoteLead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("mudanzas_leads", JSON.stringify(updatedLeads));
  };

  const handleNewLeadCreated = (newLead: QuoteLead) => {
    const updated = [newLead, ...leads];
    saveLeads(updated);
  };

  const handleUpdateLeadStatus = (
    leadId: string,
    newStatus: QuoteLead["status"],
  ) => {
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, status: newStatus } : l,
    );
    saveLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = leads.filter((l) => l.id !== leadId);
    saveLeads(updated);
  };

  return {
    leads,
    handleNewLeadCreated,
    handleUpdateLeadStatus,
    handleDeleteLead,
  };
}
