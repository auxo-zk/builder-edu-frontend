import { AppStateProvider, IconUser, Layout, walletConfig, WalletProvider } from '@auxo-dev/frontend-common';
import { Outlet } from 'react-router-dom';
import { Class, ClassOutlined, Dashboard } from '@mui/icons-material';
import { QueryClient } from '@tanstack/react-query';

const config = walletConfig('6482349197b073ab1d34e32ec4907c1d');
const queryClient = new QueryClient();

export default function AppLayout() {
    return (
        <WalletProvider wagmiConfig={config} queryClient={queryClient}>
            <AppStateProvider>
                <Layout
                    role={import.meta.env.VITE_APP_USER_ROLE}
                    requiedLogin={true}
                    menu={[
                        {
                            icon: Class,
                            title: 'Your Courses',
                            url: '/your-courses',
                            children: [],
                        },
                        {
                            icon: ClassOutlined,
                            title: 'Draft Courses',
                            url: '/draft-courses',
                            children: [],
                        },
                        {
                            icon: IconUser,
                            title: 'Profile',
                            url: '/profile',
                            children: [],
                        },
                    ]}
                >
                    <Outlet />
                </Layout>
            </AppStateProvider>
        </WalletProvider>
    );
}
