
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInviteRequest {
  email: string;
  role: string;
  inviterName: string;
  companyName?: string;
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
    
    const { email, role, inviterName, companyName }: TeamInviteRequest = requestBody;

    // Validação dos parâmetros
    if (!email) {
      throw new Error('E-mail é obrigatório');
    }
    if (!role) {
      throw new Error('Função é obrigatória');
    }
    if (!inviterName) {
      throw new Error('Nome do convidador é obrigatório');
    }

    console.log(`Sending invite to ${email} with role ${role} from ${inviterName}`);

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

    const emailResponse = await resend.emails.send({
      from: "AgencyHub <onboarding@resend.dev>",
      to: [email],
      subject: `Convite para integrar a equipe${companyName ? ` da ${companyName}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite para a equipe</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              🎉 Você foi convidado!
            </h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">
              Olá! 👋
            </p>
            
            <p style="font-size: 16px; margin-bottom: 24px;">
              <strong>${inviterName}</strong> convidou você para fazer parte da equipe${companyName ? ` da <strong>${companyName}</strong>` : ''} no <strong>AgencyHub</strong>.
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0; font-size: 16px;">
                <strong>Sua função:</strong> ${getRoleLabel(role)}
              </p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 32px;">
              O AgencyHub é uma plataforma completa para gestão de agências, onde você poderá gerenciar clientes, oportunidades, tarefas, contratos e muito mais!
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token_hash=invite&type=invite&redirect_to=${encodeURIComponent('https://preview--agencyhub-reborn-project.lovable.app/auth')}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
                ✨ Aceitar Convite e Criar Conta
              </a>
            </div>
            
            <div style="background: #fef3cd; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>⏰ Importante:</strong> Este convite é válido por 48 horas. Se você não conseguir acessar o link, entre em contato com ${inviterName}.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
            
            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">
              <strong>O que você pode fazer no AgencyHub:</strong>
            </p>
            
            <ul style="font-size: 14px; color: #64748b; margin-left: 20px;">
              <li>Gerenciar clientes e relacionamentos</li>
              <li>Acompanhar oportunidades de negócio</li>
              <li>Organizar tarefas e projetos</li>
              <li>Controlar contratos e financeiro</li>
              <li>Gerar relatórios e insights</li>
              <li>Criar estratégias com IA</li>
            </ul>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 32px; text-align: center;">
              Se você não solicitou este convite, pode ignorar este email com segurança.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">
              AgencyHub - Gestão Inteligente para Agências
            </p>
          </div>
          
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", JSON.stringify(emailResponse, null, 2));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Convite enviado com sucesso',
      emailResponse 
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
        details: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
