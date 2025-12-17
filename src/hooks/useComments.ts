import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Comment = {
  id: string;
  confession_id: string;
  text: string;
  created_at: string;
};

export const useComments = (confessionId: string) => {
  return useQuery({
    queryKey: ['comments', confessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('confession_id', confessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!confessionId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: { confession_id: string; text: string }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([comment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.confession_id] });
      toast.success('Comment added');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, confessionId }: { id: string; confessionId: string }) => {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
      return confessionId;
    },
    onSuccess: (confessionId) => {
      queryClient.invalidateQueries({ queryKey: ['comments', confessionId] });
      toast.success('Comment deleted');
    },
  });
};
