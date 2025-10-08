import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  supabase_url: string
  token_hash: string
  redirect_to: string
  email: string
}

export const ConfirmationEmail = ({
  supabase_url,
  token_hash,
  redirect_to,
  email,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirme seu email para acessar o TrafficPro</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Bem-vindo ao TrafficPro!</Heading>
        
        <Text style={text}>
          Olá!
        </Text>
        
        <Text style={text}>
          Sua conta foi criada com sucesso! Para começar a usar o TrafficPro e gerenciar suas campanhas de tráfego pago, precisamos confirmar seu email.
        </Text>
        
        <Section style={buttonContainer}>
          <Link
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=signup&redirect_to=${redirect_to}`}
            style={button}
          >
            Confirmar Email
          </Link>
        </Section>
        
        <Text style={text}>
          Ou copie e cole este link no seu navegador:
        </Text>
        
        <Text style={link}>
          {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=signup&redirect_to=${redirect_to}`}
        </Text>
        
        <Text style={{ ...text, marginTop: '32px', color: '#666' }}>
          Se você não criou uma conta no TrafficPro, pode ignorar este email com segurança.
        </Text>
        
        <Section style={footer}>
          <Text style={footerText}>
            <strong>TrafficPro</strong> - Gestão Profissional de Campanhas
          </Text>
          <Text style={footerText}>
            📊 Dashboards em tempo real • 📈 Analytics avançados • 🤖 Automações inteligentes
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)',
}

const link = {
  color: '#667eea',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  padding: '0 40px',
  display: 'block',
}

const footer = {
  borderTop: '1px solid #eaeaea',
  marginTop: '32px',
  paddingTop: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
  padding: '0 40px',
}
