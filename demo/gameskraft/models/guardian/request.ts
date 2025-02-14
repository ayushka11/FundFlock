
export interface GuardianCreateTaskRequestPayload {
    taskId?: string;
    userId?: string;
    documentType?: number;
    method?: number;
};

interface DigilockerAadharStateConfig {
    state: string,
};

export interface GuardianDigilockerTaskRequestPayload {
    taskId: string,
    documentDetails: DigilockerAadharStateConfig
};

