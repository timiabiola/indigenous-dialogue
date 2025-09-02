import { NationDecision } from '@/components/dashboard/InlineDecisionEditor';

export interface EmailRequest {
  id: string;
  company: string;
  project: string;
  decision: NationDecision | null;
  contactEmail?: string;
  deadline: Date;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
  emailId?: string;
}

/**
 * Send decision email to consultation company
 * Currently simulates the API call - ready for N8N webhook integration
 */
export async function sendDecisionEmail(consultation: EmailRequest): Promise<EmailResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate occasional errors for testing
  const shouldError = Math.random() < 0.1; // 10% error rate for testing
  
  if (shouldError) {
    return {
      success: false,
      error: 'Failed to send email. Please try again.'
    };
  }
  
  // Simulate successful response
  return {
    success: true,
    emailId: `email_${consultation.id}_${Date.now()}`
  };
}

/**
 * Future N8N integration endpoint
 * Replace the above simulation with actual webhook call
 */
export async function sendN8NWebhook(consultation: EmailRequest): Promise<EmailResponse> {
  // const n8nWebhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL;
  // 
  // if (!n8nWebhookUrl) {
  //   throw new Error('N8N webhook URL not configured');
  // }
  
  // const response = await fetch(n8nWebhookUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     consultationId: consultation.id,
  //     company: consultation.company,
  //     project: consultation.project,
  //     decision: consultation.decision,
  //     contactEmail: consultation.contactEmail,
  //     deadline: consultation.deadline.toISOString(),
  //     timestamp: new Date().toISOString()
  //   })
  // });
  
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`);
  // }
  
  // const result = await response.json();
  // return result;
  
  // For now, use the simulation
  return sendDecisionEmail(consultation);
}