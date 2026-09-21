type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-muted">{description}</p>
      ) : null}
    </div>
  );
}
