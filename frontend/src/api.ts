import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export interface ExplainRequest {
    query: string;
    model_provider?: string;
    model_name?: string;
}

export interface ModelInfo {
    provider: string;
    name: string;
    label: string;
}

export interface ModelListResponse {
    models: ModelInfo[];
}

export interface VisualModel {
    diagram_content: string;
    description: string;
}

export interface Experiment {
    experiment_name: string;
    materials: string[];
    steps: string[];
    safety_note: string;
}

export interface ScientificExplanation {
    domain: string;
    principle: string;
    reasoning: string;
    forces_involved: string[];
}

export interface ExplanationResponse {
    simple_explanation: string;
    scientific_explanation: ScientificExplanation[];
    step_by_step: string[];
    analogy: string;
    visual_model: VisualModel;
    experiment: Experiment;
}

export const getModels = async (): Promise<ModelInfo[]> => {
    const response = await api.get<ModelListResponse>('/models');
    return response.data.models;
};

export const explainIt = async (query: string, modelProvider?: string, modelName?: string): Promise<ExplanationResponse> => {
    const response = await api.post<ExplanationResponse>('/explain', {
        query,
        model_provider: modelProvider,
        model_name: modelName
    });
    return response.data;
};

export interface SurpriseResponse {
    questions: string[];
}

export const getSurpriseQuestions = async (modelProvider?: string, modelName?: string): Promise<string[]> => {
    // We send a dummy query because the backend expects an ExplainRequest body
    const response = await api.post<SurpriseResponse>('/surprise', {
        query: "surprise me",
        model_provider: modelProvider,
        model_name: modelName
    });
    return response.data.questions;
};
