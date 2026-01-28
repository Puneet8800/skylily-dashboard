// Pulsed API client

const PULSED_URL = process.env.NEXT_PUBLIC_PULSED_URL || 'http://localhost:9876';

export interface HealthResponse {
  status: string;
  version: string;
  uptime_secs: number;
}

export interface SystemMetrics {
  cpu_usage: number;
  cpu_count: number;
  memory_used: number;
  memory_total: number;
  memory_percent: number;
  disk_used: number;
  disk_total: number;
  disk_percent: number;
  load_avg: [number, number, number];
  uptime_secs: number;
  temperatures?: { label: string; celsius: number }[];
}

export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  created: number;
  ports?: string[];
  cpu_percent?: number;
  memory_usage?: number;
  memory_limit?: number;
}

export interface DockerResponse {
  containers: Container[];
  running: number;
  total: number;
}

export interface TailscaleDevice {
  name: string;
  ip: string;
  online: boolean;
  os?: string;
  last_seen?: string;
}

export interface TailscaleResponse {
  devices: TailscaleDevice[];
  online_count: number;
}

export interface NetworkInterface {
  name: string;
  ip?: string;
  mac?: string;
  rx_bytes: number;
  tx_bytes: number;
}

export interface NetworkResponse {
  interfaces: NetworkInterface[];
}

export interface ServiceCheck {
  name: string;
  url: string;
  status: string;
  latency_ms?: number;
  last_check: string;
}

export interface ServicesResponse {
  services: ServiceCheck[];
  healthy: number;
  total: number;
}

class PulsedClient {
  private baseUrl: string;

  constructor(baseUrl: string = PULSED_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Pulsed API error: ${response.status}`);
    }

    return response.json();
  }

  async health(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/health');
  }

  async system(): Promise<SystemMetrics> {
    return this.fetch<SystemMetrics>('/api/v1/system');
  }

  async docker(): Promise<DockerResponse> {
    return this.fetch<DockerResponse>('/api/v1/docker');
  }

  async dockerLogs(containerId: string, lines: number = 100): Promise<{ container: string; lines: string[] }> {
    return this.fetch(`/api/v1/docker/${containerId}/logs?lines=${lines}`);
  }

  async dockerRestart(containerId: string): Promise<{ status: string; container: string }> {
    return this.fetch(`/api/v1/docker/${containerId}/restart`, { method: 'POST' });
  }

  async tailscale(): Promise<TailscaleResponse> {
    return this.fetch<TailscaleResponse>('/api/v1/tailscale');
  }

  async network(): Promise<NetworkResponse> {
    return this.fetch<NetworkResponse>('/api/v1/network');
  }

  async services(): Promise<ServicesResponse> {
    return this.fetch<ServicesResponse>('/api/v1/services');
  }
}

export const pulsed = new PulsedClient();
export default pulsed;
