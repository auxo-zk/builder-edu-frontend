import { AppStateProvider, IconUser, Layout, walletConfig, WalletProvider } from '@auxo-dev/frontend-common';
import { Outlet } from 'react-router-dom';
import { Dashboard } from '@mui/icons-material';
import { QueryClient } from '@tanstack/react-query';

const config = walletConfig('6482349197b073ab1d34e32ec4907c1d');
const queryClient = new QueryClient();

export default function AppLayout() {
    return (
        <WalletProvider wagmiConfig={config} queryClient={queryClient}>
            <AppStateProvider>
                <Layout
                    requiedLogin={true}
                    menu={[
                        {
                            icon: Dashboard,
                            title: 'Your Courses',
                            url: '/your-courses',
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
