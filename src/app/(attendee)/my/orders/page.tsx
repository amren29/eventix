import { redirect } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

const statusStyle: Record<string, string> = {
  paid:      "bg-success-50 text-success-700 border-success-100",
  pending:   "bg-warning-50 text-warning-700 border-warning-100",
  refunded:  "bg-neutral-100 text-neutral-500 border-neutral-200",
  cancelled: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export default async function MyOrdersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      reference,
      total,
      currency,
      status,
      created_at,
      event:events!inner(
        id,
        title,
        slug
      ),
      order_tickets(
        id,
        ticket_type:ticket_types(name)
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  const allOrders = (orders || []).map((order: any) => {
    // Summarize ticket items
    const ticketCounts: Record<string, number> = {};
    for (const ot of order.order_tickets || []) {
      const name = ot.ticket_type?.name || "Ticket";
      ticketCounts[name] = (ticketCounts[name] || 0) + 1;
    }
    const itemsSummary = Object.entries(ticketCounts)
      .map(([name, count]) => `${count}× ${name}`)
      .join(", ") || "No tickets";

    const dateStr = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return {
      id: order.reference,
      event: order.event?.title || "Unknown Event",
      slug: order.event?.slug || "",
      items: itemsSummary,
      total: `$${(order.total / 100).toFixed(2)}`,
      date: dateStr,
      status: order.status || "paid",
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">My Orders</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Complete history of all your purchases.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500">Order</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 hidden sm:table-cell">Event</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 hidden md:table-cell">Date</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-500">Total</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-500">Status</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {allOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-neutral-500">
                  No orders found.
                </td>
              </tr>
            )}
            {allOrders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-5 py-4">
                  <code className="text-xs font-mono text-primary-600">{order.id}</code>
                  <p className="text-xs text-neutral-400 mt-0.5 sm:hidden">{order.event}</p>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <p className="text-sm font-medium text-neutral-800">{order.event}</p>
                  <p className="text-xs text-neutral-400">{order.items}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-xs text-neutral-400">{order.date}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <p className="font-bold text-neutral-900 text-sm">{order.total}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge className={`text-[10px] px-2 h-5 border capitalize ${statusStyle[order.status] || statusStyle.paid}`}>{order.status}</Badge>
                </td>
                <td className="px-3 py-4">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-700">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
