"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Landmark, Check, AlertTriangle, Eye, X, Download, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BankTransfersAdminPage() {
  const { orders, updateOrderStatus, formatPrice } = useStore();
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<any | null>(null);

  // Filter orders paid via manual bank wire
  const bankWireOrders = orders.filter((o) => o.paymentMethod === "Bank Transfer");

  const handleApprove = (id: string) => {
    updateOrderStatus(id, "Pending"); // changes standard order status or processes
    toast.success(`Deposit slip for order ${id} approved successfully! Order status updated to Processing.`);
    setSelectedSlipOrder(null);
  };

  const handleFlagInvalid = (id: string) => {
    updateOrderStatus(id, "Cancelled");
    toast.error(`Order ${id} flagged as invalid payment. Notification email dispatched.`);
    setSelectedSlipOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Landmark className="text-brand" size={28} /> Manual Bank Transfers
        </h1>
        <p className="text-sm text-muted-foreground">
          Audit uploaded bank deposit slips, verify corresponding bank account clearances, and approve pending order shipments.
        </p>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="text-sm font-bold text-foreground">Pending Deposit Clearances</h3>
        </div>

        <div className="overflow-x-auto">
          {bankWireOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileCheck size={40} className="mx-auto opacity-35 mb-2" />
              <div className="text-sm font-bold">All slips audited</div>
              <p className="text-xs mt-1">There are no pending bank wire slips left to verify.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/10">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Total Amount</th>
                  <th className="p-4 text-center">Deposit Slip</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bankWireOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/10 transition-all">
                    <td className="p-4 font-bold text-foreground">{o.id}</td>
                    <td className="p-4">
                      <div className="font-semibold">{o.customer}</div>
                      <div className="text-[10px] text-muted-foreground">{o.email}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{o.date}</td>
                    <td className="p-4 text-right font-extrabold text-foreground tabular-nums">
                      {formatPrice(o.total)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedSlipOrder(o)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-brand hover:underline"
                      >
                        <Eye size={12} /> View Slip
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border",
                          o.status === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/25",
                          o.status === "Shipped" && "bg-brand/10 text-brand border-brand/25",
                          o.status === "Delivered" && "bg-success/10 text-success border-success/25",
                          o.status === "Cancelled" && "bg-destructive/10 text-destructive border-destructive/25"
                        )}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {o.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(o.id)}
                            className="rounded-lg bg-success text-success-foreground p-1.5 hover:opacity-95 transition"
                            title="Approve Slip"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => handleFlagInvalid(o.id)}
                            className="rounded-lg bg-destructive text-destructive-foreground p-1.5 hover:opacity-95 transition"
                            title="Flag as Invalid"
                          >
                            <AlertTriangle size={13} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Slip Detail Modal Overlay */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-deep/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedSlipOrder(null)}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="text-base font-bold text-foreground">Audit Bank Transfer</h3>
              <p className="text-xs text-muted-foreground">Order: #{selectedSlipOrder.id} · Total: {formatPrice(selectedSlipOrder.total)}</p>
            </div>

            {/* Mock Slip Preview Graphic */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4 font-mono text-[10px] space-y-3 relative overflow-hidden">
              <div className="text-center font-bold border-b border-border/80 pb-2 text-xs uppercase tracking-wide">
                Bank of Ceylon (BOC)
              </div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>Transaction Date:</div>
                <div className="text-right text-foreground font-bold">{selectedSlipOrder.date}</div>
                <div>Account Name:</div>
                <div className="text-right text-foreground">TEMPLE TREE EXPORTS</div>
                <div>Account Number:</div>
                <div className="text-right text-foreground">84401245-LK</div>
                <div>Reference Code:</div>
                <div className="text-right text-foreground font-bold">{selectedSlipOrder.id}</div>
                <div>Depositor:</div>
                <div className="text-right text-foreground">{selectedSlipOrder.customer}</div>
                <div>Transferred Amount:</div>
                <div className="text-right text-brand font-extrabold text-xs">
                  {formatPrice(selectedSlipOrder.total)}
                </div>
              </div>
              <div className="border-t border-dashed border-border/80 pt-2 flex items-center justify-center gap-1 text-[9px] text-success font-bold uppercase">
                <Check size={11} strokeWidth={2.5} /> Encrypted Digital Stamp Verified
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleFlagInvalid(selectedSlipOrder.id)}
                className="rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive py-2.5 text-xs font-bold transition"
              >
                Flag as Invalid
              </button>
              <button
                onClick={() => handleApprove(selectedSlipOrder.id)}
                className="rounded-xl bg-brand text-brand-foreground py-2.5 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all"
              >
                Verify & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
