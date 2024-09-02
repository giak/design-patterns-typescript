interface Order {
  id: number;
  items: { name: string; quantity: number }[];
  paymentProcessed: boolean;
  shipped: boolean;
}

interface WorkflowContext {
  order: Order;
  isValid: boolean;
}

type WorkflowStep = (
  context: WorkflowContext
) => Generator<WorkflowContext, WorkflowContext, unknown>;

function* validateOrderStep(
  context: WorkflowContext
): Generator<WorkflowContext, WorkflowContext, unknown> {
  console.log(`Validating order ${context.order.id}...`);
  context.isValid = context.order.items.every((item) => item.quantity > 0);
  if (!context.isValid) {
    console.log(`Order ${context.order.id} is invalid.`);
    return context; // Explicit return to satisfy TypeScript
  }
  yield context;
  return context; // Explicit return at the end
}

function* processPaymentStep(
  context: WorkflowContext
): Generator<WorkflowContext, WorkflowContext, unknown> {
  if (!context.isValid) {
    return context; // Explicit return to satisfy TypeScript
  }
  console.log(`Processing payment for order ${context.order.id}...`);
  context.order.paymentProcessed = true;
  yield context;
  return context; // Explicit return at the end
}

function* shipOrderStep(
  context: WorkflowContext
): Generator<WorkflowContext, WorkflowContext, unknown> {
  if (!context.order.paymentProcessed) {
    console.log(
      `Cannot ship order ${context.order.id}: payment not processed.`
    );
    return context; // Explicit return to satisfy TypeScript
  }
  console.log(`Shipping order ${context.order.id}...`);
  context.order.shipped = true;
  yield context;
  return context; // Explicit return at the end
}

function* workflowExecutor(
  context: WorkflowContext,
  steps: WorkflowStep[]
): Generator<WorkflowContext, void, unknown> {
  for (const step of steps) {
    context = (yield* step(context))!;
  }
}

async function main() {
  const order: Order = {
    id: 1,
    items: [
      { name: "Laptop", quantity: 1 },
      { name: "Mouse", quantity: 0 },
    ],
    paymentProcessed: false,
    shipped: false,
  };

  const context: WorkflowContext = {
    order,
    isValid: false,
  };

  const steps: WorkflowStep[] = [
    validateOrderStep,
    processPaymentStep,
    shipOrderStep,
  ];

  const workflow = workflowExecutor(context, steps);

  for (const result of workflow) {
    console.log("Workflow step completed:", result);
  }

  console.log("Final order state:", context.order);
}

main();
