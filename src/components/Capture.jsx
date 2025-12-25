import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, Upload, Camera as CameraIcon, Check, RefreshCw, Loader2, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { analyzeImage } from '../services/ocr';
import { submitToGoogleForm } from '../services/api';
import { FORM_CONFIG } from '../config/constants';

export default function Capture({ onCancel }) {
    const [step, setStep] = useState('select'); // select, camera, processing, form, success, error
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        category: FORM_CONFIG.categories[0],
        method: FORM_CONFIG.paymentMethods[0],
        description: ''
    });
    const [analysisData, setAnalysisData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const webcamRef = useRef(null);

    // --- Handlers ---

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        startProcessing(imageSrc);
    }, [webcamRef]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                startProcessing(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const startProcessing = async (imgSrc) => {
        setStep('processing');
        setErrorMsg('');


        try {
            const result = await analyzeImage(imgSrc);
            console.log("OCR Result:", result);

            setAnalysisData(result);

            setFormData(prev => ({
                ...prev,
                amount: result.amount || "",
                category: result.category || FORM_CONFIG.categories[0],
                method: result.payment_method || FORM_CONFIG.paymentMethods[0],
                description: result.text ? result.text.slice(0, 30) + "..." : ""
            }));
            setStep('form');

        } catch (err) {
            setErrorMsg(err.message || "Failed to analyze image.");
            setStep('error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await submitToGoogleForm(formData);
        setIsSubmitting(false);
        if (success) {
            setStep('success');
            setTimeout(() => {
                onCancel(); // Return home after success
            }, 2000);
        } else {
            alert("Failed to submit. Please try again.");
        }
    };

    // --- Render Steps ---

    if (step === 'select') {
        return (
            <div className="h-full flex flex-col animate-slide-up bg-surface">
                <Header onCancel={onCancel} title="New Entry" />
                <div className="flex-1 flex flex-col p-6 items-center justify-center gap-6">
                    <button
                        onClick={() => setStep('camera')}
                        className="w-full h-48 rounded-2xl bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-surface/50 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CameraIcon size={32} />
                        </div>
                        <span className="font-semibold">Take Photo</span>
                    </button>

                    <div className="relative w-full">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={handleFileUpload}
                        />
                        <button className="w-full h-48 rounded-2xl bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-secondary hover:bg-surface/50 transition-all group">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <span className="font-semibold">Upload Image</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'camera') {
        return (
            <div className="h-full flex flex-col bg-black">
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: 'environment' }}
                    />
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="h-32 bg-black flex items-center justify-center pb-8">
                    <button
                        onClick={handleCapture}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'processing') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-surface animate-fade-in space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <Sparkles size={48} className="text-primary relative z-10 animate-bounce" />
                </div>
                <p className="text-text-muted animate-pulse">Scanning local OCR...</p>
            </div>
        );
    }

    if (step === 'error') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-surface animate-fade-in space-y-4 p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold">Analysis Failed</h3>
                <p className="text-sm text-text-muted">{errorMsg}</p>
                <button
                    onClick={() => setStep('select')}
                    className="bg-surface border border-border px-6 py-2 rounded-full mt-4"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-surface animate-fade-in space-y-4">
                <div className="w-20 h-20 bg-secondary/20 text-secondary rounded-full flex items-center justify-center">
                    <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold">Sent!</h2>
            </div>
        );
    }

    // Form Step
    return (
        <div className="h-full flex flex-col bg-surface animate-slide-up">
            <Header onCancel={onCancel} title="Confirm Details" />

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* AI Confidence Banner */}
                {analysisData && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-3">
                        <FileText size={16} className="text-primary mt-1 shrink-0" />
                        <div className="text-xs">
                            <p className="font-medium text-primary">OCR Scan Complete</p>
                            <p className="text-text-muted mt-1">
                                Extracted Amount: {analysisData.amount || 'N/A'} • Date: {analysisData.date || 'N/A'}
                            </p>
                        </div>
                        {analysisData.confidence_score && (
                            <span className="ml-auto text-xs font-bold bg-background px-2 py-1 rounded border border-border">
                                {analysisData.confidence_score}%
                            </span>
                        )}
                    </div>
                )}

                {image && (
                    <div className="h-48 w-full rounded-xl overflow-hidden relative group border border-border">
                        <img src={image} alt="Receipt" className="w-full h-full object-cover" />
                        <button
                            onClick={() => setStep('select')}
                            className="absolute bottom-2 right-2 p-2 bg-black/60 text-white rounded-full backdrop-blur-md"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Amount (INR)</label>
                        <input
                            type="text"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-background border border-border rounded-xl p-4 text-2xl font-bold focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                            >
                                {FORM_CONFIG.categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Payment Method</label>
                            <select
                                value={formData.method}
                                onChange={e => setFormData({ ...formData, method: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                            >
                                {FORM_CONFIG.paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Expense'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const Header = ({ onCancel, title }) => (
    <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-background rounded-full transition-colors">
            <X size={20} />
        </button>
    </div>
);
