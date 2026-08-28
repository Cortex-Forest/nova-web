"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Hash, Search, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "blocks" | "transactions" | "accounts" | "validators";

const tabs: { id: TabId; label: string; icon: typeof Box }[] = [
  { id: "blocks", label: "Blocks", icon: Box },
  { id: "transactions", label: "Transactions", icon: Hash },
  { id: "accounts", label: "Accounts", icon: Wallet },
  { id: "validators", label: "Validators", icon: User },
];

/** 表头配置 —— 与未来 Indexer API 字段一一对应 */
const columns: Record<TabId, string[]> = {
  blocks: ["Height", "Block Hash", "Time", "Txs", "Proposer", "Status"],
  transactions: ["Tx Hash", "Type", "From", "To", "Amount", "Status"],
  accounts: ["Address", "Balance", "Nonce", "Type"],
  validators: ["Validator", "Status", "Voting Power", "Commission", "Uptime"],
};

/** 占位行 —— 上线后由 Indexer API 数据替换，绝不填充虚构数据 */
function EmptyRows({ columns }: { columns: string[] }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((r) => (
        <tr key={r} className="border-t border-white/5">
          {columns.map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <span className="block h-3 w-full max-w-[120px] rounded bg-white/5" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Explorer 界面占位。
 * 仅展示界面结构与交互，不包含任何真实链上数据。
 * 数据接入：`/api/explorer`（或未来 Indexer 服务）返回后填充表格。
 */
export function ExplorerPreview() {
  const [active, setActive] = useState<TabId>("blocks");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-ink-800/50">
      {/* 顶部 */}
      <div className="flex flex-col gap-4 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-mist-100">
          <Box className="h-4 w-4 text-nova-cyanSoft" />
          Nova Explorer
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-mist-500">
            Preview
          </span>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <input
            type="text"
            placeholder="Search by tx / block / address…"
            disabled
            className="w-full rounded-lg border border-white/10 bg-ink-900/70 py-2 pl-9 pr-3 text-sm text-mist-300 placeholder:text-mist-500 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/8 px-3 pt-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={cn(
              "relative flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
              active === t.id ? "text-white" : "text-mist-500 hover:text-mist-300",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId="explorer-tab"
                className="absolute inset-x-1 -bottom-px h-px bg-nova-gradient"
              />
            )}
          </button>
        ))}
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-widest text-mist-500">
              {columns[active].map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <EmptyRows columns={columns[active]} />
          </tbody>
        </table>
      </div>

      {/* 状态 */}
      <div className="flex flex-col items-start justify-between gap-3 border-t border-white/8 bg-ink-900/50 p-5 sm:flex-row sm:items-center">
        <p className="text-xs text-mist-500">
          This is an interface preview. No chain data is shown — the Explorer
          connects to the live Indexer when the network is available.
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Data: Coming Soon
        </span>
      </div>
    </div>
  );
}
