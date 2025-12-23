# PDF 高亮表设计文档

## 1. 数据库表设计

### 表名：`pdf_highlights`

```sql
CREATE TABLE `pdf_highlights` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '高亮ID，主键',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，外键关联用户表',
  `paper_id` BIGINT UNSIGNED NOT NULL COMMENT '论文ID，外键关联paper表（主键）',
  `paper_title` VARCHAR(500) DEFAULT NULL COMMENT '论文标题（冗余字段，便于查询）',
  `page_index` INT UNSIGNED NOT NULL COMMENT '页面索引（从0开始）',
  `highlighted_text` TEXT NOT NULL COMMENT '高亮的文字内容',
  `position_data` JSON NOT NULL COMMENT '高亮位置信息（JSON格式存储rects数组）',
  `color` VARCHAR(20) DEFAULT '#ffff00' COMMENT '高亮颜色（十六进制或颜色名）',
  `opacity` DECIMAL(3,2) DEFAULT 0.30 COMMENT '高亮透明度（0.00-1.00）',
  `note` TEXT DEFAULT NULL COMMENT '用户备注（可选）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_paper_id` (`paper_id`),
  KEY `idx_page_index` (`page_index`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_highlight_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_highlight_paper` FOREIGN KEY (`paper_id`) REFERENCES `paper` (`paper_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PDF高亮表';
```

## 2. 字段说明

| 字段名 | 类型 | 说明 | 必填 |
|--------|------|------|------|
| id | BIGINT | 主键，自增 | 是 |
| user_id | BIGINT | 用户ID，关联用户表 | 是 |
| paper_id | BIGINT | 论文ID，关联paper表（主键） | 是 |
| paper_title | VARCHAR(500) | 论文标题（冗余，便于查询） | 否 |
| page_index | INT | 页面索引（0-based） | 是 |
| highlighted_text | TEXT | 高亮的文字内容 | 是 |
| position_data | JSON | 位置信息，存储rects数组 | 是 |
| color | VARCHAR(20) | 高亮颜色，默认黄色 | 否 |
| opacity | DECIMAL(3,2) | 透明度，默认0.30 | 否 |
| note | TEXT | 用户备注 | 否 |
| created_at | DATETIME | 创建时间 | 是 |
| updated_at | DATETIME | 更新时间 | 是 |
| deleted_at | DATETIME | 软删除时间 | 否 |

## 3. position_data JSON 结构示例

```json
{
  "rects": [
    {
      "left": 100.5,
      "top": 200.3,
      "width": 150.2,
      "height": 18.5
    },
    {
      "left": 100.5,
      "top": 220.8,
      "width": 200.1,
      "height": 18.5
    }
  ],
  "viewport": {
    "scale": 1.5,
    "width": 612,
    "height": 792
  }
}
```

## 4. 索引设计

- **主键索引**：`id` - 用于唯一标识
- **用户索引**：`idx_user_id` - 查询用户的所有高亮
- **论文索引**：`idx_paper_id` - 查询某个论文的所有高亮
- **页面索引**：`idx_page_index` - 查询特定页面的高亮
- **时间索引**：`idx_created_at` - 按时间排序
- **软删除索引**：`idx_deleted_at` - 过滤已删除记录

## 5. 查询场景优化

### 场景1：获取用户的所有高亮
```sql
SELECT * FROM pdf_highlights 
WHERE user_id = ? AND deleted_at IS NULL 
ORDER BY created_at DESC;
```

### 场景2：获取某个论文的所有高亮
```sql
SELECT * FROM pdf_highlights 
WHERE paper_id = ? AND deleted_at IS NULL 
ORDER BY page_index ASC, created_at ASC;
```

### 场景3：获取某个论文特定页面的高亮
```sql
SELECT * FROM pdf_highlights 
WHERE paper_id = ? AND page_index = ? AND deleted_at IS NULL 
ORDER BY created_at ASC;
```

### 场景4：获取用户对某个论文的高亮
```sql
SELECT * FROM pdf_highlights 
WHERE user_id = ? AND paper_id = ? AND deleted_at IS NULL 
ORDER BY page_index ASC, created_at ASC;
```

## 6. 扩展字段（可选）

如果需要更复杂的功能，可以考虑添加：

```sql
-- 高亮类型（文本高亮、下划线、删除线等）
`highlight_type` ENUM('highlight', 'underline', 'strikethrough') DEFAULT 'highlight',

-- 高亮分组/标签
`tag` VARCHAR(50) DEFAULT NULL,

-- 是否公开（分享功能）
`is_public` TINYINT(1) DEFAULT 0,

-- 高亮顺序（同一位置多个高亮）
`z_index` INT DEFAULT 0,
```

## 7. 性能优化建议

1. **分页查询**：对于大量高亮，使用分页
2. **缓存策略**：热门PDF的高亮可以缓存
3. **批量操作**：支持批量创建/删除高亮
4. **异步处理**：高亮统计等非实时数据可以异步计算

## 8. 数据迁移示例

```sql
-- 如果已有高亮数据需要迁移
INSERT INTO pdf_highlights (user_id, pdf_file_id, pdf_file_name, page_index, highlighted_text, position_data, color, created_at)
SELECT 
  user_id,
  pdf_id,
  pdf_name,
  page_num,
  text_content,
  JSON_OBJECT('rects', JSON_ARRAY(JSON_OBJECT('left', x, 'top', y, 'width', w, 'height', h))),
  '#ffff00',
  NOW()
FROM old_highlights_table;
```

