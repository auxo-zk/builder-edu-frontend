import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AppLayout from './layout';
import YourCourses from './pages/your-courses/YourCourses';
import Profile from './pages/profile/Profile';
import CreateCourse from './pages/create-course/CreateCourse';
import JoinCampaign from './pages/join-campaign/JoinCampaign';
import InfoCourseJoinedCampaign from './pages/info-course-joined-campaign/InfoCourseJoinedCampaign';
import DraftCourse from './pages/draft-course/DraftCourse';
import EditDraftCourse from './pages/edit-draf-course/EditDraftCourse';
import ProfileGuest from './pages/profile-guest/ProfileGuest';

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
                    path: 'draft-courses',
                    element: <DraftCourse />,
                },
                {
                    path: 'your-courses/create',
                    element: <CreateCourse />,
                },
                {
                    path: 'draft-courses/edit/:idDraft',
                    element: <EditDraftCourse />,
                },
                {
                    path: 'your-courses/:courseId/join-campaign/:campaignId',
                    element: <JoinCampaign />,
                },
                {
                    path: 'your-courses/:courseId/info-join-campaigns',
                    element: <InfoCourseJoinedCampaign />,
                },
                {
                    path: 'profile',
                    element: <Profile />,
                },
                {
                    path: 'profile/:userAddress',
                    element: <ProfileGuest />,
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
