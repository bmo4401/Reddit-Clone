'use client';
import { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
interface CreateCommentProps {
   postId: string;
   replyToId?: string;
}
const CreateComment: React.FC<CreateCommentProps> = ({ postId, replyToId }) => {
   const router = useRouter();
   const { loginToast } = useCustomToast();
   const [input, setInput] = useState<string>('');

   const { mutate: comment, isLoading } = useMutation({
      mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
         const payload: CommentRequest = {
            postId,
            text,
            replyToId,
         };
         const { data } = await axios.patch(
            '/api/subreddit/post/comment',
            payload,
         );
         return data;
      },
      onError: (err: any) => {
         console.log('❄️ ~ file: CreateComment.tsx:35 ~ err:', err);
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
         router.refresh();
         setInput('');
      },
   });
   return (
      <div className="grid w-full gap-1.5">
         <Label htmlFor="comment">Your comment</Label>
         <div className="mt-2">
            <Textarea
               id="comment"
               value={input}
               onChange={(e) => setInput(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
               <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() => comment({ postId, text: input, replyToId })}
               >
                  Post
               </Button>
            </div>
         </div>
      </div>
   );
};
export default CreateComment;
