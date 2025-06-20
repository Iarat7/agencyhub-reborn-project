
// Interface base para todos os serviços de API
// Permite trocar facilmente o backend no futuro
export interface IBaseApi {
  // Métodos CRUD genéricos
  get<T>(id: string): Promise<T | null>;
  list<T>(filters?: Record<string, any>): Promise<T[]>;
  create<T>(data: Partial<T>): Promise<T | null>;
  update<T>(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface IAuthApi {
  signUp(email: string, password: string, userData?: any): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<any>;
  onAuthStateChange(callback: (user: any) => void): () => void;
  resetPassword(email: string): Promise<any>;
}

export interface IFileApi {
  upload(file: File, path: string): Promise<string | null>;
  delete(path: string): Promise<boolean>;
  getPublicUrl(path: string): string;
}
