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
