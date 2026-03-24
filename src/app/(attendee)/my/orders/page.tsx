import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ORDERS = [
  { id: "EVT-2026-00842", event: "Tech Summit KL 2026",  items: "1× General Admission",    total: "$27.50", date: "Mar 1, 2026",  status: "paid" },
  { id: "EVT-2026-01103", event: "Bass Nation Festival",  items: "2× VIP Package",          total: "$178.00", date: "Mar 1, 2026", status: "paid" },
  { id: "EVT-2025-00512", event: "DevSummit MY 2025",    items: "1× General Admission",    total: "$25.00", date: "Nov 10, 2025", status: "paid" },
  { id: "EVT-2025-00201", event: "KL Art Expo 2025",     items: "2× Standard Entry",       total: "$44.00", date: "Apr 5, 2025",  status: "refunded" },
];

const statusStyle: Record<string, string> = {
  paid:     "bg-success-50 text-success-700 border-success-100",
  refunded: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export default function MyOrdersPage() {
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
            {ORDERS.map((order) => (
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
                  <Badge className={`text-[10px] px-2 h-5 border capitalize ${statusStyle[order.status]}`}>{order.status}</Badge>
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
