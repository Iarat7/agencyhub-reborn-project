
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInviteRequest {
  email: string;
  role: string;
  organizationId: string;
  inviterName: string;
  organizationName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send team invite function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing team invite request...");
    
    const requestBody = await req.json();
    console.log("Request body received:", JSON.stringify(requestBody, null, 2));
    
    const { email, role, organizationId, inviterName, organizationName }: TeamInviteRequest = requestBody;

    // Validação dos parâmetros
    if (!email || !role || !organizationId || !inviterName) {
      throw new Error('Parâmetros obrigatórios faltando');
    }

    console.log(`Sending invite to ${email} for organization ${organizationId} with role ${role}`);

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se já existe convite pendente
    const { data: existingInvite } = await supabase
      .from('organization_invites')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', email.toLowerCase().trim())
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      throw new Error('Já existe um convite pendente para este email nesta organização');
    }

    // Gerar token único para o convite
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    // Criar convite no banco
    const { error: inviteError } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: organizationId,
        email: email.toLowerCase().trim(),
        role: role,
        token: inviteToken,
        invited_by: req.headers.get('user-id'), // Assumindo que o user ID vem no header
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      });

    if (inviteError) {
      console.error('Error creating invite:', inviteError);
      throw new Error('Erro ao criar convite no banco de dados');
    }

    // Verificar se a chave API do Resend está disponível
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in environment variables");
      throw new Error("Configuração de e-mail não encontrada");
    }

    console.log("Resend API key found, proceeding with email send...");

    const getRoleLabel = (roleValue: string) => {
      switch (roleValue) {
        case 'admin': return 'Administrador';
        case 'manager': return 'Gerente';
        case 'user': return 'Usuário';
        default: return 'Usuário';
      }
    };

    // URL de convite para o sistema
    const baseUrl = 'https://00a493c4-9eee-4344-96d7-51298ea6a659.lovableproject.com';
    const inviteUrl = `${baseUrl}/auth?invite_token=${inviteToken}&email=${encodeURIComponent(email)}`;

    console.log("Invite URL generated:", inviteUrl);

    const emailResponse = await resend.emails.send({
      from: "InflowHub <noreply@bushdigital.com.br>",
      to: [email],
      subject: `🎉 Convite para integrar a equipe${organizationName ? ` da ${organizationName}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite para a equipe</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              🎉 Você foi convidado!
            </h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px; color: #333;">
              Olá! 👋
            </p>
            
            <p style="font-size: 16px; margin-bottom: 24px; color: #555;">
              <strong>${inviterName}</strong> convidou você para fazer parte da equipe${organizationName ? ` da <strong>${organizationName}</strong>` : ''} no <strong>InflowHub</strong>.
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0; font-size: 16px; color: #333;">
                <strong>🎯 Sua função:</strong> ${getRoleLabel(role)}
              </p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 32px; color: #555;">
              O InflowHub é uma plataforma completa para gestão empresarial, onde você poderá gerenciar clientes, oportunidades, tarefas, contratos e muito mais!
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${inviteUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                ✨ Aceitar Convite
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #ffeaa7;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>⏰ Importante:</strong> Este convite é válido por 7 dias. Se você não conseguir acessar o link, entre em contato com ${inviterName}.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
            
            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">
              <strong>💼 O que você pode fazer no InflowHub:</strong>
            </p>
            
            <ul style="font-size: 14px; color: #64748b; margin-left: 20px; padding-left: 0;">
              <li style="margin-bottom: 8px;">📊 Gerenciar clientes e relacionamentos</li>
              <li style="margin-bottom: 8px;">🎯 Acompanhar oportunidades de negócio</li>
              <li style="margin-bottom: 8px;">✅ Organizar tarefas e projetos</li>
              <li style="margin-bottom: 8px;">📋 Controlar contratos e financeiro</li>
              <li style="margin-bottom: 8px;">📈 Gerar relatórios e insights</li>
              <li style="margin-bottom: 8px;">🤖 Criar estratégias com IA</li>
            </ul>
            
            <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #bae6fd;">
              <p style="margin: 0; font-size: 14px; color: #0369a1;">
                <strong>🔗 Link alternativo:</strong><br/>
                Se o botão não funcionar, copie e cole este link no seu navegador:<br/>
                <code style="word-break: break-all; background: #e0f2fe; padding: 4px 8px; border-radius: 4px;">${inviteUrl}</code>
              </p>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 32px; text-align: center;">
              Se você não solicitou este convite, pode ignorar este email com segurança.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">
              InflowHub - Gestão Inteligente para Empresas<br/>
              <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">Acesse nossa plataforma</a>
            </p>
          </div>
          
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Erro ao enviar email: ${emailResponse.error.message || 'Erro desconhecido'}`);
    }

    console.log("Email sent successfully with ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Convite enviado com sucesso',
      emailId: emailResponse.data?.id,
      inviteUrl: inviteUrl,
      inviteToken: inviteToken
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-team-invite function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
