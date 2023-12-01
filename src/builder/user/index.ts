class User {
  constructor(public name: string, public age: number) {}
}

class UserBuilder {
  private name: string | null = null;
  private age: number | null = null;

  public setName(name: string): UserBuilder {
    this.name = name;
    return this;
  }

  public setAge(age: number): UserBuilder {
    this.age = age;
    return this;
  }

  public build(): User {
    if (!this.name) {
      throw new Error('Name is required');
    }
    if (this.age === null || this.age < 0) {
      throw new Error('Valid age is required');
    }
    return new User(this.name, this.age);
  }
}

const user1 = new UserBuilder().setName('John Wick').setAge(39).build();
