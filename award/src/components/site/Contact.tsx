import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
  return (
    <section id="contact" className="bg-canvas pb-16">
      <div className="container-x grid gap-8 border-t border-border pt-14 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-[1.75rem] font-medium">Get In Touch</h2>
          <p className="mt-3 max-w-md text-[12px] leading-relaxed text-muted-foreground">
            Have a project, a keynote, or a question about where to start with AI? Send a note and
            I&apos;ll get back to you personally — usually within two business days.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Thanks — I'll be in touch shortly.");
            (e.currentTarget as HTMLFormElement).reset();
          }}
          className="md:justify-self-end md:text-right"
        >
          <label htmlFor="email" className="block text-[11px] text-muted-foreground">
            Your email
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="email"
              type="email"
              required
              placeholder="name@company.com"
              className="w-full min-w-[240px] rounded-md border border-border bg-card px-4 py-2.5 text-[12px] outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sky text-sky-foreground transition-opacity hover:opacity-90"
              aria-label="Send"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
