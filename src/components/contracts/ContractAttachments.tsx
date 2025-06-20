
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paperclip, Upload, Trash2, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contractAttachmentsService } from '@/services';
import { ContractAttachment } from '@/services/api/types';

interface ContractAttachmentsProps {
  contractId: string;
  attachments: ContractAttachment[];
  onAttachmentsChange: () => void;
}

export const ContractAttachments = ({ 
  contractId, 
  attachments, 
  onAttachmentsChange 
}: ContractAttachmentsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await contractAttachmentsService.uploadFile(contractId, file);
        if (!result) {
          toast({
            title: 'Erro',
            description: `Erro ao fazer upload do arquivo ${file.name}`,
            variant: 'destructive',
          });
        }
      }
      
      toast({
        title: 'Sucesso',
        description: 'Arquivo(s) enviado(s) com sucesso!',
      });
      
      onAttachmentsChange();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload dos arquivos',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Limpar o input
      event.target.value = '';
    }
  }, [contractId, onAttachmentsChange, toast]);

  const handleDelete = async (attachmentId: string, fileName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${fileName}"?`)) {
      return;
    }

    try {
      const success = await contractAttachmentsService.deleteFile(attachmentId);
      if (success) {
        toast({
          title: 'Sucesso',
          description: 'Arquivo excluído com sucesso!',
        });
        onAttachmentsChange();
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao excluir arquivo',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir arquivo',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (attachment: ContractAttachment) => {
    const fileUrl = contractAttachmentsService.getFileUrl(attachment.file_path);
    window.open(fileUrl, '_blank');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    
    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    } else {
      return `${kb.toFixed(1)} KB`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Anexos do Contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {isUploading ? 'Enviando...' : 'Selecionar Arquivos'}
            </Button>
          </div>
        </div>

        {/* Attachments List */}
        {attachments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Nenhum anexo encontrado
          </p>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{attachment.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attachment.id, attachment.file_name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
