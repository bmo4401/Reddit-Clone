'use client';
import { Prisma, Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from './ui/command';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import debounce from 'lodash.debounce';

const SearchBar = () => {
   const router = useRouter();
   const [input, setInput] = useState<string>('');
   const {
      data: queryResults,

      refetch,
      isFetched,
      isFetching,
   } = useQuery({
      queryKey: ['search-key'],
      queryFn: async () => {
         if (!input) return [];
         const { data } = await axios.get(`/api/search?q=${input}`);
         return data as (Subreddit & {
            _count: Prisma.SubredditCountOutputType;
         })[];
      },
      enabled: false,
   });

   const request = debounce(async () => {
      refetch();
   }, 300);
   const debounceRequest = useCallback(() => {
      request();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <Command className="relative rounded-lg border max-w-lg overflow-visible">
         <CommandInput
            value={input}
            onValueChange={(text) => {
               setInput(text);
               debounceRequest();
            }}
            className="outline-none border-none focus:border-none focus:outline-none ring-0"
            placeholder="Search communities"
         />
         {input.length ? (
            <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
               {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
               {(queryResults?.length ?? 0) > 0 ? (
                  <CommandGroup heading="Communities">
                     {queryResults?.map((subreddit) => (
                        <CommandItem
                           key={subreddit.id}
                           onSelect={(e) => {
                              router.push(`/r/${e}`);
                              router.refresh();
                           }}
                           value={subreddit.name}
                        >
                           <Users className="mr-2 h-4 w-4" />
                           <a href={`/r/${subreddit.name}`}>
                              /r/${subreddit.name}
                           </a>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               ) : null}
            </CommandList>
         ) : null}
      </Command>
   );
};
export default SearchBar;
