export const NextStepCard = ({ message }: { message: string }) => (
  <article className="rounded-card bg-brand-50 p-5 shadow-card sm:p-6">
    <h3 className="text-lg font-semibold text-brand-600">A useful next step</h3>
    <p className="mt-3 text-base">{message}</p>
  </article>
);
