import { BoxIntroducePage, BoxProfile, getProfile, IconSpinLoading, imagePath, UserProfile } from '@auxo-dev/frontend-common';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProfileGuest() {
    const param = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        (async () => {
            if (param.userAddress) {
                const response = await getProfile('builder', param.userAddress);
                setUserProfile(response);
            }
            setLoading(false);
        })();
    }, []);
    if (loading) {
        return (
            <Container sx={{ py: 5 }}>
                <IconSpinLoading sx={{ fontSize: '100px' }} />
            </Container>
        );
    }
    if (!userProfile) {
        return (
            <Container sx={{ py: 5 }}>
                <BoxIntroducePage title="Profile not found!" thumnail={imagePath.LOGO_AUXO_2D} />
            </Container>
        );
    }
    return (
        <Container sx={{ py: 5 }}>
            <BoxProfile titlePage="Builder Profile" role="builder" initData={userProfile} getProfile={() => {}} editable={false} />
        </Container>
    );
}
