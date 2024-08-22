interface UserStateInterface {
  accessDashboard(): void;
  editProfile(): void;
  adminAction(): void;
}

class GuestState implements UserStateInterface {
  accessDashboard() {
    console.log('Access denied');
  }
  editProfile() {
    console.log('Please login first');
  }
  adminAction() {
    console.log('Admin access required');
  }
}

class LoggedInState implements UserStateInterface {
  accessDashboard() {
    console.log('Accessing dashboard');
  }
  editProfile() {
    console.log('Editing profile');
  }
  adminAction() {
    console.log('Admin access required');
  }
}

export {};
