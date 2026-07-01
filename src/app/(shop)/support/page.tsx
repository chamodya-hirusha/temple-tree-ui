export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 min-h-[60vh]">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground mb-4">How can we help?</h1>
        <p className="text-muted-foreground max-w-xl">Find answers to common questions or reach out to our dedicated support team.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-soft flex flex-col items-center text-center">
          <div className="grid h-12 w-12 rounded-full bg-brand/10 text-brand place-items-center mb-4">📦</div>
          <h3 className="font-bold text-lg mb-2">Track Order</h3>
          <p className="text-sm text-muted-foreground mb-6">Check the status of your international shipment and tracking updates.</p>
          <button className="bg-brand text-brand-foreground px-6 py-2.5 rounded-lg font-semibold w-full mt-auto hover:opacity-90 transition">Track Now</button>
        </div>
        <div className="bg-card p-8 rounded-3xl border border-border shadow-soft flex flex-col items-center text-center">
          <div className="grid h-12 w-12 rounded-full bg-muted text-foreground place-items-center mb-4">🔄</div>
          <h3 className="font-bold text-lg mb-2">Returns</h3>
          <p className="text-sm text-muted-foreground mb-6">Start a return or exchange within 30 days of receiving your item.</p>
          <button className="bg-background text-foreground border-2 border-border px-6 py-2.5 rounded-lg font-semibold w-full mt-auto hover:bg-muted transition">Start Return</button>
        </div>
      </div>

      <div className="bg-popover rounded-3xl p-8 border border-border shadow-card text-center">
        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
        <p className="text-muted-foreground mb-6">Our support team is available 24/7 to assist you with any inquiries.</p>
        <a href="mailto:support@slmalkoha.com" className="inline-block bg-foreground text-background px-8 py-3 rounded-xl font-bold hover:opacity-90 transition">
          Contact Us
        </a>
      </div>
    </div>
  );
}
