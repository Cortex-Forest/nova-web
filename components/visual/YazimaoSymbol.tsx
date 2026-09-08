/**
 * YAZIMAO Symbol Logo —— Feather + Network（线条羽管 + 羽轴光点）
 *
 * 品牌隐喻：一根鸭毛很轻；一个人的创造也很小；但无数人的创造被连接、验证
 * 并汇聚后，可以形成一个属于所有人的公共网络。
 *
 * 视觉语言（方案 ②）：
 * - 造型沿用已验证的斜向羽管（quill）轮廓：远看即羽毛。
 * - 羽管线条细、单色（currentColor）：深色站自动为白，浅色站自动跟随文字色。
 * - 羽轴上三枚品牌色光点 + 末端/卫星点 = “网络节点”语汇（cyan→violet→magenta），
 *   近看是网络；小尺寸下以线条识别为主，不受影响。
 * - 禁止卡通鸭/鸭头/鸭嘴/Meme 元素；鸭毛是隐喻，不是吉祥物。
 */
export function YazimaoSymbol({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g
        transform="translate(0.6 1.4) scale(2)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 羽身（斜向羽管轮廓） */}
        <path
          d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
          strokeWidth="1.05"
        />
        {/* 羽轴（rachis / calamus） */}
        <path d="M16 8 2.4 21.6" strokeWidth="1.5" />
        {/* 羽管缺口线 */}
        <path d="M16.6 15.6 9.4 15.6" strokeWidth="0.7" opacity="0.85" />
      </g>
      {/* 网络节点（羽轴光点 + 端点 + 卫星点） */}
      <g fill="none">
        <circle cx="26.4" cy="24.4" r="1.8" fill="#22D3EE" />
        <circle cx="20.4" cy="31.6" r="1.9" fill="#A78BFA" />
        <circle cx="14.6" cy="38.4" r="1.9" fill="#E879F9" />
        <circle cx="6.2" cy="45" r="2.2" fill="#22D3EE" />
        <circle cx="28.6" cy="16.4" r="1.4" fill="#22D3EE" opacity="0.9" />
      </g>
    </svg>
  );
}
