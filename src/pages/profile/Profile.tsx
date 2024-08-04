import { BoxProfile, IconSpinLoading } from '@auxo-dev/frontend-common';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { useUserProfile } from 'src/state/userProfile/state';

export default function Profile() {
    const [value] = useUserProfile();
    if (value.state === 'loading') {
        return (
            <Box>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Box>
        );
    }
    if (value.state === 'hasError') {
        return <Typography>Error: {JSON.stringify(value.error) || ''}</Typography>;
    }
    return (
        <Container sx={{ py: 5 }}>
            <BoxProfile titlePage="Builder Profile" role="builder" initData={value.data} getProfile={() => {}} editable />
        </Container>
    );
}
