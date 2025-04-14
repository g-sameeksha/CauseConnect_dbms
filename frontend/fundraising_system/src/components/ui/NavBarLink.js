export const NAVBAR_LINKS = {
    common: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Know More", path: "/know_more" },
    ],
    orgAdmin: [
      { name: "Dashboard", path: "/orgadmin-home" },
      { name: "Manage Donations", path: "orgadmin/donations" },
      { name: "Manage Profile", path: "/orgadmin/profile" },
      { name: "New Cause", path: "/orgadmin/new_cause" },

    ],
    admin :[
      { name: "Dashboard", path: "/admin-home" },
      { name: "Donors", path: "/admin/donors" },
      { name: "Organizations", path: "/admin/organizations" },
      { name: "Organization Admins", path: "/admin/org-admins" },

    ],
    donor: [
      { name: "Dashboard", path: "/donor-home" },
      { name: "Donate", path: "/donors/cause-list" },
      { name: "My Donations", path: "/donor/donations" },

    ],
    general: [
        
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ],
  };
  