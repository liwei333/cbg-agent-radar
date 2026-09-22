# CBG Agent Radar

梦幻西游藏宝阁角色性价比雷达。

## Goal

通过 Agent 持续巡视藏宝阁，发现价格明显低于合理价值的角色，并建立历史价格和估值数据。

## Architecture

- **mobile**: 藏宝阁 APP 自动采集
- **pc**: 数据分析、估值、评分和展示
- **shared**: 公共 Schema
- **data**: 采集数据

## Current Target

- 109级角色
- 价格范围：3500-6500 元
- 目标：寻找约 5000 元附近高性价比角色

## Directory Structure

```
cbg-agent-radar/
├── README.md
├── .gitignore
├── pc/                    # PC 端分析、评分、展示
│   ├── src/
│   ├── scripts/
│   └── reports/
├── mobile/                # 移动端采集
│   ├── src/
│   ├── scripts/
│   ├── screenshots/
│   └── logs/
├── shared/                # 公共 Schema 和配置
│   ├── schema/
│   ├── config/
│   └── docs/
├── data/                  # 数据中心
│   ├── raw/
│   ├── parsed/
│   ├── candidates/
│   ├── details/           # 单角色详情 {itemId}.json
│   ├── comparisons/
│   └── snapshots/         # 采集批次快照
├── docs/
│   ├── discovery-log.md
│   ├── architecture.md
│   └── collection-protocol.md
└── tools/
```

## Data Format

每个角色商品单独保存为 `data/details/{itemId}.json`。

数据索引位于 `data/index.json`，包含所有已采集商品的基础信息。

采集批次快照位于 `data/snapshots/{batchId}/`。

## Schema

公共数据结构定义在 `shared/schema/role.ts`。

## 安全规则

- 禁止提交 Cookie、Token、Password、Session 等敏感信息
- 截图中不得包含手机号、账号、身份信息
- 所有采集数据通过 `.gitignore` 和敏感信息扫描双重检查

## 当前数据

- 采集时间：2026-09-22
- 候选角色：7个
- 详情文件：7个
- 截图：10张（含1张正式采集截图，9张诊断截图）
- 采集批次：1个（2026-09-22-001）
