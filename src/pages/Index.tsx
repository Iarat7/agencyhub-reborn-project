
import { Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

const Index = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default Index;
