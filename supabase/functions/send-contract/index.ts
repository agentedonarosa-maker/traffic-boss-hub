import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContractEmailRequest {
  clientName: string;
  clientEmail: string;
  contractContent: string;
  managerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientName, clientEmail, contractContent, managerName }: ContractEmailRequest = await req.json();

    console.log("Enviando contrato para:", clientEmail);

    const emailResponse = await resend.emails.send({
      from: "TrafficPro <onboarding@resend.dev>",
      to: [clientEmail],
      subject: `Contrato de Gestão de Tráfego - ${clientName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 30px;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 10px;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 30px;
              padding: 20px;
              background: #f0f0f0;
              border-radius: 10px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📄 Contrato de Gestão de Tráfego</h1>
            <p>TrafficPro - Gestão Profissional de Campanhas</p>
          </div>
          
          <p>Olá, <strong>${clientName}</strong>!</p>
          
          <p>Segue abaixo o contrato para análise e aprovação:</p>
          
          <div class="content">
            ${contractContent}
          </div>
          
          <div class="footer">
            <p>Este contrato foi enviado por <strong>${managerName}</strong></p>
            <p>Para qualquer dúvida, entre em contato conosco.</p>
            <p><strong>TrafficPro</strong> - Sua parceira em gestão de tráfego</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar contrato:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
