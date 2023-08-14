import { AvatarProps } from '@radix-ui/react-avatar';
import { User } from 'next-auth';
import Image from 'next/image';
import { Icons } from './Icons';
import { Avatar, AvatarFallback } from './ui/avatar';

interface UserAvatarProps extends AvatarProps {
   user: Pick<User, 'name' | 'image'>;
}
const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
   return (
      <Avatar {...props}>
         {user.image ? (
            <div className="relative aspect-square h-full w-full">
               <Image
                  alt=""
                  src={user.image}
                  fill
                  referrerPolicy="no-referrer"
               />
            </div>
         ) : (
            <AvatarFallback>
               <span>{user?.name}</span>
               <Icons.user className="h-4 w-4" />
            </AvatarFallback>
         )}
      </Avatar>
   );
};
export default UserAvatar;
