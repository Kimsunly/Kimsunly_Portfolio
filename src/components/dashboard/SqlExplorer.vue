<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Play, Database, Table, HelpCircle } from '@lucide/vue'

const { t } = useI18n()

// DB Schemas and Data
const dbTechnologies = [
  { id: 1,  name: 'Node.js',         category: 'Frameworks', status: 'active'   },
  { id: 2,  name: 'Express.js',      category: 'Frameworks', status: 'active'   },
  { id: 3,  name: 'Vue.js',          category: 'Frameworks', status: 'active'   },
  { id: 4,  name: 'Next.js',         category: 'Frameworks', status: 'active'   },
  { id: 5,  name: 'NestJS',          category: 'Frameworks', status: 'learning' },
  { id: 6,  name: 'React',           category: 'Frameworks', status: 'learning' },
  { id: 7,  name: 'MySQL',           category: 'Database',   status: 'active'   },
  { id: 8,  name: 'PostgreSQL',      category: 'Database',   status: 'learning' },
  { id: 9,  name: 'MongoDB',         category: 'Database',   status: 'learning' },
  { id: 10, name: 'Redis',           category: 'Database',   status: 'learning' },
  { id: 11, name: 'TypeScript',      category: 'Languages',  status: 'active'   },
  { id: 12, name: 'JavaScript',      category: 'Languages',  status: 'active'   },
  { id: 13, name: 'Python',          category: 'Languages',  status: 'active'   },
  { id: 14, name: 'Docker',          category: 'DevOps',     status: 'learning' },
  { id: 15, name: 'Linux',           category: 'DevOps',     status: 'active'   },
  { id: 16, name: 'Nginx',           category: 'DevOps',     status: 'active'   },
  { id: 17, name: 'AWS',             category: 'DevOps',     status: 'learning' },
  { id: 18, name: 'GitHub Actions',  category: 'DevOps',     status: 'learning' },
  { id: 19, name: 'Git',             category: 'Tools',      status: 'active'   },
  { id: 20, name: 'Postman',         category: 'Tools',      status: 'active'   },
  { id: 21, name: 'GraphQL',         category: 'Exploring',  status: 'learning' },
  { id: 22, name: 'Prisma',          category: 'Exploring',  status: 'learning' },
]

const dbProjects = [
  { id: 1, title: 'ANTPAY',                          role: 'Group Leader & Backend Developer',    organization: 'ANT Tech', featured: 1 },
  { id: 2, title: 'VETIKA',                          role: 'Group Leader & Frontend Developer',   organization: 'ANT Tech', featured: 1 },
  { id: 3, title: 'Smakjit (Volunteer)',             role: 'Group Leader & Full-Stack Developer', organization: 'ANT Tech & RUPP', featured: 1 },
  { id: 4, title: 'Smart Document Q&A Assistant',   role: 'Developer',                           organization: 'Personal Project', featured: 0 },
  { id: 5, title: 'SEO Preview',                    role: 'Developer',                           organization: 'Academic Coursework', featured: 0 },
  { id: 6, title: 'Assignment Web',                 role: 'Developer',                           organization: 'Academic Coursework', featured: 0 },
]

const dbSystemLogs = [
  { id: 1, event: 'Portfolio system boot — v1.0 initialized',           ip_address: '127.0.0.1',   timestamp: '2026-07-03 00:00:00' },
  { id: 2, event: 'MySQL connection pool established (max: 10)',         ip_address: '127.0.0.1',   timestamp: '2026-07-03 00:00:01' },
  { id: 3, event: 'JWT middleware registered on protected routes',       ip_address: '127.0.0.1',   timestamp: '2026-07-03 00:00:02' },
  { id: 4, event: 'GET /api/v1/projects — 200 OK (6 records)',          ip_address: '103.20.12.18', timestamp: '2026-07-03 00:12:05' },
  { id: 5, event: 'GET /api/v1/profile — 200 OK (cache hit)',           ip_address: '103.23.4.15', timestamp: '2026-07-03 00:14:30' },
  { id: 6, event: 'POST /api/v1/contact — 201 Created',                 ip_address: '103.23.4.21', timestamp: '2026-07-03 00:17:42' },
  { id: 7, event: 'GET /api/v1/admin/transactions — 401 Unauthorized',  ip_address: '103.99.0.11', timestamp: '2026-07-03 00:19:08' },
  { id: 8, event: 'Admin session started — role: admin',                ip_address: '103.20.12.18', timestamp: '2026-07-03 00:21:55' },
]

// Schema definition overview
const tablesSchema = [
  { name: 'technologies', columns: ['id', 'name', 'category', 'status'] },
  { name: 'projects', columns: ['id', 'title', 'role', 'organization', 'featured'] },
  { name: 'system_logs', columns: ['id', 'event', 'ip_address', 'timestamp'] }
]

const rawQuery = ref('SELECT * FROM technologies;')
const isExecuting = ref(false)
const queryError = ref<string | null>(null)
const execTime = ref<number | null>(null)

// Rendered table state
const resultHeaders = ref<string[]>([])
const resultRows = ref<any[]>([])

function applyTemplate(query: string) {
  rawQuery.value = query
  runQuery()
}

function runQuery() {
  if (isExecuting.value) return
  isExecuting.value = true
  queryError.value = null

  // Simulate SQL parsing latency
  const latency = Math.floor(Math.random() * 80 + 15) // 15ms - 95ms
  
  setTimeout(() => {
    try {
      parseAndExecute(rawQuery.value)
      execTime.value = latency
    } catch (err: any) {
      queryError.value = err.message
      resultHeaders.value = []
      resultRows.value = []
      execTime.value = null
    } finally {
      isExecuting.value = false
    }
  }, 300)
}

function parseAndExecute(sql: string) {
  const cleanSql = sql.trim().replace(/;$/, '').replace(/\s+/g, ' ')
  
  // Simple regex parser
  const selectRegex = /^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i
  const match = cleanSql.match(selectRegex)

  if (!match) {
    throw new Error('SQL Syntax Error. Supported syntax: SELECT [columns/*] FROM [table] [WHERE condition]')
  }

  const columnsStr = match[1].trim()
  const tableName = match[2].trim().toLowerCase()
  const whereClause = match[3] ? match[3].trim() : null

  // Resolve table data
  let rawDataset: any[] = []
  if (tableName === 'technologies') {
    rawDataset = dbTechnologies
  } else if (tableName === 'projects') {
    rawDataset = dbProjects
  } else if (tableName === 'system_logs') {
    rawDataset = dbSystemLogs
  } else {
    throw new Error(`Table "${tableName}" not found in database. Try querying "technologies", "projects", or "system_logs".`)
  }

  // Filter rows (WHERE logic)
  let filteredDataset = [...rawDataset]
  if (whereClause) {
    const filterMatch = whereClause.match(/(\w+)\s*=\s*(.+)/i)
    if (!filterMatch) {
      throw new Error('Unsupported WHERE clause syntax. Use format: column = value')
    }

    const filterCol = filterMatch[1].trim().toLowerCase()
    let filterVal = filterMatch[2].trim().replace(/^['"]|['"]$/g, '') // remove quotes

    filteredDataset = rawDataset.filter(row => {
      if (!(filterCol in row)) {
        throw new Error(`Column "${filterCol}" does not exist in table "${tableName}".`)
      }
      const val = row[filterCol as keyof typeof row]
      return val.toString().toLowerCase() === filterVal.toLowerCase()
    })
  }

  // Project columns (SELECT logic)
  let colsToSelect: string[] = []
  const schema = tablesSchema.find(t => t.name === tableName)!
  
  if (columnsStr === '*') {
    colsToSelect = schema.columns
  } else {
    colsToSelect = columnsStr.split(',').map(c => c.trim().toLowerCase())
    // Validate columns
    for (const col of colsToSelect) {
      if (!schema.columns.includes(col)) {
        throw new Error(`Column "${col}" does not exist in table "${tableName}". Available: ${schema.columns.join(', ')}`)
      }
    }
  }

  // Build result rows
  resultHeaders.value = colsToSelect.map(c => c.toUpperCase())
  resultRows.value = filteredDataset.map(row => {
    const projectedRow: Record<string, any> = {}
    for (const col of colsToSelect) {
      projectedRow[col.toUpperCase()] = row[col as keyof typeof row]
    }
    return projectedRow
  })
}

// Initial load
runQuery()
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full text-text-primary">
    <!-- SQL Config & Query Input (Left) -->
    <div class="lg:col-span-5 flex flex-col gap-6">
      <!-- Database schema helper -->
      <div class="border border-border bg-surface-elevated/20 rounded-panel p-6">
        <span class="flex items-center gap-2 font-mono text-caption text-text-secondary uppercase mb-3 font-semibold">
          <Database :size="14" class="text-primary" />
          Virtual Database Schema
        </span>
        <div class="space-y-4 font-mono text-[11px]">
          <div v-for="table in tablesSchema" :key="table.name" class="flex flex-col gap-2 border-b border-border pb-3 last:border-b-0 last:pb-0">
            <span class="text-primary font-bold flex items-center gap-1">
              <Table :size="10" />
              {{ table.name }}
            </span>
            <span class="text-text-muted">
              Columns: ({{ table.columns.join(', ') }})
            </span>
          </div>
        </div>
      </div>

      <!-- Preset query templates -->
      <div>
        <label class="block font-mono text-caption text-text-muted mb-2 uppercase tracking-wider">
          Query Templates
        </label>
        <div class="grid grid-cols-2 gap-3.5">
          <button
            @click="applyTemplate('SELECT * FROM technologies;')"
            class="px-4 py-2.5 border border-border rounded bg-surface/30 hover:border-primary/40 hover:bg-surface-elevated text-[11px] font-mono text-left truncate transition-all duration-150"
          >
            {{ t('devConsole.sql.templates.allProjects') }}
          </button>
          <button
            @click="applyTemplate('SELECT title, role, organization FROM projects;')"
            class="px-4 py-2.5 border border-border rounded bg-surface/30 hover:border-primary/40 hover:bg-surface-elevated text-[11px] font-mono text-left truncate transition-all duration-150"
          >
            Get Projects
          </button>
          <button
            @click="applyTemplate('SELECT name, category FROM technologies WHERE status = \'learning\';')"
            class="px-4 py-2.5 border border-border rounded bg-surface/30 hover:border-primary/40 hover:bg-surface-elevated text-[11px] font-mono text-left truncate transition-all duration-150"
          >
            {{ t('devConsole.sql.templates.learningTech') }}
          </button>
          <button
            @click="applyTemplate('SELECT * FROM system_logs WHERE ip_address = \'103.20.12.18\';')"
            class="px-4 py-2.5 border border-border rounded bg-surface/30 hover:border-primary/40 hover:bg-surface-elevated text-[11px] font-mono text-left truncate transition-all duration-150"
          >
            Filter Logs
          </button>
        </div>
      </div>

      <!-- SQL Query editor text box -->
      <div>
        <label class="block font-mono text-caption text-text-muted mb-2 uppercase tracking-wider">
          {{ t('devConsole.sql.queryLabel') }}
        </label>
        <textarea
          v-model="rawQuery"
          rows="4"
          spellcheck="false"
          class="w-full bg-surface-elevated border border-border text-small rounded-input p-5 font-mono outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none transition-all"
        ></textarea>
      </div>

      <!-- Run Button -->
      <button
        @click="runQuery"
        :disabled="isExecuting"
        class="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] text-white py-3 px-6 rounded-button font-mono text-small font-semibold shadow-lg shadow-primary/25 disabled:opacity-40 transition-all duration-150"
      >
        <Play :size="14" class="fill-current" />
        {{ isExecuting ? t('devConsole.sql.running') : t('devConsole.sql.runButton') }}
      </button>
    </div>

    <!-- SQL Results Data Grid (Right) -->
    <div class="lg:col-span-7 flex flex-col border border-border bg-surface-elevated/10 rounded-panel overflow-hidden">
      <!-- Status Header -->
      <div class="flex flex-wrap items-center gap-4 px-4 py-2 border-b border-border bg-surface-elevated/40 justify-between font-mono text-caption text-text-secondary">
        <span>{{ t('devConsole.sql.resultsLabel') }}</span>
        <div class="flex items-center gap-4">
          <span v-if="execTime && !queryError" class="text-text-muted">
            Execution Time: <span class="text-primary/90 font-bold">{{ execTime }}ms</span>
          </span>
          <span v-if="resultRows.length > 0 && !queryError" class="text-text-muted">
            {{ t('devConsole.sql.affectedRows') }}: <span class="text-primary/70 font-semibold">{{ resultRows.length }}</span>
          </span>
        </div>
      </div>

      <!-- Results Grid Panel -->
      <div class="flex-1 flex flex-col min-h-[300px] overflow-auto">
        <!-- Error output -->
        <div 
          v-if="queryError" 
          class="p-6 bg-error/5 border border-error/20 rounded m-4 flex flex-col gap-2 font-mono text-small text-error"
        >
          <span class="font-bold flex items-center gap-2">
            <HelpCircle :size="16" />
            Database Exception
          </span>
          <p class="leading-relaxed">{{ queryError }}</p>
        </div>

        <!-- Empty Rows state -->
        <div 
          v-else-if="resultRows.length === 0" 
          class="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted gap-3"
        >
          <HelpCircle :size="28" class="text-text-muted/65" />
          <p class="font-mono text-small max-w-[280px]">
            No records matched or query has not been executed yet.
          </p>
        </div>

        <!-- Data Grid Table -->
        <div v-else class="w-full overflow-x-auto select-text selection:bg-primary/20">
          <table class="w-full font-mono text-[13px] border-collapse">
            <thead>
              <tr class="border-b border-border bg-surface-elevated/40">
                <th 
                  v-for="col in resultHeaders" 
                  :key="col" 
                  class="text-left px-6 py-4 text-text-secondary uppercase tracking-wider font-semibold"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/30 bg-surface/10">
              <tr 
                v-for="(row, idx) in resultRows" 
                :key="idx" 
                class="hover:bg-surface-elevated/20 transition-colors"
              >
                <td 
                  v-for="col in resultHeaders" 
                  :key="col" 
                  class="px-6 py-3.5 text-text-primary whitespace-nowrap"
                >
                  {{ row[col] !== null && row[col] !== undefined ? row[col] : 'NULL' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
