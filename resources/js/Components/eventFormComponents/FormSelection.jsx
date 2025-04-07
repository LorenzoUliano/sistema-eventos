export const FormSection = ({ title, children, className = "" }) => (
    <div className={`bg-muted/20 p-6 rounded-xl border border-border ${className}`}>
        <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
        {children}
    </div>
);