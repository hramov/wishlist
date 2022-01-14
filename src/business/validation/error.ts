export class ValidationError extends Error {
  constructor(private readonly msg: string) {
    super(`Error type: ValidationError. Error message: ${msg}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InnerError extends Error {
  constructor(private readonly msg: string) {
    super(`Error type: InnerError. Error message: ${msg}`);
  }
}

export class DatabaseError extends Error {
    constructor(private readonly msg: string) {
      super(`Error type: DatabaseError. Error message: ${msg}`);
    }
  }
