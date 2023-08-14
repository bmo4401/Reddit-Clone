'use client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { Button } from './ui/button';
interface SubscribeLeaveToggleProps {
   subredditId: string;
   subredditName: string;
   isSubscribed: boolean;
}
const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
   subredditId,
   subredditName,
   isSubscribed = false,
}) => {
   const router = useRouter();
   const { loginToast } = useCustomToast();
   const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
      mutationFn: async () => {
         const payload: SubscribeToSubredditPayload = {
            subredditId,
         };

         const { data } = await axios.post('/api/subreddit/subscribe', payload);
         return data as string;
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
               return loginToast();
            }
         }
         return toast({
            title: 'There was a problem',
            description: 'Something went wrong, please try again.',
            variant: 'destructive',
         });
      },
      onSuccess: () => {
         startTransition(() => {
            router.refresh();
         });
         toast({
            title: 'Subscribed',
            description: `You are now subscribed to r/${subredditName}`,
         });
      },
   });

   const { mutate: Unsubscribe, isLoading: isUnSubLoading } = useMutation({
      mutationFn: async () => {
         const payload: SubscribeToSubredditPayload = {
            subredditId,
         };

         const { data } = await axios.post(
            '/api/subreddit/unsubscribe',
            payload,
         );
         return data as string;
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
               return loginToast();
            }
         }
         return toast({
            title: 'There was a problem',
            description: 'Something went wrong, please try again.',
            variant: 'destructive',
         });
      },
      onSuccess: () => {
         startTransition(() => {
            router.refresh();
         });
         toast({
            title: 'Unsubscribed',
            description: `You are now unsubscribed to r/${subredditName}`,
         });
      },
   });
   return isSubscribed ? (
      <Button
         className="w-full mt-1 mb-4"
         isLoading={isUnSubLoading}
         onClick={() => Unsubscribe()}
      >
         Leave community
      </Button>
   ) : (
      <Button
         isLoading={isSubLoading}
         onClick={() => subscribe()}
         className="w-full mt-1 mb-4"
      >
         Join to post
      </Button>
   );
};
export default SubscribeLeaveToggle;
