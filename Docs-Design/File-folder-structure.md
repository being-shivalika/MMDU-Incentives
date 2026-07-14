src/

│
├── app/
│   ├── App.jsx
│   ├── main.jsx
│   └── router/
│       ├── AppRouter.jsx
│       ├── ProtectedRoute.jsx
│       ├── PublicRoute.jsx
│       └── RouteConfig.js
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── illustrations/
│   ├── images/
│   └── logos/
│
├── components/
│   │
│   ├── ui/
│   │
│   ├── navigation/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SidebarItem.jsx
│   │   ├── SidebarGroup.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── ProfileMenu.jsx
│   │   ├── NotificationMenu.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── LandingLayout.jsx
│   │   └── PageContainer.jsx
│   │
│   ├── cards/
│   │   ├── StatCard.jsx
│   │   ├── ActivityCard.jsx
│   │   ├── ResearchCard.jsx
│   │   ├── PaymentCard.jsx
│   │   ├── ApprovalCard.jsx
│   │   └── ProfileCard.jsx
│   │
│   ├── tables/
│   │   ├── DataTable.jsx
│   │   ├── TablePagination.jsx
│   │   ├── TableToolbar.jsx
│   │   └── TableFilters.jsx
│   │
│   ├── forms/
│   │   ├── ClaimForm.jsx
│   │   ├── PublicationForm.jsx
│   │   ├── PatentForm.jsx
│   │   ├── BookForm.jsx
│   │   ├── ConferenceForm.jsx
│   │   ├── ConsultancyForm.jsx
│   │   ├── ProjectForm.jsx
│   │   └── AwardForm.jsx
│   │
│   ├── charts/
│   │   ├── PublicationChart.jsx
│   │   ├── ResearchScoreChart.jsx
│   │   ├── BudgetChart.jsx
│   │   ├── DepartmentChart.jsx
│   │   └── TrendChart.jsx
│   │
│   ├── upload/
│   │   ├── FileUpload.jsx
│   │   ├── UploadPreview.jsx
│   │   ├── UploadedFile.jsx
│   │   └── UploadProgress.jsx
│   │
│   ├── timeline/
│   │   ├── ClaimTimeline.jsx
│   │   ├── TimelineStep.jsx
│   │   └── StatusBadge.jsx
│   │
│   └── shared/
│       ├── PageHeader.jsx
│       ├── PageTitle.jsx
│       ├── SectionTitle.jsx
│       ├── EmptyState.jsx
│       ├── LoadingState.jsx
│       ├── ErrorState.jsx
│       └── NoPermission.jsx
│
├── pages/
│   │
│   ├── Landing/
│   │   ├── LandingPage.jsx
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── WorkflowSection.jsx
│   │   ├── FAQSection.jsx
│   │   └── ContactSection.jsx
│   │
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── Faculty/
│   │   ├── Dashboard/
│   │   │   └── FacultyDashboard.jsx
│   │   │
│   │   ├── Claims/
│   │   │   ├── FacultyClaims.jsx
│   │   │   ├── FacultyClaimDetails.jsx
│   │   │   ├── FacultyCreateClaim.jsx
│   │   │   └── FacultyEditClaim.jsx
│   │   │
│   │   ├── Publications/
│   │   │   └── FacultyPublications.jsx
│   │   │
│   │   ├── Payments/
│   │   │   └── FacultyPayments.jsx
│   │   │
│   │   ├── ResearchScore/
│   │   │   └── FacultyResearchScore.jsx
│   │   │
│   │   ├── Notifications/
│   │   │   └── FacultyNotifications.jsx
│   │   │
│   │   └── Profile/
│   │       └── FacultyProfile.jsx
│   │
│   ├── HOD/
│   │   ├── Dashboard/
│   │   ├── Approvals/
│   │   ├── Faculty/
│   │   ├── Analytics/
│   │   └── Profile/
│   │
│   ├── Director/
│   │   ├── Dashboard/
│   │   ├── Approvals/
│   │   ├── Institutes/
│   │   ├── Reports/
│   │   └── Profile/
│   │
│   ├── RPC/
│   │   ├── Dashboard/
│   │   ├── Verification/
│   │   ├── Publications/
│   │   ├── Policy/
│   │   ├── Analytics/
│   │   └── Profile/
│   │
│   ├── Finance/
│   │   ├── Dashboard/
│   │   ├── Budget/
│   │   ├── Payments/
│   │   ├── Reports/
│   │   └── Profile/
│   │
│   ├── Accounts/
│   │   ├── Dashboard/
│   │   ├── PaymentProcessing/
│   │   ├── Transactions/
│   │   └── Profile/
│   │
│   └── Admin/
│       ├── Dashboard/
│       ├── Users/
│       ├── Departments/
│       ├── Roles/
│       ├── Policy/
│       ├── Reports/
│       ├── Settings/
│       └── AuditLogs/
│
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   ├── SidebarContext.jsx
│   └── NotificationContext.jsx
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── dashboardService.js
│   ├── claimService.js
│   ├── publicationService.js
│   ├── paymentService.js
│   ├── reportService.js
│   ├── uploadService.js
│   └── notificationService.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useSidebar.js
│   ├── useTheme.js
│   ├── useDebounce.js
│   ├── usePagination.js
│   └── useLocalStorage.js
│
├── constants/
│   ├── roles.js
│   ├── routes.js
│   ├── sidebarLinks.js
│   ├── dashboardConfig.js
│   ├── claimStatus.js
│   └── permissions.js
│
├── utils/
│   ├── formatDate.js
│   ├── formatCurrency.js
│   ├── validators.js
│   ├── downloadFile.js
│   └── calculateScore.js
│
└── styles/
    ├── globals.css
    ├── variables.css
    └── animations.css