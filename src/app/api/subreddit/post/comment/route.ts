import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment';
import { z } from 'zod';

export async function PATCH(req: Request, res: Response) {
   try {
      const body = await req.json();

      const { postId, text, replyToId } = CommentValidator.parse(body);
      const session = await getAuthSession();
      if (!session?.user) {
         return new Response('Unauthorize', {
            status: 401,
         });
      }
      await db.comment.create({
         data: {
            text,
            postId,
            authorId: session.user.id,
            replyToId,
         },
      });
      return new Response('OK');
   } catch (error) {
      console.log('❄️ ~ file: route.ts:26 ~ error:', error);
      if (error instanceof z.ZodError)
         return new Response(error.message, { status: 422 });
      return new Response('Could not create comment, please try again later.', {
         status: 500,
      });
   }
}
