'use client';
import { useRef, useState } from 'react';
import UserAvatar from './UserAvatar';
import { Comment, CommentVote, User } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { CommentRequest } from '@/lib/validators/comment';
import { toast } from '@/hooks/use-toast';

type ExtendedComment = Comment & {
   votes: CommentVote[];
   author: User;
};

interface PostCommentProps {
   comment: ExtendedComment;
   currentVote: CommentVote | undefined;
   postId: string;
   votesAmt: number;
}
const PostComment: React.FC<PostCommentProps> = ({
   comment,
   currentVote,
   postId,
   votesAmt,
}) => {
   const commentRef = useRef<HTMLDivElement>(null);
   const router = useRouter();
   const { data: session } = useSession();
   const [isReply, setIsReply] = useState<boolean>(false);
   const [input, setInput] = useState<string>('');

   const { mutate: postComment, isLoading } = useMutation({
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
         if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
               return loginToast();
            }
         }
         return toast({
            title: 'There was a problem',
            description: "Comment isn't successfully",
            variant: 'destructive',
         });
      },
      onSuccess: () => {
         router.refresh();
         setInput('');
         setIsReply(false);
      },
   });
   return (
      <div
         ref={commentRef}
         className=""
      >
         <div className="flex items-center">
            <UserAvatar
               user={{ name: comment.author.name, image: comment.author.image }}
               className="h-6 w-6"
            />
            <div className="ml-2 flex items-center gap-x-2">
               <p className="text-sm font-medium text-gray-900">
                  u/{comment.author.username}
               </p>
               <p className="max-h-40 truncate text-xs text-zinc-500">
                  {formatTimeToNow(new Date(comment.createdAt))}
               </p>
            </div>
         </div>
         <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
         <div className="flex gap-2 flex-wrap items-center">
            <CommentVotes
               commentId={comment.id}
               initialVotesAmt={votesAmt}
               initialVote={currentVote}
            />
            <Button
               variant={'ghost'}
               size={'sm'}
               aria-label="reply"
               onClick={() => {
                  if (!session) router.push('/sign-in');
                  setIsReply(true);
               }}
            >
               <MessageSquare className="h-4 w-4 mr-1.5" />
               Reply
            </Button>
            {isReply ? (
               <>
                  <div className="grid w-full gap-1.5">
                     <div className="grid w-full gap-1.5">
                        <Label htmlFor="comment">Your comment</Label>
                        <div className="mt-2">
                           <Textarea
                              id="comment"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                           />
                           <div className="mt-2 flex justify-end gap-2">
                              <Button
                                 tabIndex={-1}
                                 variant={'subtle'}
                                 onClick={() => setIsReply(false)}
                              >
                                 Cancel
                              </Button>
                              <Button
                                 isLoading={isLoading}
                                 disabled={input.length === 0}
                                 onClick={() =>
                                    postComment({
                                       postId,
                                       text: input,
                                       replyToId:
                                          comment.replyToId ?? comment.id,
                                    })
                                 }
                              >
                                 Post
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            ) : null}
         </div>
      </div>
   );
};
export default PostComment;
function loginToast(): unknown {
   throw new Error('Function not implemented.');
}
