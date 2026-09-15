import { useState, useEffect } from "react";
import { QuoteLead } from "../types";
import { INITIAL_LEADS } from "../data";

export function useLeads() {
  const [leads, setLeads] = useState<QuoteLead[]>([]);

  useEffect(() => {
    const savedLeads = localStorage.getItem("mudanzas_leads");
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch {
        setLeads(INITIAL_LEADS);
      }
    } else {
      setLeads(INITIAL_LEADS);
    }
  }, []);

  const saveLeads = (updatedLeads: QuoteLead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("mudanzas_leads", JSON.stringify(updatedLeads));
  };

  const handleNewLeadCreated = async (newLead: QuoteLead) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newLead),
    });

    if (!response.ok) {
      let message = "No pudimos guardar la solicitud.";
      try {
        const payload = (await response.json()) as { error?: string };
        if (payload.error) message = payload.error;
      } catch {
        // Keep the user-facing fallback message.
      }
      throw new Error(message);
    }

    setLeads((current) => {
      const updated = [newLead, ...current.filter((lead) => lead.id !== newLead.id)];
      localStorage.setItem("mudanzas_leads", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateLeadStatus = (
    leadId: string,
    newStatus: QuoteLead["status"],
  ) => {
    const updated = leads.map((lead) =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead,
    );
    saveLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = leads.filter((lead) => lead.id !== leadId);
    saveLeads(updated);
  };

  return {
    leads,
    handleNewLeadCreated,
    handleUpdateLeadStatus,
    handleDeleteLead,
  };
}
