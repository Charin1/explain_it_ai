import React from 'react';
import type { ExplanationResponse } from '../api';
import { Zap, Eye, FlaskConical, ArrowRight, Lightbulb, Beaker, Shield, BookOpen } from 'lucide-react';

interface Props {
    data: ExplanationResponse;
}

const ExplanationResult: React.FC<Props> = ({ data }) => {
    return (
        <div className="space-y-10">

            {/* ═══════════════════════════════════════════════════════════
                HERO SUMMARY - The main takeaway
            ═══════════════════════════════════════════════════════════ */}
            <section className="animate-fade-in-up">
                <div className="glass-panel-premium rounded-2xl p-8 relative overflow-hidden group">
                    {/* Accent glow */}
                    <div
                        className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                        style={{ background: 'radial-gradient(circle, hsla(173, 80%, 45%, 0.4) 0%, transparent 70%)' }}
                    />

                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-cyan-500/50 rounded-l-2xl" />

                    <div className="relative z-10 pl-4">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="icon-container bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/20">
                                <Lightbulb size={20} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-white">The Simple Truth</h2>
                        </div>
                        <p className="text-xl md:text-2xl leading-relaxed text-slate-200 font-light">
                            {data.simple_explanation}
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                TWO COLUMN GRID - Analogy & Visual Model
            ═══════════════════════════════════════════════════════════ */}
            <section className="grid md:grid-cols-2 gap-6">

                {/* Analogy Card */}
                <div className="glass-panel-premium rounded-2xl p-7 group flex flex-col animate-fade-in-up delay-100">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-b-full opacity-70" />

                    <div className="flex items-center gap-3 mb-5">
                        <div className="icon-container bg-purple-500/15 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Think of it like...</h3>
                    </div>

                    <div className="flex-grow relative">
                        <div className="absolute -inset-3 bg-purple-500/5 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <blockquote className="relative text-lg italic text-purple-200/90 leading-relaxed border-l-2 border-purple-500/30 pl-4">
                            "{data.analogy}"
                        </blockquote>
                    </div>
                </div>

                {/* Visual Model Card */}
                <div className="glass-panel-premium rounded-2xl p-7 group flex flex-col animate-fade-in-up delay-200">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-b-full opacity-70" />

                    <div className="flex items-center gap-3 mb-5">
                        <div className="icon-container bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Eye size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Mental Image</h3>
                    </div>

                    <div className="flex-grow flex flex-col">
                        <div className="bg-slate-950/60 rounded-xl p-5 border border-white/5 font-mono text-sm text-emerald-400 whitespace-pre-wrap shadow-inner overflow-x-auto flex-grow">
                            {data.visual_model.diagram_content}
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mt-4">
                            {data.visual_model.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION DIVIDER - Scientific Foundations
            ═══════════════════════════════════════════════════════════ */}
            <div className="section-divider animate-fade-in-up delay-300">
                <div className="flex items-center gap-3 px-4">
                    <BookOpen size={18} className="text-blue-400" />
                    <span className="uppercase tracking-widest text-xs font-bold text-slate-400">
                        Scientific Foundations
                    </span>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                SCIENTIFIC EXPLANATIONS - Stacked cards
            ═══════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
                {data.scientific_explanation.map((exp, idx) => (
                    <div
                        key={idx}
                        className="glass-panel-premium rounded-xl p-6 group hover:translate-x-1 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${300 + idx * 100}ms` }}
                    >
                        {/* Left accent bar */}
                        <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full" />

                        <div className="pl-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                <h4 className="text-lg font-bold text-blue-200">{exp.principle}</h4>
                                <span className="inline-flex px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/20 text-blue-300 text-xs font-medium uppercase tracking-wider w-fit">
                                    {exp.domain}
                                </span>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-4">{exp.reasoning}</p>

                            <div className="flex flex-wrap gap-2">
                                {exp.forces_involved.map((force, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs text-slate-400 border border-slate-700/50"
                                    >
                                        {force}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ═══════════════════════════════════════════════════════════
                TWO COLUMN GRID - Step by Step & Experiment
            ═══════════════════════════════════════════════════════════ */}
            <section className="grid md:grid-cols-2 gap-6 pt-4">

                {/* Step by Step Process */}
                <div className="glass-panel-premium rounded-2xl p-7 flex flex-col animate-fade-in-up delay-400">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="icon-container bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                            <ArrowRight size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">How it Works</h3>
                    </div>

                    <div className="space-y-4 flex-grow">
                        {data.step_by_step.map((step, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-600/50 flex items-center justify-center text-sm font-bold text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-400 transition-all duration-300">
                                    {i + 1}
                                </div>
                                <p className="text-slate-300 pt-1 group-hover:text-slate-100 transition-colors leading-relaxed">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DIY Experiment */}
                <div className="glass-panel-premium rounded-2xl overflow-hidden flex flex-col animate-fade-in-up delay-500">
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />

                    <div className="p-7 flex-grow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="icon-container bg-orange-500/15 text-orange-400 border border-orange-500/20">
                                <FlaskConical size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">DIY Experiment</h3>
                                <p className="text-orange-300/80 text-sm">{data.experiment.experiment_name}</p>
                            </div>
                        </div>

                        {/* Materials */}
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Beaker size={14} className="text-slate-500" />
                                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Materials</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.experiment.materials.map((m, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-slate-800/50 text-slate-300 border border-slate-700/50 rounded-lg text-sm"
                                    >
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Steps */}
                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Steps</h4>
                            <ol className="space-y-2.5">
                                {data.experiment.steps.map((s, i) => (
                                    <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                                        <span className="text-orange-500 font-bold flex-shrink-0">{i + 1}.</span>
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Safety Note */}
                    <div className="bg-red-500/10 border-t border-red-500/20 p-4 mt-auto">
                        <div className="flex gap-3 text-red-200 text-sm items-start">
                            <div className="flex-shrink-0">
                                <Shield size={16} className="text-red-400 mt-0.5" />
                            </div>
                            <div>
                                <span className="font-bold text-red-300 text-xs uppercase tracking-wider">Safety Note: </span>
                                <span className="text-red-200/80">{data.experiment.safety_note}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                FOOTER DISCLAIMER
            ═══════════════════════════════════════════════════════════ */}
            <footer className="text-center pt-8 pb-4 animate-fade-in-up delay-600">
                <p className="text-slate-500 text-sm">
                    Explanation generated by AI • Verify important safety information independently
                </p>
            </footer>
        </div>
    );
};

export default ExplanationResult;
