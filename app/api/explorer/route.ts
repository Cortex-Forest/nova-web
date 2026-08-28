import { NextResponse } from "next/server";

/**
 * Explorer API —— 预留路由（示例）。
 *
 * 真实数据将由 Nova Indexer 服务提供。上线前此接口返回明确的
 * 503 + Coming Soon 状态，绝不返回虚构数据。
 *
 * 未来接入方式（README 见 /api/README.md）：
 *   const data = await fetch("/api/explorer/blocks?limit=20").then(r => r.json());
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const resource = url.pathname.split("/").filter(Boolean).pop();

  return NextResponse.json(
    {
      code: "COMING_SOON",
      message:
        "The Nova Explorer API is not live yet. It will serve blocks, transactions, accounts, and validators from the Nova Indexer when the network is available.",
      resource: resource ?? null,
      docs: "/developers#api",
    },
    {
      status: 503,
      // P2.5 冻结：仅对当前实际存在的 GET stub 使用 no-store（scoped），
      // 禁止全局 /api/* no-store 覆盖未来接口的缓存语义。
      headers: { "Cache-Control": "no-store" },
    },
  );
}
