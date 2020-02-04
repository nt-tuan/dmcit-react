export default {
    items: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        badge: {
          variant: 'info',
          text: 'NEW',
        }
      },
      {
        title: true,
        name: 'Workflows'
      },
      {
        name: 'Working',
        url: '/workflows/list',
        icon: 'fa fa-building'
      },
      {
        name: 'History',
        url: '/workflows/history',
        icon: 'fas fa-history'
      },
      {
        name: 'Manage',
        url: '/workflows/manage',
        icon: 'fa fa-edit'
      },
      {
        name: 'Settings',
        url: '/workflows/setting',
        icon: 'fa fa-cogs'
      }
    ],
  };
  