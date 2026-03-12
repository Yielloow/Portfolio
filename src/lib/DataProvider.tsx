import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { fetchProfile } from "@/lib/profile";
import { fetchProjects } from "@/lib/projects";
import { fetchTimeline } from "@/lib/timeline";
import { fetchTestimonials } from "@/lib/testimonials";
import { fetchSkillHours } from "@/lib/skillHours";
import { fetchPartners } from "@/lib/partners";

interface DataContextValue {
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue>({ loading: true, refresh: async () => {} });

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchProfile(),
      fetchProjects(),
      fetchTimeline(),
      fetchTestimonials(),
      fetchSkillHours(),
      fetchPartners(),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DataContext.Provider value={{ loading, refresh }}>
      {loading ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
}
