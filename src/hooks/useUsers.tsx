
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services';
import { User } from '@/services/api/types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.list<User>(),
  });
};
