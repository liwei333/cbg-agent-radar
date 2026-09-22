# Collection Protocol

## 采集频率

- 建议每 2-6 小时巡视一次
- 同一商品不重复采集（通过 itemId 去重）
- 新发现商品自动生成新 detail 文件

## 采集流程

1. 打开藏宝阁 APP
2. 设置筛选条件（等级、价格范围）
3. 遍历搜索结果列表
4. 对候选角色进入详情页
5. 提取基础信息 + 装备 + 召唤兽 + 限量资产
6. 生成单角色 JSON
7. 更新 index.json
8. 保存批次快照

## 数据字段

### 必填

- itemId
- price
- level
- school
- server
- collectedAt

### 可选

- achievement
- potentialFruit
- opportunity
- cultivation
- equipment
- pets
- cosmetics

## 隐私检查

- 手机号、网易账号、QQ、微信、身份信息不得出现在任何上传数据中
- 截图需人工或自动检查是否包含个人信息
- 所有采集数据通过 `.gitignore` 和敏感信息扫描双重检查

## Phase 3 新增规范

### null/empty 语义

- `[]` 只能表示"已确认没有"
- 未采集到使用 `null` + `collectionStatus: "not_collected"`
- 部分采集使用 `[]` + `collectionStatus: "partial"`
- 完整采集使用 `[]` + `collectionStatus: "complete"`

### 状态机

```
DISCOVERED → LIST_COLLECTED → DETAIL_PARTIAL → DETAIL_COMPLETE
    → COMPARABLES_PARTIAL → COMPARABLES_READY → VALUED → PROFITABLE
    → READY_TO_BUY → USER_APPROVAL_REQUIRED → PURCHASED
```

### Comparable 数据

- 每个 comparable 必须有 itemId 或 detailUrl 或 fingerprint
- fingerprint 不能包含价格字段（同一角色可能降价）
- 市场池按门派分别建立

### 价格历史

- 同一 itemId 多次观察记录价格变化
- `not_found` 不等于 `sold`，标记为 `unknown_exit`
- 维护 firstSeenAt 和 lastSeenAt

### listingAge

- `listingRemainingTime`：页面显示的剩余时间
- `observedListingAgeHours`：now - firstSeenAt
- 不要混淆两者
