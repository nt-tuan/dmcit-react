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
      name: 'Organization'
    },
    {
      name: 'Department',
      url: '/hr/departments',
      icon: 'fa fa-building'
    },
    {
      name: 'Employee',
      url: '/hr/employees',
      icon: 'fas fa-portrait'
    },
    {
      name: 'Customer',
      url: '/sales/customers',
      icon: 'fas fa-shopping-cart'
    },
    {
      name: 'Messaging',
      title: true
    },
    {
      name: 'Address book',
      url: '/messaging',
      icon: 'fa fa-address-book',
      children: [
        {
          name: 'Addresses',
          url: '/messaging/receivers',
          icon: 'fa fa-list'
        },
        {
          name: 'Groups',
          url: '/messaging/groups',
          icon: 'fa fa-list'
        },
      ]
    },
    {
      name: 'Compose',
      url: '/messaging/compose',
      icon: 'fa fa-feather',
      children: [
        {
          name: 'Custom',
          url: '/messaging/compose/custom',
          icon: 'fa fa-feather'
        }
        ,
        {
          name: 'Payment Message',
          url: '/messaging/compose/payment',
          icon: 'fa fa-circle'
        },
        {
          name: 'AR Message',
          url: '/messaging/compose/ar',
          icon: 'fa fa-circle',
          tooltip: 'Send messages which their content are retreived from other source'
        },
        {
          name: 'History',
          url: '/messaging/batches',
          icon: 'fas fa-history'
        }

      ]
    },
    {
      title: true,
      name: 'System',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: '',             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'System',
      url: '/system',
      icon: 'fas fa-cogs',
      children: [
        {
          name: 'Process Manager',
          url: '/system/processes',
          icon: 'fa fa-tasks'
        },
        {
          name: 'General',
          url: '/system/general',
          icon: 'fa fa-globe'
        },
        {
          name: 'Accounting Period',
          url: '/system/ap',
          icon: 'fa fa-calendar'
        },
        {
          name: 'Messaging',
          url: '/system/messaging',
          icon: 'fa fa-envelope'
        },
        {
          name: 'Severs',
          url: '/system/servers',
          icon: 'fa fa-server'
        }
      ]
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'icon-user',
      children: [
        {
          name: 'New User',
          url: '/users/add',
          icon: 'icon-plus',
          attributes: { disabled: true }
        },
        {
          name: 'List',
          url: '/users/list',
          icon: 'icon-list',
          attributes: { disabled: true }
        }
      ]
    }
  ],
};
