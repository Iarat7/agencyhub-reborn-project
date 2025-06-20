
import { SupabaseApi, SupabaseFileApi } from './supabaseApi';
import { ContractAttachment } from './types';
import { supabase } from '@/integrations/supabase/client';

export class ContractAttachmentsApi extends SupabaseApi<ContractAttachment> {
  private fileApi: SupabaseFileApi;

  constructor() {
    super('contract_attachments');
    this.fileApi = new SupabaseFileApi('contract-attachments');
  }

  async uploadFile(contractId: string, file: File): Promise<ContractAttachment | null> {
    try {
      // Gerar path único para o arquivo
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');
      
      const timestamp = Date.now();
      const filePath = `${userId}/${contractId}/${timestamp}-${file.name}`;
      
      // Upload do arquivo
      const uploadedPath = await this.fileApi.upload(file, filePath);
      if (!uploadedPath) {
        throw new Error('Failed to upload file');
      }

      // Criar registro no banco
      const attachmentData = {
        contract_id: contractId,
        file_name: file.name,
        file_path: uploadedPath,
        file_size: file.size,
        file_type: file.type,
      };

      return await this.create<ContractAttachment>(attachmentData);
    } catch (error) {
      console.error('Error uploading contract attachment:', error);
      return null;
    }
  }

  async deleteFile(attachmentId: string): Promise<boolean> {
    try {
      // Buscar o anexo para obter o caminho do arquivo
      const attachment = await this.get<ContractAttachment>(attachmentId);
      if (!attachment) return false;

      // Deletar arquivo do storage
      await this.fileApi.delete(attachment.file_path);

      // Deletar registro do banco
      return await this.delete(attachmentId);
    } catch (error) {
      console.error('Error deleting contract attachment:', error);
      return false;
    }
  }

  async getByContractId(contractId: string): Promise<ContractAttachment[]> {
    return await this.list<ContractAttachment>({ contract_id: contractId });
  }

  getFileUrl(filePath: string): string {
    return this.fileApi.getPublicUrl(filePath);
  }
}
