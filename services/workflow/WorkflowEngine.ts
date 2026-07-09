import { WorkflowInstance, WorkflowType, WorkflowStep, WorkflowStepStatus } from '@/types';
import { observabilityService } from '../observability/ObservabilityService';

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private activeInstances: Map<string, WorkflowInstance> = new Map();

  private constructor() {}

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  /**
   * Spawns a new workflow execution instance.
   */
  public async initiateWorkflow(
    type: WorkflowType,
    context: Record<string, any>,
    initiatorId: string
  ): Promise<WorkflowInstance> {
    return observabilityService.measure(
      'workflow-engine',
      `initiate-${type}`,
      async () => {
        const id = `WFL-${type.toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const steps = this.generateWorkflowSteps(type);

        const instance: WorkflowInstance = {
          id,
          definitionId: `DEF-${type.toUpperCase()}-V1`,
          type,
          status: 'IN_PROGRESS',
          currentStepId: steps[0]?.id || '',
          steps: steps.map((step, idx) => ({
            ...step,
            status: idx === 0 ? 'IN_PROGRESS' : 'PENDING',
            startedAt: idx === 0 ? new Date().toISOString() : undefined
          })),
          context,
          initiatorId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        this.activeInstances.set(id, instance);
        console.log(`[WorkflowEngine] Initiated workflow "${type}" (ID: ${id})`);
        return instance;
      },
      { initiatorId }
    );
  }

  /**
   * Advances a workflow to the next step.
   */
  public async advanceStep(
    instanceId: string,
    stepId: string,
    status: 'COMPLETED' | 'FAILED',
    result?: any,
    error?: string
  ): Promise<WorkflowInstance> {
    const instance = this.activeInstances.get(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance "${instanceId}" not found.`);
    }

    const stepIdx = instance.steps.findIndex(s => s.id === stepId);
    if (stepIdx === -1) {
      throw new Error(`Step "${stepId}" not found in workflow "${instanceId}".`);
    }

    // Complete current step
    instance.steps[stepIdx] = {
      ...instance.steps[stepIdx],
      status: status as WorkflowStepStatus,
      completedAt: new Date().toISOString(),
      result,
      error
    };

    // Transition to next step or complete workflow
    if (status === 'FAILED') {
      instance.status = 'FAILED';
      console.warn(`[WorkflowEngine] Workflow "${instanceId}" FAILED at step "${stepId}"`);
    } else if (stepIdx === instance.steps.length - 1) {
      instance.status = 'COMPLETED';
      console.log(`[WorkflowEngine] Workflow "${instanceId}" COMPLETED successfully.`);
    } else {
      const nextStepIdx = stepIdx + 1;
      instance.currentStepId = instance.steps[nextStepIdx].id;
      instance.steps[nextStepIdx] = {
        ...instance.steps[nextStepIdx],
        status: 'IN_PROGRESS',
        startedAt: new Date().toISOString()
      };
      console.log(`[WorkflowEngine] Workflow "${instanceId}" advanced to step "${instance.currentStepId}"`);
    }

    instance.updatedAt = new Date().toISOString();
    this.activeInstances.set(instanceId, instance);
    return instance;
  }

  /**
   * Retrieve active workflow instance.
   */
  public getWorkflowInstance(id: string): WorkflowInstance | undefined {
    return this.activeInstances.get(id);
  }

  /**
   * List all workflows tracked in memory.
   */
  public listAllInstances(): WorkflowInstance[] {
    return Array.from(this.activeInstances.values());
  }

  /**
   * Skeletons helper to map banking processes to steps.
   */
  private generateWorkflowSteps(type: WorkflowType): WorkflowStep[] {
    switch (type) {
      case 'LoanApproval':
        return [
          { id: 'step-1', name: 'Document Collection', description: 'Gathers KYC and income files.', status: 'PENDING', assignedAgentId: 'document-agent' },
          { id: 'step-2', name: 'Bureau Verification', description: 'Validates credit history via CKYC.', status: 'PENDING', assignedAgentId: 'compliance-officer' },
          { id: 'step-3', name: 'Credit Score Underwriting', description: 'Generates default risk ratios.', status: 'PENDING', assignedAgentId: 'lending-advisor' },
          { id: 'step-4', name: 'Manager Final Signature', description: 'Manual approval sign-off.', status: 'PENDING', assignedRole: 'Branch Manager' }
        ];
      case 'MSMEAssessment':
        return [
          { id: 'step-1', name: 'GST Invoice Parsing', description: 'Extracts supply chain transactions.', status: 'PENDING', assignedAgentId: 'document-agent' },
          { id: 'step-2', name: 'Cash Flow Projection', description: 'Calculates forecast coverage.', status: 'PENDING', assignedAgentId: 'msme-analyst' },
          { id: 'step-3', name: 'Risk Scoring Review', description: 'Evaluates exposure constraints.', status: 'PENDING', assignedAgentId: 'risk-analyst' }
        ];
      case 'FraudInvestigation':
        return [
          { id: 'step-1', name: 'Transaction Holding', description: 'Temporarily flags matching assets.', status: 'PENDING', assignedAgentId: 'fraud-guardian' },
          { id: 'step-2', name: 'Customer Out-of-Band Call', description: 'Initiates relationship contact.', status: 'PENDING', assignedRole: 'Relationship Manager' },
          { id: 'step-3', name: 'Compliance Sign-off', description: 'Releases hold or files suspicious activity report.', status: 'PENDING', assignedAgentId: 'compliance-officer' }
        ];
      default:
        return [
          { id: 'step-1', name: 'Initiation Step', description: 'Initial review of process parameters.', status: 'PENDING' },
          { id: 'step-2', name: 'Completion Step', description: 'Final validation logs compilation.', status: 'PENDING' }
        ];
    }
  }
}

export const workflowEngine = WorkflowEngine.getInstance();
export default workflowEngine;
