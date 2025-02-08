import { supabase } from '../lib/supabase';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Test the API connection
  async testConnection() {
    return this.request('/health');
  }

  // Verify authentication
  async verifyAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  // Test database connection
  async testDatabase() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    return { success: !error, error };
  }
}

export const apiService = new ApiService();