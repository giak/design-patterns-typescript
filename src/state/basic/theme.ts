interface ThemeStateInterface {
  applyTheme(): void;
}

class LightTheme implements ThemeStateInterface {
  applyTheme() {
    console.log('Applying light theme');
    // Logic to apply light theme
  }
}

class DarkTheme implements ThemeStateInterface {
  applyTheme() {
    console.log('Applying dark theme');
    // Logic to apply dark theme
  }
}

class App {
  private themeState: ThemeStateInterface;

  constructor() {
    this.themeState = new LightTheme();
  }

  setTheme(state: ThemeStateInterface) {
    this.themeState = state;
    this.themeState.applyTheme();
  }
}

const app = new App();
app.setTheme(new DarkTheme());

export {};
