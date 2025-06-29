<template>
  <div class="advanced-table">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <el-button type="primary" @click="handleAdd" v-if="showAdd">
            <el-icon><Plus /></el-icon>
            {{ $t('common.add') }}
          </el-button>
          <el-button type="danger" @click="handleBatchDelete" v-if="showBatchDelete && selectedRows.length > 0">
            <el-icon><Delete /></el-icon>
            {{ $t('common.batchDelete') }}
          </el-button>
        </slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right">
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            {{ $t('common.refresh') }}
          </el-button>
          <el-button @click="handleExport" v-if="showExport">
            <el-icon><Download /></el-icon>
            {{ $t('common.export') }}
          </el-button>
          <el-button @click="handleColumnSettings">
            <el-icon><Setting /></el-icon>
            {{ $t('table.columnSettings') }}
          </el-button>
        </slot>
      </div>
    </div>

    <!-- 搜索表单 -->
    <div v-if="showSearch" class="table-search">
      <el-form :model="searchForm" inline class="search-form">
        <slot name="search" :search-form="searchForm">
          <el-form-item v-for="field in searchFields" :key="field.prop" :label="field.label">
            <el-input
              v-if="field.type === 'input'"
              v-model="searchForm[field.prop]"
              :placeholder="field.placeholder"
              clearable
            />
            <el-select
              v-else-if="field.type === 'select'"
              v-model="searchForm[field.prop]"
              :placeholder="field.placeholder"
              clearable
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else-if="field.type === 'date'"
              v-model="searchForm[field.prop]"
              :type="field.dateType || 'date'"
              :placeholder="field.placeholder"
              clearable
            />
          </el-form-item>
        </slot>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      :row-key="rowKey"
      :empty-text="emptyText"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      :indent="indent"
      :lazy="lazy"
      :load="load"
      :tree-props="treeProps"
      :table-layout="tableLayout"
      :scrollbar-always-on="scrollbarAlwaysOn"
      :flexible="flexible"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblclick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @current-change="handleCurrentChange"
      @header-dragend="handleHeaderDragend"
      @expand-change="handleExpandChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
        fixed="left"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        :label="$t('table.index')"
        width="60"
        align="center"
        fixed="left"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        v-bind="column"
        :show-overflow-tooltip="column.showOverflowTooltip !== false"
      >
        <template #default="scope" v-if="column.slot">
          <slot :name="column.slot" :row="scope.row" :column="scope.column" :$index="scope.$index">
            {{ scope.row[column.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        :label="$t('table.actions')"
        :width="actionsWidth"
        :fixed="actionsFixed"
        align="center"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :column="scope.column" :$index="scope.$index">
            <el-button type="primary" link @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>
              {{ $t('common.edit') }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>
              {{ $t('common.delete') }}
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="pageSizes"
        :total="pagination.total"
        :layout="paginationLayout"
        :background="paginationBackground"
        :small="paginationSmall"
        :hide-on-single-page="hideOnSinglePage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 列设置对话框 -->
    <el-dialog
      v-model="columnSettingsVisible"
      :title="$t('table.columnSettings')"
      width="600px"
    >
      <el-checkbox-group v-model="visibleColumnProps">
        <el-checkbox
          v-for="column in allColumns"
          :key="column.prop"
          :label="column.prop"
        >
          {{ column.label }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="columnSettingsVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleColumnSettingsConfirm">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

// 定义组件属性
const props = defineProps({
  // 数据相关
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  // 表格配置
  height: [String, Number],
  maxHeight: [String, Number],
  stripe: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default'
  },
  fit: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  highlightCurrentRow: {
    type: Boolean,
    default: true
  },
  currentRowKey: [String, Number],
  rowKey: [String, Function],
  emptyText: String,
  defaultExpandAll: Boolean,
  expandRowKeys: Array,
  defaultSort: Object,
  tooltipEffect: String,
  showSummary: Boolean,
  sumText: String,
  summaryMethod: Function,
  spanMethod: Function,
  selectOnIndeterminate: {
    type: Boolean,
    default: true
  },
  indent: {
    type: Number,
    default: 16
  },
  lazy: Boolean,
  load: Function,
  treeProps: Object,
  tableLayout: String,
  scrollbarAlwaysOn: Boolean,
  flexible: Boolean,
  
  // 功能开关
  showToolbar: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showSelection: {
    type: Boolean,
    default: false
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  showAdd: {
    type: Boolean,
    default: true
  },
  showBatchDelete: {
    type: Boolean,
    default: false
  },
  showExport: {
    type: Boolean,
    default: false
  },
  
  // 搜索配置
  searchFields: {
    type: Array,
    default: () => []
  },
  
  // 操作列配置
  actionsWidth: {
    type: [String, Number],
    default: 200
  },
  actionsFixed: {
    type: String,
    default: 'right'
  },
  
  // 分页配置
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  paginationBackground: {
    type: Boolean,
    default: true
  },
  paginationSmall: Boolean,
  hideOnSinglePage: Boolean,
  
  // 样式配置
  rowClassName: [String, Function],
  rowStyle: [Object, Function],
  cellClassName: [String, Function],
  cellStyle: [Object, Function],
  headerRowClassName: [String, Function],
  headerRowStyle: [Object, Function],
  headerCellClassName: [String, Function],
  headerCellStyle: [Object, Function]
})

// 定义事件
const emit = defineEmits([
  'add',
  'edit',
  'delete',
  'batch-delete',
  'refresh',
  'export',
  'search',
  'reset',
  'selection-change',
  'current-change',
  'size-change',
  'sort-change',
  'filter-change'
])

// 国际化
const { t } = useI18n()

// 响应式数据
const tableRef = ref()
const searchForm = ref({})
const selectedRows = ref([])
const columnSettingsVisible = ref(false)
const visibleColumnProps = ref([])

// 分页数据
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 计算属性
const tableData = computed(() => props.data)
const allColumns = computed(() => props.columns)
const visibleColumns = computed(() => {
  if (visibleColumnProps.value.length === 0) {
    return allColumns.value
  }
  return allColumns.value.filter(col => visibleColumnProps.value.includes(col.prop))
})

// 初始化
const init = () => {
  // 初始化可见列
  visibleColumnProps.value = allColumns.value.map(col => col.prop)
  
  // 初始化搜索表单
  if (props.searchFields.length > 0) {
    props.searchFields.forEach(field => {
      searchForm.value[field.prop] = ''
    })
  }
}

// 事件处理
const handleAdd = () => {
  emit('add')
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    t('table.deleteConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    emit('delete', row)
  })
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning(t('table.noSelectedRows'))
    return
  }
  
  ElMessageBox.confirm(
    t('table.batchDeleteConfirm'),
    t('common.warning'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    emit('batch-delete', selectedRows.value)
  })
}

const handleRefresh = () => {
  emit('refresh')
}

const handleExport = () => {
  emit('export')
}

const handleSearch = () => {
  emit('search', searchForm.value)
}

const handleReset = () => {
  searchForm.value = {}
  emit('reset')
}

const handleColumnSettings = () => {
  columnSettingsVisible.value = true
}

const handleColumnSettingsConfirm = () => {
  columnSettingsVisible.value = false
  // 可以保存列设置到localStorage
  localStorage.setItem('table-column-settings', JSON.stringify(visibleColumnProps.value))
}

// 表格事件
const handleSelect = (selection, row) => {
  emit('selection-change', selection)
}

const handleSelectAll = (selection) => {
  emit('selection-change', selection)
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

const handleCellMouseEnter = (row, column, cell, event) => {
  // 可以在这里添加鼠标悬停效果
}

const handleCellMouseLeave = (row, column, cell, event) => {
  // 可以在这里移除鼠标悬停效果
}

const handleCellClick = (row, column, cell, event) => {
  // 单元格点击事件
}

const handleCellDblclick = (row, column, cell, event) => {
  // 单元格双击事件
}

const handleRowClick = (row, column, event) => {
  // 行点击事件
}

const handleRowContextmenu = (row, column, event) => {
  // 行右键菜单事件
}

const handleRowDblclick = (row, column, event) => {
  // 行双击事件
}

const handleHeaderClick = (column, event) => {
  // 表头点击事件
}

const handleHeaderContextmenu = (column, event) => {
  // 表头右键菜单事件
}

const handleSortChange = ({ column, prop, order }) => {
  emit('sort-change', { column, prop, order })
}

const handleFilterChange = (filters) => {
  emit('filter-change', filters)
}

const handleCurrentChange = (currentRow, oldCurrentRow) => {
  emit('current-change', currentRow, oldCurrentRow)
}

const handleHeaderDragend = (newWidth, oldWidth, column, event) => {
  // 表头拖拽结束事件
}

const handleExpandChange = (row, expandedRows) => {
  // 展开行变化事件
}

// 分页事件
const handleSizeChange = (size) => {
  pagination.value.size = size
  pagination.value.current = 1
  emit('size-change', size)
}

const handleCurrentChange = (current) => {
  pagination.value.current = current
  emit('current-change', current)
}

// 暴露方法
defineExpose({
  tableRef,
  searchForm,
  selectedRows,
  pagination,
  refresh: handleRefresh,
  clearSelection: () => {
    tableRef.value?.clearSelection()
  },
  toggleRowSelection: (row, selected) => {
    tableRef.value?.toggleRowSelection(row, selected)
  },
  toggleAllSelection: () => {
    tableRef.value?.toggleAllSelection()
  },
  setCurrentRow: (row) => {
    tableRef.value?.setCurrentRow(row)
  },
  clearSort: () => {
    tableRef.value?.clearSort()
  },
  clearFilter: (columnKeys) => {
    tableRef.value?.clearFilter(columnKeys)
  },
  doLayout: () => {
    tableRef.value?.doLayout()
  },
  sort: (prop, order) => {
    tableRef.value?.sort(prop, order)
  }
})

// 初始化
nextTick(() => {
  init()
})
</script>

<style lang="scss" scoped>
.advanced-table {
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 16px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
    
    .toolbar-left {
      display: flex;
      gap: 8px;
    }
    
    .toolbar-right {
      display: flex;
      gap: 8px;
    }
  }
  
  .table-search {
    margin-bottom: 16px;
    padding: 16px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
    
    .search-form {
      .el-form-item {
        margin-bottom: 0;
        margin-right: 16px;
      }
    }
  }
  
  .table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 16px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--el-border-radius-base);
  }
  
  :deep(.el-table) {
    // 自定义表格样式
    .el-table__header {
      background: var(--el-color-primary-light-9);
    }
    
    .el-table__row {
      &:hover {
        background: var(--el-color-primary-light-9);
      }
    }
    
    .el-table__row--striped {
      background: var(--el-fill-color-lighter);
    }
  }
}
</style> 