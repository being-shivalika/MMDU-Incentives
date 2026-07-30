import React from "react";
import { CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react";

/**
 * Dynamic Workflow Progress Tracker Component
 * Driven strictly by backend workflowProgress data.
 */
const WorkflowProgressTracker = ({ workflowProgress, isHeld, heldReason }) => {
  if (!workflowProgress || !Array.isArray(workflowProgress.steps)) {
    return null;
  }

  const { steps, currentStage, percentage, statusLabel, isRejected, isReturned, isFallbackRouting, fallbackReason } = workflowProgress;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm text-left space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
            Submission Workflow Diagram
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Stage: <span className="font-semibold text-neutral-700">{currentStage}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
            isCompletedStatus(statusLabel) ? 'bg-green-50 text-green-700 border-green-200' :
            isRejected ? 'bg-red-50 text-red-700 border-red-200' :
            isReturned ? 'bg-orange-50 text-orange-700 border-orange-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Held Payment Notice (Second Publication Rule) */}
      {isHeld && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Second Publication Rule Active:</span> {heldReason || "Payment held until second eligible publication per policy."}
          </div>
        </div>
      )}

      {/* Automatic Fallback Notice */}
      {isFallbackRouting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-800 flex items-center gap-2">
          <span className="font-bold text-[10px] uppercase bg-blue-200 px-1.5 py-0.5 rounded">Auto-Routing</span>
          <span>{fallbackReason}</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            isRejected ? 'bg-red-500' : isReturned ? 'bg-orange-500' : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Horizontal Step Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          const stepRejected = step.status === 'rejected';
          const stepReturned = step.status === 'returned';

          return (
            <div 
              key={step.id || idx}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
                isCompleted ? 'bg-green-50/40 border-green-200 text-green-900' :
                isActive ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-100' :
                stepRejected ? 'bg-red-50 border-red-200 text-red-900' :
                stepReturned ? 'bg-orange-50 border-orange-200 text-orange-900' :
                'bg-neutral-50 border-neutral-200 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Step {idx + 1}
                </span>
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />}
                {isActive && <Clock className="h-4 w-4 text-blue-600 animate-pulse flex-shrink-0" />}
                {(stepRejected || stepReturned) && (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-ping inline-block"></span>
                    {stepRejected ? <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" /> : <RotateCcw className="h-4 w-4 text-amber-600 flex-shrink-0" />}
                  </span>
                )}
              </div>

              <div>
                <p className={`text-xs font-bold leading-tight ${
                  isCompleted ? 'text-green-900' : isActive ? 'text-blue-900' : stepRejected ? 'text-red-900' : stepReturned ? 'text-orange-900' : 'text-neutral-500'
                }`}>
                  {step.label}
                </p>
                {step.actorName && (
                  <p className="text-[10px] text-neutral-500 mt-1 truncate">
                    By: {step.actorName}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const isCompletedStatus = (statusLabel) => {
  return statusLabel?.toLowerCase().includes('completed') || statusLabel?.toLowerCase().includes('disbursed');
};

export default WorkflowProgressTracker;
