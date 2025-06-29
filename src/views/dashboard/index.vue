<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 数据概览卡片 -->
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(item, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="card-header">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-icon">
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
            </div>
          </div>
          <div class="card-value">{{ item.value }}</div>
          <div class="card-footer">
            <span :class="{ 'text-success': item.rate > 0, 'text-danger': item.rate < 0 }">
              {{ item.rate > 0 ? '+' : '' }}{{ item.rate }}%
            </span>
            <span class="compared-text">较上周</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 折线图 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.salesTrend') }}</span>
              <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
                <el-radio-button value="week">{{ $t('dashboard.thisWeek') }}</el-radio-button>
                <el-radio-button value="month">{{ $t('dashboard.thisMonth') }}</el-radio-button>
                <el-radio-button value="year">{{ $t('dashboard.thisYear') }}</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <!-- 这里放置真实图表组件 -->
            <div class="mock-chart">销售趋势图表</div>
          </div>
        </el-card>
      </el-col>

      <!-- 饼图 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dashboard.recentOrders') }}</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <!-- 这里放置真实图表组件 -->
            <div class="mock-chart">销售分类占比图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 最新订单 -->
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header between">
              <span>{{ $t('dashboard.recentOrders') }}</span>
              <el-button type="primary" link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%" stripe>
            <el-table-column prop="id" label="订单号" width="180" />
            <el-table-column prop="customer" label="客户" />
            <el-table-column prop="date" label="日期" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ $t(`dashboard.${scope.row.status}`) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default>
                <el-button type="primary" link>详情</el-button>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 图表时间范围
const timeRange = ref('month')

// 数据统计卡片
const statCards = [
  {
    title: '总销售额',
    value: '¥ 126,560',
    icon: 'Money',
    rate: 15.2
  },
  {
    title: '访问量',
    value: '8,846',
    icon: 'View',
    rate: 12.5
  },
  {
    title: '订单量',
    value: '1,280',
    icon: 'Tickets',
    rate: -2.8
  },
  {
    title: '新增用户',
    value: '128',
    icon: 'User',
    rate: 8.2
  }
]

// 最近订单
const recentOrders = [
  {
    id: 'ORD-2023-0001',
    customer: '张三',
    date: '2023-08-10',
    amount: '¥1,200',
    status: '已完成'
  },
  {
    id: 'ORD-2023-0002',
    customer: '李四',
    date: '2023-08-09',
    amount: '¥2,340',
    status: '处理中'
  },
  {
    id: 'ORD-2023-0003',
    customer: '王五',
    date: '2023-08-08',
    amount: '¥560',
    status: '已取消'
  },
  {
    id: 'ORD-2023-0004',
    customer: '赵六',
    date: '2023-08-07',
    amount: '¥3,740',
    status: '已完成'
  },
  {
    id: 'ORD-2023-0005',
    customer: '钱七',
    date: '2023-08-06',
    amount: '¥890',
    status: '待支付'
  }
]

// 获取状态标签类型
const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '处理中': 'primary',
    '已取消': 'danger',
    '待支付': 'warning'
  }
  return map[status] || 'info'
}

// 处理时间范围变化
const handleTimeRangeChange = () => {
  // 这里可以添加处理逻辑
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  .stat-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      
      .card-title {
        font-size: 16px;
        color: var(--app-text-color-secondary);
      }
      
      .card-icon {
        font-size: 24px;
        color: var(--el-color-primary);
      }
    }
    
    .card-value {
      font-size: 26px;
      font-weight: bold;
      color: var(--app-text-color);
      margin: 16px 0;
    }
    
    .card-footer {
      font-size: 14px;
      
      .text-success {
        color: var(--el-color-success);
      }
      
      .text-danger {
        color: var(--el-color-danger);
      }
      
      .compared-text {
        color: var(--app-text-color-secondary);
        margin-left: 8px;
      }
    }
  }
  
  .chart-row {
    margin-bottom: 20px;
  }
  
  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chart-placeholder {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--app-bg-color);
      border-radius: 4px;
      
      .mock-chart {
        color: var(--app-text-color-secondary);
      }
    }
  }
  
  .between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 