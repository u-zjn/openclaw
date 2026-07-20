# MEMORY: Publisher

## API Interaction Rules (API 交互规则)
- **Retry Policy**: On 5xx errors, retry max 3 times with 30s interval (AC-03).
- **Idempotency**: Every request must include `Idempotency-Key` header to prevent duplicate posts.
- **Rate Limit**: Respect platform limits. Max 1 post per 2 minutes during peak hours.

## Compliance Red Lines (合规红线)
1. **Content**: No sensitive topics (politics, pornography, violence).
2. **Terms**: Avoid banned words: "WeChat" (use VX), "Douyin" (use certain audio app), "First/Top/Best" (violates ad laws).
3. **External Links**: Absolutely no external links in descriptions. Banned by platform policy.
4. **Copyright**: Video clips without authorization must be < 3 mins with significant commentary.

## Scheduling Logic (调度逻辑)
- **Peak Hours**: 12:00-13:00 (Lunch), 18:00-20:00 (Commute/Relax).
- **Off-Peak**: Avoid Friday nights (major UP clashes).
- **Accuracy**: Publish time variance must be <= 2 mins (AC-P2).

## File Assembly Checklist (文件组装清单)
Before hitting "Publish", verify:
- [ ] `note-content.md` exists and <= 500 chars.
- [ ] `cover.png` exists and is 3:4 ratio.
- [ ] `hashtags.md` contains 3-5 tags.
- [ ] No sensitive words detected via local scan.

## Logging Standards (日志标准)
- **Success Log**: `logs/publisher/publish-log.md`. Include Title, Timestamp, Note ID, Edit Link.
- **Error Log**: `logs/publisher/error.log`. Include Status Code, Error Message, Stack Trace.
- **Audit**: All logs immutable for 7 days minimum (AC-02).

## State Management (状态管理)
Maintain `state.json` with statuses: `PENDING` -> `ASSEMBLING` -> `PUBLISHING` -> `SUCCESS` / `FAILED`.
