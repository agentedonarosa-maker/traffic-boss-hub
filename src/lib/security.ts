/**
 * Máscara de dados sensíveis para logs
 * Previne exposição de credenciais em console logs
 */
export const maskSensitiveData = (obj: any): any => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const masked = { ...obj };
  const sensitiveKeys = [
    'access_token',
    'refresh_token',
    'client_secret',
    'password',
    'api_key',
    'developer_token',
    'advertiser_id',
    'credentials'
  ];

  for (const key of sensitiveKeys) {
    if (masked[key]) {
      masked[key] = '***MASKED***';
    }
  }

  // Recursivamente mascarar objetos aninhados
  for (const key in masked) {
    if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
};

/**
 * Log seguro que mascara automaticamente dados sensíveis
 */
export const secureLog = (message: string, data?: any) => {
  if (data) {
    console.log(message, maskSensitiveData(data));
  } else {
    console.log(message);
  }
};