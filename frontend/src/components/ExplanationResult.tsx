import React from 'react';
import type { ExplanationResponse } from '../api';
import { BookOpen, Zap, Activity, Eye, FlaskConical, ArrowRight } from 'lucide-react';

interface Props {
    data: ExplanationResponse;
}

const ExplanationResult: React.FC<Props> = ({ data }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section: Simple Explanation */}
            <div className="glass-panel border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="icon-box text-blue-400">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-bold">What's Happening?</h2>
                </div>
                <p className="text-xl leading-relaxed text-gray-100">
                    {data.simple_explanation}
                </p>
            </div>

            <div className="card-grid">
                {/* Analogy */}
                <div className="glass-panel transform transition hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="icon-box text-purple-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Think of it like...</h3>
                    </div>
                    <p className="text-lg italic text-gray-300">
                        "{data.analogy}"
                    </p>
                </div>

                {/* Visual Model */}
                <div className="glass-panel transform transition hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="icon-box text-green-400">
                            <Eye size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Visual Model</h3>
                    </div>
                    <pre className="text-sm text-green-300 whitespace-pre-wrap font-mono">
                        {data.visual_model.diagram_content}
                    </pre>
                    <p className="mt-2 text-sm text-gray-400">
                        {data.visual_model.description}
                    </p>
                </div>
            </div>

            {/* Scientific Deep Dive */}
            <div className="glass-panel">
                <div className="flex items-center gap-3 mb-6">
                    <div className="icon-box text-red-400">
                        <Activity size={24} />
                    </div>
                    <h2 className="text-2xl font-bold">The Science Behind It</h2>
                </div>

                <div className="grid gap-6">
                    {data.scientific_explanation.map((exp, idx) => (
                        <div key={idx} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h4 className="text-lg font-semibold text-blue-300 mb-2">{exp.principle} ({exp.domain})</h4>
                            <p className="text-gray-300 mb-4">{exp.reasoning}</p>
                            <div className="flex flex-wrap gap-2">
                                {exp.forces_involved.map((force, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300">
                                        {force}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step by Step & Experiment */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ArrowRight className="text-yellow-400" /> Process Breakdown
                    </h3>
                    <ul className="space-y-3">
                        {data.step_by_step.map((step, i) => (
                            <li key={i} className="flex gap-3 text-gray-300">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-blue-400">
                                    {i + 1}
                                </span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-panel border-t-4 border-green-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="icon-box text-green-400">
                            <FlaskConical size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Try It At Home: {data.experiment.experiment_name}</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-2">Materials</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.experiment.materials.map((m, i) => (
                                    <span key={i} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-sm">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-2">Steps</h4>
                            <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                                {data.experiment.steps.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ol>
                        </div>

                        <div className="bg-red-900/20 border border-red-900/50 p-3 rounded text-red-200 text-sm flex gap-2">
                            <span className="font-bold">⚠️ Safety:</span>
                            {data.experiment.safety_note}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplanationResult;
