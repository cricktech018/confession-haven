import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Confession = {
  id: string;
  text: string;
  mood: string;
  tags: string[];
  nickname: string;
  created_at: string;
  like_count: number;
  report_count: number;
};

export type SortOption = 'latest' | 'most_liked' | 'trending';

export const useConfessions = (
  sortBy: SortOption = 'latest',
  moodFilter?: string,
  tagFilter?: string,
  searchQuery?: string
) => {
  return useQuery({
    queryKey: ['confessions', sortBy, moodFilter, tagFilter, searchQuery],
    queryFn: async () => {
      let query = supabase.from('confessions').select('*');

      if (moodFilter) {
        query = query.eq('mood', moodFilter as any);
      }

      if (tagFilter) {
        query = query.contains('tags', [tagFilter]);
      }

      if (searchQuery) {
        query = query.or(`text.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
      }

      switch (sortBy) {
        case 'most_liked':
          query = query.order('like_count', { ascending: false });
          break;
        case 'trending':
          query = query.order('like_count', { ascending: false }).order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data as Confession[];
    },
  });
};

export const useConfession = (id: string) => {
  return useQuery({
    queryKey: ['confession', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Confession | null;
    },
    enabled: !!id,
  });
};

export const useCreateConfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (confession: {
      text: string;
      mood: string;
      tags: string[];
      nickname: string;
    }) => {
      const { data, error } = await supabase
        .from('confessions')
        .insert([{ ...confession, mood: confession.mood as any }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      toast.success('Your confession has been shared anonymously');
    },
    onError: () => {
      toast.error('Failed to post confession. Please try again.');
    },
  });
};

export const useLikeConfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, increment }: { id: string; increment: boolean }) => {
      const { data: current } = await supabase
        .from('confessions')
        .select('like_count')
        .eq('id', id)
        .single();

      const newCount = (current?.like_count || 0) + (increment ? 1 : -1);

      const { error } = await supabase
        .from('confessions')
        .update({ like_count: Math.max(0, newCount) })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
};

export const useReportConfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: current } = await supabase
        .from('confessions')
        .select('report_count')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('confessions')
        .update({ report_count: (current?.report_count || 0) + 1 })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      toast.success('Report submitted. Thank you for keeping the community safe.');
    },
  });
};

export const useDeleteConfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('confessions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      toast.success('Confession deleted');
    },
  });
};

export const useMoodStats = () => {
  return useQuery({
    queryKey: ['mood-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('confessions')
        .select('mood, created_at');

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const todayStats: Record<string, number> = {};
      const weekStats: Record<string, number> = {};

      data?.forEach((confession) => {
        const createdAt = new Date(confession.created_at);
        const mood = confession.mood;

        if (createdAt >= today) {
          todayStats[mood] = (todayStats[mood] || 0) + 1;
        }

        if (createdAt >= weekAgo) {
          weekStats[mood] = (weekStats[mood] || 0) + 1;
        }
      });

      return { todayStats, weekStats, total: data?.length || 0 };
    },
  });
};
