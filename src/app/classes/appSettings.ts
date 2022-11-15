export const APIS = {
  CORS_ANYWHERE: 'https://cors-anywhere.herokuapp.com/',
  IMAGE_URL:
    'http://139.59.80.144:6000/public/images/kormoan_ecommerceiimages/product_images/thumb/',
  BASE_URL: 'http://139.59.90.8:',
  BASE_URL_PARKING: 'https://staging.api.parking.sistem.app',
  IMAGE_BASE_URL: 'https://staging.api.parking.sistem.app/auth/',
  BASE_URL_TEMP: 'http://139.59.80.144:',
  PORT_DOMAIN: '1024',
  PORT: '1185',
  CHECK_DOMAIN: '/verify-company-name-for-login',
  PARKING_FORGOT_PASSWORD_GENERATE: '/auth/forget-password/generate',
  PARKING_FORGOT_PASSWORD_VERIFY: '/auth/forget-password/verify',
  PARKING_FORGOT_PASSWORD_CHANGE: '/auth/forget-password/update',
  CHECK_EMAIL: '/api/v1/verify-system-email-admin-manager-agent-email-status/',
  LOGIN: '/api/v1/logins-by-system-admin-manager-agent-otp/',
  VERIFY_OTP: '/api/v1/verify-the-otp-after-the-login/',
  REG: {
    VERIFY_DOMAIN_NAME: '/verify-domain-name',
    REGISTER_CLIENT_BY_DOMAIN: '/register-client-by-domain',
    VERIFY_ACCOUNT_BY_CLIENT_USING_OTP: '/verify-account-by-client-using-otp',
    CREATE_PASSWORD: '/create-password-by-client',
    IMPORT_DATABASE: '/import-database-of-client',
    START_SERVER: '/start-server-for',
    VALIDATE_CLIENT: '/vailidate-client-data',
    INSERT_ADMIN: '/insert-admin-detail',
    LOGIN_FOR_TOKEN: '/login-for-token',
  },
  SALES: {
    CATEGORY: {
      LIST: '/api/v1/allCategory/',
      ADD_CATEGORY: '/api/v1/addCategory/',
      UPDATE_CATEGORY: '/api/v1/editCategory/',
      DELETE_CATEGORY: '/api/v1/deleteCategory/',
      ADD_CATEGORY_TYPE: '/api/v1/addCategoryType/',
      UPDATE_CATEGORY_TYPE: '/api/v1/updateCategoryType/',
      DELETE_CATEGORY_TYPE: '/api/v1/deleteCategoryType/',
      TYPES_CATEGORY: '/api/v1/allCategoryWithType/',
    },
    PRODUCT: {
      LIST: '/api/v1/view-product-web/1/',
      ADD_PRODUCT: '/api/v1/add-product-overview-to-system/',
      UPDATE_PRODUCT: '/api/v1/edit-product-details/',
      DELETE_PRODUCT: '/api/v1/delete-all-details-of-product/',
      DELETE_PRODUCTS: '/api/v1/deleteMultipleProductWeb/',
      GET: '/api/v1/viewProduct/',
      UPDATE_IMAGES: '/api/v1/saveImageId/',
      ADD_RELATED_PRODUCT: '/api/v1/createRelatedProduct/',
    },
    COMPANY: {
      LIST: '/api/v1/show-all-company-according-to-role/',
      ADD_COMPANY: '/api/v1/add-store-or-account/',
      UPDATE_COMPANY: '/api/v1/update-store-or-account/',
      DELETE_COMPANY: '/api/v1/delete-store-or-account/',
      DELETE_COMPANIES: '/api/v1/deleteCompanyWeb/',
      GET: '/api/v1/view-single-store-details/',
      TYPES: '/api/v1/view-sales-company-type/',
    },
    FILE: {
      UPLOAD: '/api/v1/uploadImages/',
      GET: '/api/v1/getImageById/',
    },
    CONTACT: {
      LIST: '/api/v1/show-all-contacts-according-to-role/',
      ADD_CONTACT: '/api/v1/add-store-contact-or-only-contact/',
      UPDATE_CONTACT: '/api/v1/update-contact-details/',
      GET: '/api/v1/showSingleContact/',
      DELETE_CONTACT: '/api/v1/delete-contact-or-account/',
      DELETE_CONTACTS: '/api/v1/deleteContactWeb/',
    },
    ORDER: {
      LIST: '/api/v1/view-all-sales-order-by-login-role/',
      ADD_ORDER: '/api/v1/place-order-of-dealer-by-agent/',
      UPDATE_ORDER: '/api/v1/update-sales-order-by-agent/',
      GET: '/api/v1/view-single-sales-order-by-order-id/',
      DELETE_ORDER: '/api/v1/delete-sales-order-by-admin/',
      DELETE_ORDERS: '/api/v1/deleteMultipleSalesOrderWeb/',
    },
    TEAMS: {
      LIST: '/api/v1/show-all-team-members-list/',
    },
    TASK: {
      LIST: '/api/v1/show-all-task-details-including-invitation/',
      GET: '/api/v1/single-task-by-id/',
      STATUS: '/api/v1/change-task-status-by-agent/',
      ADD_TASK: '/api/v1/create-task-by-agent-or-other/',
      UPDATE_TASK: '/api/v1/edit-task-by-agent-or-other/',
    },
    ATTACHMENT: {
      UPLOAD: '/api/v1/uploadAttacehmentsFile/',
      LIST_ORDER: '/api/v1/viewOrderAttachmentsWeb/',
      ADD_ORDER: '/api/v1/saveAttachmentImageIdOrder/',
      LIST_COMPANY: '/api/v1/viewStoreAttachmentsWeb/',
      ADD_COMPANY: '/api/v1/saveAttachmentImageIdStore/',
      LIST_CONTACT: '/api/v1/viewContactAttachmentsWeb/',
      ADD_CONTACT: '/api/v1/saveAttachmentImageIdContact/',
    },
    NOTE: {
      LIST_NOTE_COMPANY: '/api/v1/view-sales-store-comments/',
      ADD_NOTE_COMPANY: '/api/v1/add-store-comment/',
      LIST_NOTE_ORDER: '/api/v1/view-sales-order-comments/',
      ADD_NOTE_ORDER: '/api/v1/add-sales-order-notes/',
      LIST_NOTE_CONTACT: '/api/v1/view-sales-contact-comments/',
      ADD_NOTE_CONTACT: '/api/v1/add-contact-comment/',
    },
  },
  PARKING: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SESSIONS: {
      LIST: '/parking/{PARKING_ID}/transaction',
      // SHARESESSION:'/parking/f7551dc4-e9e7-48d2-a8c2-862cacbf5f68/transaction/share'
      SHARESESSION: '/parking/{PARKING_ID}/transaction/share',
      SHAREPASSES: '/pass/{PARKING_ID}/share',
    },
    PASSESS: {
      LIST: '/pass/{PARKING_ID}',
      UPDATE: '/parking/{PARKING_ID}/pass/{PASS_ID}',
      GET: '/pass/{PARKING_ID}/details/{PASS_ID}',
    },
    RATES: {
      LIST: '/parking/{PARKING_ID}/price',
      SLOTS: '/parking/{PARKING_ID}/rate-slots',
      UPDATE_RATE: '/parking/{PARKING_ID}/price',
      UPDATE_RATE_NEW: '/price/{PARKING_ID}/priceupdate',
      ADD_RATE: '/parking/{PARKING_ID}/price',
      DELETE_HOUR: '/price/{PARKING_ID}/price-hour/{HOUR_ID}',
      UPDATE_HOUR: '/price/{PARKING_ID}/price-hour/{HOUR_ID}',
      GET: '/parking/{PARKING_ID}/price/{PRICE_ID}',
    },
    PASS_PRICE: {
      LIST: '/parking/{PARKING_ID}/pass-price',
      SLOTS: '/parking/{PARKING_ID}/rate-slots-pass',
      UPDATE_RATE_NEW: '/parking/{PARKING_ID}/rate-slots-pass-update',
    },
    VEHICLE_TYPES: {
      LIST: '/vehicle/type',
    },
    OPERATOR: {
      LIST: '/user/{PARKING_ID}',
      USERS: '/user/{PARKING_ID}?role={role}',
      TEAMS: '/user/teams/{PARKING_ID}',
      ADD: '/user/{PARKING_ID}',
      DELETE: '/user/{PARKING_ID}',
      STATUS: '/parking/{PARKING_ID}/user/status',
    },
    REPORTS: {
      VENDORPARKINGDETAILS: '/reports/vendor/parking-details/{PARKING_ID}',
      REVENUEBYHOURS: '/reports/vendor/revenue-by-hours/{PARKING_ID}',
      REVENUEBYFilterHOURS:
        '/reports/vendor/revenue-by-hours/{PARKING_ID}?filterBy={monthly}',
      PASSES: '/reports/passes/{PARKING_ID}?filterBy={monthly}',
      PASSESREVENUE: '/reports/passes/revenue/{PARKING_ID}?filterBy={monthly}',
      PARKINGREVENUE:
        '/reports/parking/revenue/{PARKING_ID}?filterBy={monthly}',
      PARKINGAMOUNT: '/reports/parking/amount/{PARKING_ID}?filterBy={monthly}',
      PARKINGCATEGORY:
        '/reports/parking/vehicle/category/{PARKING_ID}?filterBy={monthly}',
      PARKINGBOOKING:
        '/reports/booking/revenue/{PARKING_ID}?filterBy={monthly}',
      PARKINGTOTALCOLLECTION:
        '/reports/{PARKING_ID}?fromDate={FROM_DATE}&toDate={TO_DATE}',
    },
    TYPE: {
      LIST: '/vehicle/type',
    },
    ADDPARKING: {
      PARKING: '/parking',
      PARKINGIMAGES: '/parking/uploadImage',
      PARKINGFACILITES: '/facility?page=1',
      GETPARKING: '/parking',
      SUSPENDPARKING: '/parking/status',
      UPDATEPARKING: '/parking/{PARKING_ID}',
      DELETEPARKING: '/parking/{PARKING_ID}',
      DASHBOARDPARKING: '/reports/admin/parking-details',
      DASHBOARDPARKINGSEARCH:
        '/reports/admin/parking-details?search={searchValue}',
    },
    USERS: {
      ALLUSERS: '/user/all?type={UserType}',
      GETUSERDETAILS: '/user/{UserId}',
      GETUSERSESSION: '/parking/transaction/user/{UserId}',
      SUSPEND: '/user/teams/status',
    },
    VENDORS: {
      ADDVENDOR: '/user/add/vendor',
      EDITVENDOR: '/user/update/vendor/{vendorId}',
      SUSPENDVENDOR: '/user/update/vendor/status',
    },
  },
};

export const priceTypes = {
  mrp: 'MRP',
  distributer_price: 'Distributer',
  dealer_price: 'Dealer',
  retailer_price: 'Retailer',
  flagship: 'Flagship',
  other: 'Other',
};

export const PATHS = {
  MODULE_SALES: '/sales/',
  MODULE_PARKING: '/parking/',
  PRODUCT_DETAILS: 'productdetails/',
  PRODUCT_LIST: 'allproducts',
  PRODUCT_RELATED_LIST: 'relatedproducts/',
  COMPANY_LIST: 'allcompany',
  ORDER_LIST: 'allorders',
  TASK_LIST: 'alltasks',
  ATTACHMENT_LIST: 'allattachments/',
  NOTES_LIST: 'allnotes/',
  CONTACT_LIST: 'allcontacts',
  COMPANY_DETAILS: 'companydetails/',
  CONTACT_DETAILS: 'contactdetails/',
  ORDER_DETAILS: 'orderdetails/',
  TASK_DETAILS: 'taskdetails/',
  SETTINGS: 'settings/',
  SETTINGS_DASHBOARD: 'settings/dashboard',
  SETTINGS_PROFILE: 'settings/profile',
  SETTINGS_TEAM: 'settings/team',
  SETTINGS_BILLING: 'settings/billing',
  SETTINGS_APPS: 'settings/apps',
  SETTINGS_DATA: 'settings/data',
  PARKING_DASHBOARD: 'dashboard',
  PARKING_USERS: 'users',
  PARKING_SESSIONS: 'sessions',
  PARKING_PASSES: 'passes',
  PARKING_SETTINGS_HOME: 'settings',
  PARKING_ID: '{PARKING_ID}/',
  PARKING_SETTING_RATE: 'settings/rate',
  PARKING_SETTING_DASHBOARD: 'settings/dashboard',
  PARKING_SETTING_VENDORS: 'settings/vendors',
  PARKING_SETTING_PASS: 'settings/pass',
  PARKING_SETTING_TEAM: 'settings/team',
  PARKING_RATE: 'settings/parking-rate',
  PARKING_VENDOR: 'settings/vendor',
  PARKING_MANAGE: 'settings/manageParking',
  PARKING_REPORTS: 'reports',
};

export const MODULES = [
  {
    title: 'Sales',
    icon: '/assets/images/applogo/sale.png',
    route: '/sales',
    color: '#ff4620',
    selected: true,
    menus: [
      {
        title: 'Products',
        icon: '/assets/images/icons/productldpi.svg',
        route: PATHS.MODULE_SALES + PATHS.PRODUCT_LIST,
        color: '#ffcd05',
      },
      {
        title: 'Order',
        icon: '/assets/images/icons/sales orderldpi.svg',
        route: PATHS.MODULE_SALES + PATHS.ORDER_LIST,
        color: '#5AC8FA',
      },
      {
        title: 'Tasks',
        icon: '/assets/images/icons/tasksldpi.svg',
        route: PATHS.MODULE_SALES + PATHS.TASK_LIST,
        color: '#5838D6',
      },
      {
        title: 'Contact',
        icon: '/assets/images/icons/contactldpi.svg',
        route: '/sales/allcontacts',
        color: '#5952a2',
      },
      {
        title: 'Company',
        icon: '/assets/images/icons/companyldpi.svg',
        route: PATHS.MODULE_SALES + PATHS.COMPANY_LIST,
        color: '#f8951d',
      },
      {
        title: 'Activity',
        icon: '/assets/images/icons/activityldpi.svg',
        route: '/sales/allactivity',
        color: '#63c6f1',
      },
    ],
  },
  {
    title: 'Parking',
    icon: '/assets/images/applogo/sale.png',
    route: '/parking',
    color: '#ff4620',
    selected: true,
    menus: [
      {
        title: 'Dashboard',
        icon: '/assets/images/icons/productldpi.svg',
        route: PATHS.MODULE_PARKING + PATHS.PARKING_DASHBOARD,
        color: '#ffcd05',
      },
      {
        title: 'Users',
        icon: '/assets/images/icons/sales orderldpi.svg',
        route: PATHS.MODULE_PARKING + PATHS.PARKING_USERS,
        color: '#5AC8FA',
      },
      {
        title: 'Sessions',
        icon: '/assets/images/icons/sales orderldpi.svg',
        route:
          PATHS.MODULE_PARKING +
          PATHS.PARKING_SESSIONS +
          '/' +
          PATHS.PARKING_ID,
        color: '#5AC8FA',
      },
      {
        title: 'Passes',
        icon: '/assets/images/icons/tasksldpi.svg',
        route:
          PATHS.MODULE_PARKING + PATHS.PARKING_PASSES + '/' + PATHS.PARKING_ID,
        color: '#5838D6',
      },
      {
        title: 'Reports',
        icon: '/assets/images/icons/insights.svg',
        route:
          PATHS.MODULE_PARKING + PATHS.PARKING_REPORTS + '/' + PATHS.PARKING_ID,
        color: '#FF3B30',
      },
      // {
      //   title: 'Settings',
      //   icon: '/assets/images/icons/filterldpi.svg',
      //   route:
      //     PATHS.MODULE_PARKING +
      //     PATHS.PARKING_SETTINGS_HOME +
      //     '/' +
      //     PATHS.PARKING_ID,
      //   color: '#38D658',
      // },
    ],
  },

  {
    title: 'Support',
    icon: '/assets/images/applogo/support.png',
    route: '/support',
    color: '#0880fe',
    menus: [
      {
        title: 'DEMO URL',
        icon: '/assets/images/icons/attendanceldpi.svg',
        route: '/sales/allactivity',
        color: '#257415',
      },
    ],
  },
  {
    title: 'Field Service',
    icon: '/assets/images/applogo/field-service.png',
    route: '/fieldservice',
    color: '#ff9e00',
    menus: [
      {
        title: 'DEMO URL',
        icon: '/assets/images/icons/attendanceldpi.svg',
        route: '/sales/allactivity',
        color: '#257415',
      },
    ],
  },
  {
    title: 'Commerce',
    icon: '/assets/images/applogo/commerce.png',
    route: '/commerce',
    color: '#c99241',
    menus: [
      {
        title: 'DEMO URL',
        icon: '/assets/images/icons/attendanceldpi.svg',
        route: '/sales/allactivity',
        color: '#257415',
      },
    ],
  },
  {
    title: 'Expence',
    icon: '/assets/images/applogo/expence.png',
    route: '/expence',
    color: '#3ab54b',
    menus: [
      {
        title: 'DEMO URL',
        icon: '/assets/images/icons/attendanceldpi.svg',
        route: '/sales/allactivity',
        color: '#257415',
      },
    ],
  },
];

export const ACTIONS = {
  DELETE: 'delete',
  EDIT: 'edit',
  COPY: 'copy',
  PRINT: 'print',
  EMAIL: 'email',
  PDF: 'pdf',
  SHARE: 'share',
  SHARE_BUTTON: 'share_button',
};
