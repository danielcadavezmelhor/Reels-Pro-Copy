
export interface CopyInputs {
  subject: string;
  attentionQuestion: string;
  keyword: string;
}

export interface GeneratedCopy {
  fullText: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
