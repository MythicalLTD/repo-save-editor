type HeadingProps = {
  title: string
  description: string
}

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-foreground/60 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
