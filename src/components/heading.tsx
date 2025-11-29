type HeadingProps = {
  title: string
  description: string
}

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div className="space-y-2">
      <h2
        className="from-primary via-accent to-primary bg-gradient-to-r
          bg-clip-text text-2xl font-bold text-transparent"
      >
        {title}
      </h2>
      <p className="text-foreground/60 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
