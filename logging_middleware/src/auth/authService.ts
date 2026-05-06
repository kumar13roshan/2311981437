import type { AxiosInstance } from 'axios';
import type { LoggerConfig } from '../config/loggerConfig';

interface AuthResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
  expires_in?: number;
  expiresIn?: number;
}

export class AuthService {
  private token: string | null = null;

  private tokenExpiresAt = 0;

  private clientID?: string;

  private clientSecret?: string;

  constructor(
    private readonly config: LoggerConfig,
    private readonly client: AxiosInstance,
  ) {
    this.clientID = config.clientID;
    this.clientSecret = config.clientSecret;
  }

  async register(): Promise<{ clientID: string; clientSecret: string }> {
    const payload = {
      email: this.requireValue('email'),
      name: this.requireValue('name'),
      mobileNo: this.requireValue('mobileNo'),
      githubUsername: this.requireValue('githubUsername'),
      rollNo: this.requireValue('rollNo'),
      accessCode: this.requireValue('accessCode'),
    };

    const response = await this.client.post(this.config.registerPath, payload);
    const clientID = response.data?.clientID || response.data?.clientId || response.data?.client_id;
    const clientSecret = response.data?.clientSecret || response.data?.client_secret;

    if (!clientID || !clientSecret) {
      throw new Error('Registration response did not include client credentials');
    }

    this.clientID = clientID;
    this.clientSecret = clientSecret;
    return { clientID, clientSecret };
  }

  async getToken(forceRefresh = false): Promise<string> {
    if (!forceRefresh && this.token && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }

    if (!this.clientID || !this.clientSecret) {
      await this.register();
    }

    const payload = {
      email: this.requireValue('email'),
      name: this.requireValue('name'),
      rollNo: this.requireValue('rollNo'),
      accessCode: this.requireValue('accessCode'),
      clientID: this.clientID,
      clientSecret: this.clientSecret,
    };

    const response = await this.client.post<AuthResponse>(this.config.authPath, payload);
    const token = response.data.access_token || response.data.accessToken || response.data.token;

    if (!token) {
      throw new Error('Authentication response did not include an access token');
    }

    const ttlSeconds = Number(response.data.expires_in || response.data.expiresIn || 1800);
    this.token = token;
    this.tokenExpiresAt = Date.now() + ttlSeconds * 1000 - 30_000;
    return token;
  }

  clearToken(): void {
    this.token = null;
    this.tokenExpiresAt = 0;
  }

  private requireValue(key: keyof LoggerConfig): string {
    const value = this.config[key];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Missing logger credential: ${String(key)}`);
    }
    return value.trim();
  }
}
