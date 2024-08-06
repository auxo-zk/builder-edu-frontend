import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AppLayout from './layout';
import YourCourses from './pages/your-courses/YourCourses';
import Profile from './pages/profile/Profile';
import CreateCourse from './pages/create-course/CreateCourse';
import JoinCampaign from './pages/join-campaign/JoinCampaign';

export default function AppRouter() {
    return useRoutes([
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    path: 'your-courses',
                    element: <YourCourses />,
                },
                {
                    path: 'your-courses/create',
                    element: <CreateCourse />,
                },
                {
                    path: 'your-courses/edit/:id',
                    element: <CreateCourse />,
                },
                {
                    path: 'your-courses/:courseId/join-campaign/:campaignId',
                    element: <JoinCampaign />,
                },
                {
                    path: 'profile',
                    element: <Profile />,
                },
                {
                    path: '*',
                    element: <div>404</div>,
                },
                {
                    path: '',
                    element: <Navigate to={'/your-courses'} />,
                },
            ],
        },
    ]);
}
