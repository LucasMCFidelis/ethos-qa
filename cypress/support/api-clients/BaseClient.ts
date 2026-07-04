import { getApiUrl } from "../utils/get-api-url";

export abstract class BaseClient {
  protected readonly baseUrl = getApiUrl();
}
