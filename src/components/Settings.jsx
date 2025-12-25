import React, { useState, useEffect } from 'react';
import { FORM_CONFIG } from '../config/constants';
import { ExternalLink, FileText } from 'lucide-react';

export default function Settings() {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <header>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-text-muted">Configuration & Info</p>
            </header>

            <div className="space-y-4">
                {/* OCR Mode Section */}
                <section className="bg-surface border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={18} className="text-secondary" />
                        <h3 className="font-semibold">Local OCR Mode</h3>
                    </div>
                    <p className="text-xs text-secondary-light font-medium">
                        ✓ 100% Free & Private (No API Keys needed)
                    </p>
                    <p className="text-[11px] text-text-muted">
                        Analysis is performed locally on your device using Tesseract.js. No data is sent to AI clouds.
                    </p>
                </section>

                <section className="bg-surface border border-border rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Google Form</h3>
                    <div className="text-xs text-text-muted break-all">
                        <p className="mb-2">{FORM_CONFIG.formUrl}</p>
                        <a
                            href={FORM_CONFIG.formUrl.replace('/formResponse', '/viewform')}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary flex items-center gap-1 hover:underline"
                        >
                            View Form <ExternalLink size={12} />
                        </a>
                    </div>
                </section>

                <section className="bg-surface border border-border rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Field Mapping</h3>
                    <ul className="space-y-2 text-xs">
                        <li className="flex justify-between">
                            <span className="text-text-muted">Amount ID</span>
                            <span className="font-mono bg-background px-1 rounded">{FORM_CONFIG.fields.amount}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-text-muted">Category ID</span>
                            <span className="font-mono bg-background px-1 rounded">{FORM_CONFIG.fields.category}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-text-muted">Method ID</span>
                            <span className="font-mono bg-background px-1 rounded">{FORM_CONFIG.fields.method}</span>
                        </li>
                    </ul>
                </section>

                <section className="bg-surface border border-border rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Version</h3>
                    <p className="text-xs text-text-muted">Payment Tracker v0.1.0</p>
                </section>
            </div>
        </div>
    );
}
