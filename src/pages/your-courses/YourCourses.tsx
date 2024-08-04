import { BoxIntroducePage } from '@auxo-dev/frontend-common';
import { Box, Button, Container } from '@mui/material';
import React from 'react';
import ListCourse from './ListCourse/ListCourse';
import { AddRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function YourCourses() {
    const navigate = useNavigate();
    return (
        <Container sx={{ py: 5 }}>
            <BoxIntroducePage thumnail="/images/auxo-thumbnail3.png" title="Your Courses"></BoxIntroducePage>
            <Box textAlign={'right'}>
                <Button variant="contained" startIcon={<AddRounded />} onClick={() => navigate('/your-courses/create')}>
                    Create new course
                </Button>
            </Box>
            <ListCourse />
        </Container>
    );
}
