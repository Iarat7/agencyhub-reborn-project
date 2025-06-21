
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye,
  EyeOff,
  Key,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const APIKeysManager = () => {
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Integração Mobile App',
      key: 'crm_live_abc123def456ghi789',
      permissions: ['read:clients', 'write:opportunities'],
      created: '2024-01-10T08:00:00Z',
      lastUsed: '2024-01-15T14:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Dashboard Analytics',
      key: 'crm_live_xyz987uvw654rst321',
      permissions: ['read:reports', 'read:metrics'],
      created: '2024-01-08T10:15:00Z',
      lastUsed: '2024-01-15T12:45:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Backup Service',
      key: 'crm_live_backup123export456',
      permissions: ['read:all'],
      created: '2024-01-05T16:20:00Z',
      lastUsed: null,
      status: 'inactive'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [newKey, setNewKey] = useState({
    name: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    'read:clients',
    'write:clients',
    'read:opportunities',
    'write:opportunities',
    'read:tasks',
    'write:tasks',
    'read:reports',
    'read:metrics',
    'read:all',
    'write:all'
  ];

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => 
      prev.includes(keyId) 
        ? prev.filter(id => id !== keyId)
        : [...prev, keyId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'Chave API copiada para a área de transferência',
    });
  };

  const handleCreateKey = () => {
    if (newKey.name && newKey.permissions.length > 0) {
      const apiKey = {
        id: Date.now().toString(),
        name: newKey.name,
        key: `crm_live_${Math.random().toString(36).substr(2, 20)}`,
        permissions: newKey.permissions,
        created: new Date().toISOString(),
        lastUsed: null,
        status: 'active'
      };
      setApiKeys([...apiKeys, apiKey]);
      setNewKey({ name: '', permissions: [] });
      setIsCreating(false);
      
      toast({
        title: 'Chave API criada',
        description: 'Nova chave API foi gerada com sucesso',
      });
    }
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast({
      title: 'Chave removida',
      description: 'A chave API foi removida permanentemente',
    });
  };

  const togglePermission = (permission: string) => {
    const permissions = newKey.permissions.includes(permission)
      ? newKey.permissions.filter(p => p !== permission)
      : [...newKey.permissions, permission];
    setNewKey({ ...newKey, permissions });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 8) + '*'.repeat(key.length - 16) + key.slice(-8);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Chaves API</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie chaves de acesso para integrações externas
              </p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Chave
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Chave API</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="key-name">Nome da Chave</Label>
                    <Input
                      id="key-name"
                      value={newKey.name}
                      onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                      placeholder="Ex: Mobile App Integration"
                    />
                  </div>
                  
                  <div>
                    <Label>Permissões</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availablePermissions.map((permission) => (
                        <Button
                          key={permission}
                          variant={newKey.permissions.includes(permission) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => togglePermission(permission)}
                          className="text-xs"
                        >
                          {permission}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateKey}>
                      Criar Chave
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Nenhuma chave API</h3>
              <p className="text-muted-foreground">
                Crie chaves API para integrar com sistemas externos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Segurança das Chaves</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Mantenha suas chaves seguras. Não compartilhe ou exponha em código público.
                      Revogue chaves comprometidas imediatamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Chave</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Uso</TableHead>
                      <TableHead className="w-[120px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{apiKey.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Criada em {new Date(apiKey.created).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted p-1 rounded">
                              {visibleKeys.includes(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {visibleKeys.includes(apiKey.id) ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.permissions.slice(0, 2).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {apiKey.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{apiKey.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(apiKey.status)}>
                            {apiKey.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {apiKey.lastUsed 
                              ? new Date(apiKey.lastUsed).toLocaleString('pt-BR')
                              : 'Nunca'
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteKey(apiKey.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
