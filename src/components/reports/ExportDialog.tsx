
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDialogProps {
  data: any[];
  filename: string;
  title: string;
}

export const ExportDialog = ({ data, filename, title }: ExportDialogProps) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const availableFields = data.length > 0 ? Object.keys(data[0]) : [];

  const handleFieldChange = (field: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter(f => f !== field));
    }
  };

  const exportToCSV = (data: any[], fields: string[]) => {
    const headers = fields.join(',');
    const rows = data.map(item => 
      fields.map(field => {
        const value = item[field];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const exportToJSON = (data: any[], fields: string[]) => {
    const filteredData = data.map(item => 
      fields.reduce((acc, field) => {
        acc[field] = item[field];
        return acc;
      }, {} as any)
    );
    return JSON.stringify(filteredData, null, 2);
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um campo para exportar",
        variant: "destructive"
      });
      return;
    }

    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (format) {
      case 'csv':
        content = exportToCSV(data, selectedFields);
        mimeType = 'text/csv';
        fileExtension = '.csv';
        break;
      case 'json':
        content = exportToJSON(data, selectedFields);
        mimeType = 'application/json';
        fileExtension = '.json';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportação concluída",
      description: `${title} exportado com sucesso em formato ${format.toUpperCase()}`
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Formato de Exportação</Label>
            <Select value={format} onValueChange={(value: 'csv' | 'json' | 'xlsx') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <Table className="h-4 w-4 mr-2" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Campos para Exportar</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
              {availableFields.map(field => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={selectedFields.includes(field)}
                    onCheckedChange={(checked) => handleFieldChange(field, !!checked)}
                  />
                  <Label htmlFor={field} className="text-sm capitalize">
                    {field.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setSelectedFields(availableFields)} 
              variant="outline" 
              size="sm"
            >
              Selecionar Todos
            </Button>
            <Button 
              onClick={() => setSelectedFields([])} 
              variant="outline" 
              size="sm"
            >
              Limpar Seleção
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport}>
              Exportar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
