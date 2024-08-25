import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { LoadingScreen } from 'src/components/loading-screen';

import { ChatView } from 'src/sections/chat/view';
import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const ProfilePage = lazy(() => import('src/pages/dashboard/profile'));
const ManagersPage = lazy(() => import('src/pages/dashboard/admin'));
const CreatorList = lazy(() => import('src/pages/dashboard/creator/list'));
const CreatorMediaKit = lazy(() => import('src/pages/dashboard/creator/mediaKit'));
const MeditKitsCards = lazy(() => import('src/pages/dashboard/creator/mediaKitCards'));
const FinanceCreator = lazy(() => import('src/pages/dashboard/creator/finance'));

// Campaign
const ManageCampaign = lazy(() => import('src/pages/dashboard/campaign/manageCampaign'));
const CreateCampaign = lazy(() => import('src/pages/dashboard/campaign/createCampaign'));
const CampaignSetting = lazy(() => import('src/pages/dashboard/campaign/setting'));
const CampaignDetails = lazy(() => import('src/pages/dashboard/campaign/details'));
const ViewCampaign = lazy(() => import('src/pages/dashboard/campaign/campaign-view'));
const AdminCampaignDetail = lazy(
  () => import('src/pages/dashboard/campaign/admin/campaign-details')
);
const AdminCamapaignView = lazy(
  () => import('src/pages/dashboard/campaign/admin/campaign-detail-manage')
);
const AdminEditCampaignView = lazy(
  () => import('src/pages/dashboard/campaign/admin/campaign-edit-view')
);
const CampaignPitchDetail = lazy(
  () => import('src/pages/dashboard/campaign/admin/pitch/campaign-pitch-detail')
);
const CreatorManageCampaign = lazy(
  () => import('src/pages/dashboard/campaign/creator/manage-campaign')
);
const CampaignManageCreatorView = lazy(
  () => import('src/pages/dashboard/campaign/admin/creator/campaign-manage-creator')
);
const CampaignDetailPitchSmall = lazy(
  () => import('src/pages/dashboard/campaign/admin/pitch/campaign-pitch-content-small')
);
const ManageCampaignDetailView = lazy(
  () => import('src/pages/dashboard/campaign/creator/manage-campaign-detail')
);

// Brand & Company
const BrandManage = lazy(() => import('src/pages/dashboard/brand/manageBrand'));
const BrandCreate = lazy(() => import('src/pages/dashboard/brand/createBrand'));
const BrandDiscover = lazy(() => import('src/pages/dashboard/brand/discoverBrand'));
const CompanyDetails = lazy(() => import('src/pages/dashboard/brand/company-details'));
const CompanyEdit = lazy(() => import('src/pages/dashboard/brand/company-edit'));
const BrandDetails = lazy(() => import('src/pages/dashboard/brand/brand-details'));
const BrandEdit = lazy(() => import('src/pages/dashboard/brand/brand-edit'));

// Landing Page temporary
const CreatorLists = lazy(() => import('src/pages/dashboard/landing/creator'));
const BrandLists = lazy(() => import('src/pages/dashboard/landing/brand'));

// Finance
const CampaignPage = lazy(() => import('src/pages/dashboard/finance/invoice'));
const FinanceDiscover = lazy(() => import('src/pages/dashboard/finance/discover'));
const CreatorSelection = lazy(() => import('src/pages/dashboard/finance/creatorList'));
const InvoicePage = lazy(() => import('src/pages/dashboard/finance/invoiceDetails'));
const CreateInvoice = lazy(() => import('src/pages/dashboard/finance/createInvoice'));
// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'admins',
        element: (
          <RoleBasedGuard roles={['superadmin', 'admin']} hasContent>
            <ManagersPage />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'user',
        children: [
          { element: <ProfilePage />, index: true },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      // For admin/superadmin
      // dashboard/creator
      {
        path: 'creator',
        children: [
          {
            element: (
              <RoleBasedGuard roles={['superadmin', 'admin']} hasContent>
                <CreatorList />
              </RoleBasedGuard>
            ),
            index: true,
          },
          {
            path: 'lists',
            element: (
              <RoleBasedGuard roles={['superadmin', 'admin']} hasContent>
                <CreatorList />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'media-kits',
            children: [
              {
                element: (
                  <RoleBasedGuard roles={['superadmin', 'admin']} hasContent>
                    <MeditKitsCards />
                  </RoleBasedGuard>
                ),
                index: true,
              },
              {
                path: ':id',
                element: (
                  <RoleBasedGuard roles={['superadmin', 'admin']} hasContent>
                    <CreatorMediaKit />
                  </RoleBasedGuard>
                ),
              },
            ],
          },
        ],
      },
      // For Finance
      {
        path: 'finance',
        element: (
          <RoleBasedGuard roles={['finance']} hasContent>
            {/* <div>hi finance guy</div> */}
            <FinanceDiscover />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'invoice',
        children: [
          {
            element: (
              <RoleBasedGuard roles={['finance']} hasContent>
                <CampaignPage />
              </RoleBasedGuard>
            ),
            index: true,
          },
          {
            path: 'create/:id',
            element: (
              <RoleBasedGuard roles={['finance']} hasContent>
                <CreateInvoice />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'creator-list/:id',
            element: (
              <RoleBasedGuard roles={['finance']} hasContent>
                <CreatorSelection />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'detail/:id',
            element: (
              <RoleBasedGuard roles={['finance']} hasContent>
                <InvoicePage />
              </RoleBasedGuard>
            ),
          },
        ],

        // element: (
        //   <RoleBasedGuard roles={['finance']} hasContent>
        //     <CampaignPage />
        //   </RoleBasedGuard>
        // ),
      },
      {
        path: 'mediakit',
        element: (
          <RoleBasedGuard roles={['creator']} hasContent>
            <CreatorMediaKit />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'finance',
        element: (
          <RoleBasedGuard roles={['creator']} hasContent>
            <FinanceCreator />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'landing',
        children: [
          {
            path: 'creator',
            element: <CreatorLists />,
          },
          {
            path: 'brand',
            element: <BrandLists />,
          },
        ],
      },
      {
        path: 'company',
        children: [
          {
            element: <BrandDiscover />,
            index: true,
          },
          {
            path: 'discover',
            element: <BrandDiscover />,
          },
          {
            path: 'create',
            element: (
              <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                <BrandCreate />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'manage',
            element: (
              <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                <BrandManage />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                <CompanyEdit />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'details/:id',
            element: <CompanyDetails />,
          },
          {
            path: 'brand',
            children: [
              {
                index: true,
                element: <BrandDetails />,
              },
              {
                path: ':id',
                element: <BrandDetails />,
              },
              {
                path: 'edit/:id',
                element: <BrandEdit />,
              },
            ],
          },
        ],
      },
      {
        path: 'campaign',
        children: [
          {
            index: true,
            element: (
              <RoleBasedGuard hasContent roles={['admin', 'superadmin', 'creator']}>
                <ViewCampaign />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'manage',
            children: [
              {
                index: true,
                element: (
                  <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                    <ManageCampaign />
                  </RoleBasedGuard>
                ),
              },
              {
                path: ':id',
                element: (
                  <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                    <AdminCamapaignView />
                  </RoleBasedGuard>
                ),
              },
              {
                path: 'edit/:id',
                element: (
                  <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                    <AdminEditCampaignView />
                  </RoleBasedGuard>
                ),
              },
            ],
          },
          {
            path: 'create',
            element: (
              <RoleBasedGuard hasContent roles={['admin', 'superadmin']}>
                <CreateCampaign />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'discover',
            children: [
              {
                index: true,
                element: (
                  <RoleBasedGuard hasContent roles={['admin', 'superadmin', 'creator']}>
                    <ViewCampaign />
                  </RoleBasedGuard>
                ),
              },
              {
                path: 'detail/:id',
                children: [
                  {
                    index: true,
                    element: (
                      <RoleBasedGuard hasContent roles={['superadmin', 'admin']}>
                        <AdminCampaignDetail />
                      </RoleBasedGuard>
                    ),
                  },
                  {
                    path: 'creator/:creatorId',
                    element: (
                      <RoleBasedGuard hasContent roles={['superadmin', 'admin']}>
                        <CampaignManageCreatorView />
                      </RoleBasedGuard>
                    ),
                  },
                  {
                    path: 'pitch/:pitchId',
                    element: (
                      <RoleBasedGuard hasContent roles={['superadmin', 'admin']}>
                        <CampaignDetailPitchSmall />
                      </RoleBasedGuard>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'settings',
            element: (
              <RoleBasedGuard hasContent roles={['superadmin']}>
                <CampaignSetting />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'details/:id',
            element: (
              <RoleBasedGuard hasContent roles={['superadmin', 'admin']}>
                <CampaignDetails />
              </RoleBasedGuard>
            ),
          },
          {
            path: 'pitch/:id',
            element: (
              <RoleBasedGuard hasContent roles={['superadmin']}>
                <CampaignPitchDetail />
              </RoleBasedGuard>
            ),
          },
          // For creator path
          {
            path: 'VUquQR/HJUboKDBwJi71KQ==/manage',
            children: [
              {
                index: true,
                element: (
                  <RoleBasedGuard hasContent roles={['creator']}>
                    <CreatorManageCampaign />
                  </RoleBasedGuard>
                ),
              },
              {
                path: 'detail/:id',
                element: (
                  <RoleBasedGuard hasContent roles={['creator']}>
                    <ManageCampaignDetailView />
                  </RoleBasedGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'calendar',
        element: <CalendarView />,
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            element: <ChatView />,
          },
          {
            path: 'thread/:id',
            element: <ChatView />,
          },
        ],
      },
    ],
  },
];
