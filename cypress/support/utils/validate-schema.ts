import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();

addFormats(ajv);

interface ValidateSchemaProps<T extends object = object> {
  schemaName?: string;
  data: T;
  schema: object;
}

export function validateSchema<T extends object = object>({
  data,
  schema,
  schemaName,
}: ValidateSchemaProps<T>): void {
  const validate = ajv.compile(schema);

  const isValid = validate(data);

  expect(isValid, `${schemaName || "Schema"} validation failed`).to.equal(true);

  if (!isValid) {
    console.error(validate.errors);
  }
}
