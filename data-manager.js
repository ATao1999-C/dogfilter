// data-manager.js - 数据管理类
console.log('💾 数据管理模块加载');

class DataManager {
    constructor() {
        this.STORAGE_KEYS = {
            RECORDS: 'dog_filter_records',
            SETTINGS: 'dog_filter_settings'
        };
        this.records = [];
        this.settings = { ...CONFIG.SETTINGS };
        this.init();
    }

    init() {
        this.loadRecords();
        console.log('数据管理器就绪，记录数:', this.records.length);
    }

    // 加载记录
    loadRecords() {
        try {
            const recordsData = localStorage.getItem(this.STORAGE_KEYS.RECORDS);
            if (recordsData) {
                this.records = JSON.parse(recordsData);
            } else {
                // 使用默认数据
                this.records = [...CONFIG.SAMPLE_DATA];
                this.saveRecords();
            }
        } catch (error) {
            console.error('加载记录失败:', error);
            this.records = [...CONFIG.SAMPLE_DATA];
        }
    }

    // 保存记录
    saveRecords() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.RECORDS, JSON.stringify(this.records));
            return true;
        } catch (error) {
            console.error('保存记录失败:', error);
            return false;
        }
    }

    // 获取记录（支持筛选）
    getRecords(filter = null) {
        if (!filter) return [...this.records];
        
        return this.records.filter(record => {
            // 类别筛选
            if (filter.category && filter.category.length > 0) {
                if (!filter.category.includes(record.category)) return false;
            }
            // 年龄筛选
            if (filter.age && filter.age.length > 0) {
                if (!filter.age.includes(record.age)) return false;
            }
            // 地区筛选
            if (filter.region && filter.region.length > 0) {
                if (!filter.region.includes(record.region)) return false;
            }
            // 种类筛选
            if (filter.breed && filter.breed.length > 0) {
                if (!filter.breed.includes(record.breed)) return false;
            }
            // 其他筛选条件（VIP功能）
            if (authManager.hasPermission('hasDog')) {
                if (filter.hasDog && filter.hasDog.length > 0) {
                    if (!filter.hasDog.includes(record.hasDog)) return false;
                }
                if (filter.dogGender && filter.dogGender.length > 0) {
                    if (!filter.dogGender.includes(record.dogGender)) return false;
                }
                if (filter.breeding && filter.breeding.length > 0) {
                    if (!filter.breeding.includes(record.breeding)) return false;
                }
                if (filter.paid && filter.paid.length > 0) {
                    if (!filter.paid.includes(record.paid)) return false;
                }
                if (filter.status && filter.status.length > 0) {
                    if (!filter.status.includes(record.status)) return false;
                }
            }
            return true;
        });
    }

    // 添加记录
    addRecord(recordData) {
        try {
            // 生成新ID
            const newId = this.generateNewId();
            const newRecord = {
                id: newId,
                ...recordData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.records.unshift(newRecord);
            this.saveRecords();
            console.log('记录添加成功，ID:', newId);
            return { success: true, id: newId, record: newRecord };
        } catch (error) {
            console.error('添加记录失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 更新记录
    updateRecord(id, updates) {
        try {
            const index = this.records.findIndex(record => record.id === id);
            if (index === -1) return { success: false, error: '记录不存在' };
            
            this.records[index] = {
                ...this.records[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveRecords();
            console.log('记录更新成功，ID:', id);
            return { success: true, record: this.records[index] };
        } catch (error) {
            console.error('更新记录失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 生成新ID
    generateNewId() {
        if (this.records.length === 0) return '00001';
        const maxId = Math.max(...this.records.map(record => {
            const idNum = parseInt(record.id);
            return isNaN(idNum) ? 0 : idNum;
        }));
        return (maxId + 1).toString().padStart(5, '0');
    }

    // 获取统计数据
    getStats() {
        return {
            totalRecords: this.records.length,
            byCategory: this.countByField('category'),
            byAge: this.countByField('age'),
            byRegion: this.countByField('region'),
            byBreed: this.countByField('breed'),
            lastUpdated: new Date().toLocaleString('zh-CN')
        };
    }

    // 按字段计数
    countByField(field) {
        const counts = {};
        this.records.forEach(record => {
            const value = record[field] || '未知';
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    }
}

// 初始化数据管理器
window.initDataManager = function() {
    if (!window.dataManager) {
        window.dataManager = new DataManager();
    }
    return window.dataManager;
};

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    window.dataManager = initDataManager();
});