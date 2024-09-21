# TypeSentry

![TypeSentry Logo](assets/img/logo.png)

TypeSentry is a lightweight yet powerful TypeScript library for runtime type checking and validation using decorators. It offers a simple and intuitive API for validating method parameters and complex objects, enhancing the robustness and reliability of your TypeScript applications without adding unnecessary bulk to your project. With TypeSentry, you can easily create your own custom decorators, allowing for maximum flexibility and extensibility.

Key benefits:

- 🪶 Lightweight: Minimal impact on your project's size
- 🚀 Fast: Efficient runtime type checking and validation
- 🛠 Easy to use: Intuitive decorator-based API
- 🔧 Flexible: Works with simple types and complex objects
- 🎨 Customizable: Create your own decorators with ease

[![npm version](https://badge.fury.io/js/type-sentry.svg)](https://badge.fury.io/js/type-sentry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🛡️ Runtime type checking for method parameters
- 🎨 Built-in decorators for common validations
- 🔧 Customizable validation messages
- 🚀 Seamless integration with existing TypeScript projects
- 🛠️ Easy creation of custom decorators for unique validation needs
- 🏗️ Complex object validation using class-validator
- 🔍 Lightweight core with optional integration of powerful validation libraries

## Installation

```bash
npm install type-sentry
```

For complex object validation with class-validator:

```bash
npm install type-sentry class-validator class-transformer
```

### Configuration

Enable experimental decorators in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

## Usage

### Basic Usage

```typescript
import { Validate, IsNumber, IsString } from 'type-sentry';

class UserService {
  @Validate()
  createUser(@IsNumber() age: number, @IsString() name: string) {
    console.log(`Creating user: ${name}, age: ${age}`);
  }
}

const userService = new UserService();
userService.createUser(30, "John Doe"); // Works fine
userService.createUser("30", "John Doe"); // Throws a validation error
```

### Custom Validators

One of TypeSentry's most powerful features is the ability to create custom validators:

```typescript
import { createParamValidator, Validate } from 'type-sentry';

const IsPositive = createParamValidator(
  (value) => typeof value === 'number' && value > 0,
  "Must be a positive number"
);

class MathService {
  @Validate()
  calculateSquareRoot(@IsPositive() num: number) {
    return Math.sqrt(num);
  }
}

const mathService = new MathService();
mathService.calculateSquareRoot(16); // Works fine
mathService.calculateSquareRoot(-4); // Throws a validation error
```

### Complex Object Validation

For more advanced scenarios, TypeSentry integrates with class-validator:

```typescript
import { Validate, Validator } from 'type-sentry';
import { IsEmail, Length, IsDate, MaxDate } from 'class-validator';

class UserDto {
  @IsEmail()
  email: string;

  @Length(8, 20)
  password: string;

  @IsDate()
  @MaxDate(new Date())
  birthDate: Date;
}

class UserService {
  @Validate()
  registerUser(@Validator(UserDto) user: UserDto) {
    console.log(`Registering user: ${user.email}`);
  }
}

const userService = new UserService();
userService.registerUser({
  email: "john@example.com",
  password: "securepass",
  birthDate: new Date("1990-01-01")
}); // Works fine

userService.registerUser({
  email: "invalid-email",
  password: "short",
  birthDate: new Date("2025-01-01")
}); // Throws a validation error
```

### Flexible Validator Definition

TypeSentry supports both direct class references and factory functions for defining validators. This is particularly useful for avoiding circular dependencies or when dealing with classes that aren't fully defined at decoration time.

```typescript
import { Validate, Validator } from 'type-sentry';
import { IsEmail, Length } from 'class-validator';

class UserDto {
  @IsEmail()
  email: string;

  @Length(8, 20)
  password: string;
}

class UserService {
  // Using direct class reference
  @Validate()
  registerUser(@Validator(UserDto) user: UserDto) {
    console.log(`Registering user: ${user.email}`);
  }

  // Using factory function
  @Validate()
  updateUser(@Validator(() => UserDto) user: UserDto) {
    console.log(`Updating user: ${user.email}`);
  }
}
```

## API Reference

### Decorators

- `@Validate()`: Method decorator to enable validation for a method.
- `@Validator(classOrFactory)`: Parameter decorator to validate complex objects using class-validator. Accepts either a class constructor or a factory function that returns a class constructor.
- `@IsNumber()`: Parameter decorator to validate that a parameter is a number.
- `@IsString()`: Parameter decorator to validate that a parameter is a string.

### Functions

- `createParamValidator(validator: (value: any) => boolean, defaultMessage: string)`: Creates a custom parameter validator.

## Contributing

We welcome contributions to TypeSentry! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

TypeSentry is [MIT licensed](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/NajamShehzad/type-sentry/issues).

---

Made with ❤️ by Najam Shehzad