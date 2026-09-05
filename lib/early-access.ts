/**
 * Early Access —— 注册域纯逻辑（不依赖 Next / React，便于独立单测）
 *
 * ## 本轮定位（Website V1.1 — Early Access）
 *
 * Early Access 是「生态参与预登记 / ecosystem participation registration」，
 * 绝不是 Token Sale / ICO / Presale / 投资产品。
 *
 * ## 数据最小化（Privacy by design）
 *
 * 仅采集：`email` + `participationTypes` + 可选 `country` + `created_at`。
 * 永不采集 / 存储：密码、私钥、助记词、钱包私钥、支付信息、政府证件、
 * 护照、信用卡、银行账户，以及任何用户签名。
 *
 * ## 存储抽象（诚实降级）
 *
 * 当前官网为静态站，无后端数据库。本项目不擅自部署第三方数据库。
 * 注册接口抽象为外部 `EARLY_ACCESS_ENDPOINT`（远端注册服务）。
 * 未配置 endpoint 时，API 返回 `unavailable`（与 /api/explorer 的 503
 * Coming Soon 策略一致），绝不假装「已注册」。
 *
 * 未来接入真实注册后端时，仅需注入 endpoint，其余逻辑不变。
 */

/** 参与类型 —— 单一事实来源（UI 卡片 / 表单 checkbox / API 共用） */
export const PARTICIPATION_TYPES = [
  { id: "creator", label: "Creator" },
  { id: "node", label: "Node Operator" },
  { id: "developer", label: "Developer" },
  { id: "community", label: "Community" },
] as const;

export type ParticipationTypeId = (typeof PARTICIPATION_TYPES)[number]["id"];

/** 合法 id 集合（白名单，服务端校验用） */
export const PARTICIPATION_IDS: readonly ParticipationTypeId[] =
  PARTICIPATION_TYPES.map((t) => t.id);

/** 输入上限（防滥用 / 防超长请求） */
export const MAX_EMAIL_LENGTH = 254;
export const MAX_COUNTRY_LENGTH = 90;
export const MAX_TYPES = PARTICIPATION_TYPES.length;
/** 请求体字节上限（服务端前置检查） */
export const MAX_BODY_BYTES = 16_384;

/** 宽松但有效的邮箱格式（RFC 5322 简化；长度另有上限） */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** country/region：自由文本，仅做字符集与长度约束，不做国籍判断 */
const COUNTRY_RE = /^[A-Za-z][A-Za-z\s'’.,()-]{0,88}$/;

/** 规范后的注册载荷（只含最小字段） */
export interface EarlyAccessPayload {
  email: string;
  participationTypes: ParticipationTypeId[];
  country?: string;
}

/** 客户端/服务端共享的校验错误码 */
export type EarlyAccessIssue =
  | "EMAIL_REQUIRED"
  | "EMAIL_INVALID"
  | "TYPES_REQUIRED"
  | "TYPE_UNKNOWN"
  | "COUNTRY_INVALID";

/** 校验 email */
export function isValidEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (e.length === 0) return false;
  if (e.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_RE.test(e);
}

/**
 * 校验未知输入（服务端请求体 / 客户端均可复用）。
 * 返回规范化后的 payload 或第一个错误码。
 */
export function validateEarlyAccessInput(
  raw: unknown,
):
  | { ok: true; payload: EarlyAccessPayload }
  | { ok: false; error: EarlyAccessIssue } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "EMAIL_INVALID" };
  }
  const body = raw as Record<string, unknown>;

  // email
  const emailRaw = body.email;
  if (typeof emailRaw !== "string") return { ok: false, error: "EMAIL_REQUIRED" };
  const email = emailRaw.trim().toLowerCase();
  if (email.length === 0) return { ok: false, error: "EMAIL_REQUIRED" };
  if (!isValidEmail(email)) return { ok: false, error: "EMAIL_INVALID" };

  // participationTypes（白名单 + 去重 + 上限）
  const typesRaw = body.participationTypes;
  if (!Array.isArray(typesRaw)) return { ok: false, error: "TYPES_REQUIRED" };
  if (typesRaw.length === 0) return { ok: false, error: "TYPES_REQUIRED" };
  if (typesRaw.length > MAX_TYPES) return { ok: false, error: "TYPE_UNKNOWN" };
  const participationTypes: ParticipationTypeId[] = [];
  for (const t of typesRaw) {
    if (
      typeof t !== "string" ||
      !(PARTICIPATION_IDS as readonly string[]).includes(t)
    ) {
      return { ok: false, error: "TYPE_UNKNOWN" };
    }
    if (!participationTypes.includes(t as ParticipationTypeId)) {
      participationTypes.push(t as ParticipationTypeId);
    }
  }
  if (participationTypes.length === 0) {
    return { ok: false, error: "TYPES_REQUIRED" };
  }

  // country（可选）
  let country: string | undefined;
  const countryRaw = body.country;
  if (countryRaw !== undefined && countryRaw !== null && countryRaw !== "") {
    if (typeof countryRaw !== "string") {
      return { ok: false, error: "COUNTRY_INVALID" };
    }
    const c = countryRaw.trim();
    if (c.length > MAX_COUNTRY_LENGTH || !COUNTRY_RE.test(c)) {
      return { ok: false, error: "COUNTRY_INVALID" };
    }
    country = c;
  }

  return { ok: true, payload: { email, participationTypes, country } };
}

/** 注册结果（客户端按此渲染成功/重复/失败状态） */
export type RegisterOutcome =
  | { status: "registered" }
  | { status: "duplicate" }
  | { status: "unavailable" }
  | { status: "error" };

/** 外部注册服务配置（可注入 fetch，便于单测） */
export interface EarlyAccessConfig {
  /** 远端注册端点；为空 → 未配置（返回 unavailable） */
  endpoint: string | null;
  fetchImpl?: typeof fetch;
}

/** 构造发送给远端的最小载荷（含 created_at，不含任何敏感字段） */
export function toWirePayload(payload: EarlyAccessPayload): {
  email: string;
  participationTypes: ParticipationTypeId[];
  country?: string;
  created_at: string;
} {
  return {
    email: payload.email,
    participationTypes: payload.participationTypes,
    ...(payload.country ? { country: payload.country } : {}),
    created_at: new Date().toISOString(),
  };
}

/**
 * 提交通道（adapter）：
 * - 未配置 endpoint → { status: "unavailable" }（诚实：不假装已注册）
 * - 配置 endpoint → 转发并映射：2xx → registered；409 → duplicate；其余 → error
 * 网络异常一律映射为 error（客户端提示稍后重试），不抛出。
 */
export async function submitEarlyAccess(
  payload: EarlyAccessPayload,
  config: EarlyAccessConfig,
): Promise<RegisterOutcome> {
  const endpoint = config.endpoint;
  if (!endpoint) return { status: "unavailable" };

  const doFetch = config.fetchImpl ?? fetch;
  try {
    const res = await doFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toWirePayload(payload)),
      // 避免长时间挂起（Vercel serverless 默认较短，这里显式兜底）
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 409) return { status: "duplicate" };
    if (res.ok) return { status: "registered" };
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}

/** 人类可读错误码 → 展示文案（客户端与服务端统一口径） */
export const EARLY_ACCESS_MESSAGES: Record<EarlyAccessIssue, string> = {
  EMAIL_REQUIRED: "Please enter your email.",
  EMAIL_INVALID: "Please enter a valid email address.",
  TYPES_REQUIRED: "Select at least one area of interest.",
  TYPE_UNKNOWN: "One or more participation areas are not recognized.",
  COUNTRY_INVALID: "Please enter a valid country or region.",
};
