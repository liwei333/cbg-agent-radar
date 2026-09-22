# Architecture

## 数据流

```
mobile (采集) → data/raw/ → pc (清洗) → data/parsed/ → pc (评分) → data/candidates/
                     ↓
              data/snapshots/ (批次快照)
                     ↓
              data/details/{itemId}.json (单角色详情)
                     ↓
              data/index.json (全局索引)
```

## 采集协议

1. mobile 端通过 ADB/UI Automator 操作藏宝阁 APP
2. 每次采集生成一个 batch（`data/snapshots/{batchId}/`）
3. 批次包含 metadata.json + candidates.json
4. pc 端读取 batch，清洗后生成单角色详情文件
5. 更新全局索引 `data/index.json`

## 评分维度

- **base**: 号底质量（修炼、潜能果、机缘、经验）
- **equipment**: 装备价值
- **pets**: 召唤兽价值
- **cosmetics**: 限量锦衣/祥瑞
- **liquidity**: 流动性（转手难易度）
- **grade**: 综合等级（A/B/C）

## 安全边界

- 采集端不存储 Cookie/Token
- 截图上传前必须检查是否包含手机号、账号信息
- Git 仓库不包含任何认证信息
