import { Validate, Validator, IsNumber, IsString, createParamValidator } from '../src';
import { IsEmail, IsNotEmpty } from "class-validator";

const IsPositiveNumber  = createParamValidator(
  (value: any) => typeof value === "number" && value > 0,
  "Value must be a positive number"
);

class DataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class ExampleClass {
  @Validate()
  exampleMethod(
    @IsNumber() num,
    @IsString("Custom string message") str
  ) {
    console.log(`Received: number = ${num}, string = ${str}`);
    return `${num} - ${str}`;
  }

  @Validate()
  exampleMethod2(@Validator(() => DataDto) data: DataDto) {
    console.log(`Received: data = ${JSON.stringify(data)}`);
    return data;
  }

  @Validate()
  exampleMethod3(@IsPositiveNumber() num) {
    console.log(`Received: number = ${num}`);
    return num;
  }
}

// Test
console.log("Creating instance of ExampleClass");
const instance = new ExampleClass();

console.log("\nTesting exampleMethod:");
console.log("Calling with valid arguments:");
console.log(instance.exampleMethod(42, "test")); // Should work

console.log("\nCalling with invalid arguments:");
try {
  console.log(instance.exampleMethod("not a number" as any, 42 as any)); // Should throw an error
} catch (error: any) {
  console.log("Caught error:", error.message);
}

console.log("\nTesting exampleMethod2:");
console.log("Calling with valid arguments:");
console.log(
  instance.exampleMethod2({
    email: "test@test.com",
  } as DataDto)
); // Should work

console.log("\nCalling with invalid arguments:");
try {
  console.log(
    instance.exampleMethod2({
      email: "not-an-email",
    } as DataDto)
  ); // Should throw an error
} catch (error: any) {
  console.log("Caught error:", error.message);
}

console.log("\nTesting exampleMethod3:");
console.log("Calling with valid arguments:");
console.log(instance.exampleMethod3(42)); // Should work

console.log("\nCalling with invalid arguments:");
try {
  console.log(instance.exampleMethod3(-1)); // Should throw an error
}
catch (error: any) {
  console.log("Caught error:", error.message);
}