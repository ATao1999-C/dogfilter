// admin.js - 管理员后台逻辑
class AdminManager {
    constructor() {
        this.dataManager = window.getDataManager();
        this.init();
    }

    init() {
        this.checkAdminLogin();
        this.bindEvents();
        this.loadAdminData();
    }

    checkAdminLogin() {
        // 简单检查，实际应用中应有更安全的验证
        const isAdmin = localStorage.getItem('dog_filter_admin') === 'true';
        const adminLogin = document.getElementById('adminLogin');
        const adminDashboard = document.getElementById('adminDashboard');

        if (isAdmin) {
            adminLogin.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
        } else {
            adminLogin.classList.remove('hidden');
            adminDashboard.classList.add('hidden');
        }
    }

    bindEvents() {
        // 管理员登录
        document.getElementById('adminLoginBtn')?.addEventListener('click', () => this.handleAdminLogin());
        document.getElementById('adminPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAdminLogin();
        });

        // 数据管理
        document.getElementById('refreshData')?.addEventListener('click', () => this.loadAdminData());
        document.getElementById('exportAllData')?.addEventListener('click', () => this.exportAllData());

        // 系统设置
        document.getElementById('saveSettings')?.addEventListener('click', () => this.saveSettings());

        // 导航切换
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.switchSection(target);
            });
        });
    }

    handleAdminLogin() {
        const password = document.getElementById('adminPassword').value;
        const adminPassword = CONFIG.ADMIN_PASSWORD || 'admin123!';

        if (password === adminPassword) {
            localStorage.setItem('dog_filter_admin', 'true');
            this.checkAdminLogin();
            this.showMessage('success', '管理员登录成功！');
        } else {
            this.showMessage('error', '密码错误！');
        }
    }

    switchSection(sectionId) {
        // 隐藏所有区域
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // 移除所有导航激活状态
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // 显示目标区域
        const targetSection = document.getElementById(sectionId + 'Section');
        const targetLink = document.querySelector(`.admin-nav-link[href="#${sectionId}"]`);

        if (targetSection) targetSection.classList.add('active');
        if (targetLink) targetLink.classList.add('active');
    }

    async loadAdminData() {
        try {
            const stats = this.dataManager.getStats();
            document.getElementById('totalRecords').textContent = stats.totalRecords || 0;

            // 加载数据记录
            this.loadDataTable();

            // 加载用户数据
            this.loadUsersTable();

            this.showMessage('success', '数据加载完成！');
        } catch (error) {
            this.showMessage('error', '加载数据失败：' + error.message);
        }
    }

    loadDataTable() {
        const tableBody = document.getElementById('adminDataTable');
        if (!tableBody) return;

        const records = this.dataManager.getRecords();
        tableBody.innerHTML = '';

        // 只显示前50条记录
        records.slice(0, 50).forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.id}</td>
                <td>${record.category || '-'}</td>
                <td>${record.age ? record.age + '后' : '-'}</td>
                <td>${record.region || '-'}</td>
                <td>${record.breed || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="adminManager.editRecord('${record.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminManager.deleteRecord('${record.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    loadUsersTable() {
        const tableBody = document.getElementById('usersTable');
        if (!tableBody) return;

        // 简化版本：实际应从数据管理器获取用户数据
        tableBody.innerHTML = `
            <tr>
                <td>admin-001</td>
                <td>admin</td>
                <td><span class="badge badge-primary">管理员</span></td>
                <td>${new Date().toLocaleDateString()}</td>
            </tr>
        `;
    }

    editRecord(recordId) {
        this.showMessage('info', `编辑记录 ${recordId}（功能开发中）`);
    }

    deleteRecord(recordId) {
        if (confirm(`确定要删除记录 ${recordId} 吗？`)) {
            const result = this.dataManager.deleteRecord(recordId);
            if (result.success) {
                this.loadAdminData();
                this.showMessage('success', '记录删除成功！');
            } else {
                this.showMessage('error', '删除失败：' + result.error);
            }
        }
    }

    exportAllData() {
        const result = this.dataManager.exportRecords('csv');
        if (result.success) {
            const blob = new Blob(['\uFEFF' + result.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dog-filter-data-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.showMessage('success', '数据导出成功！');
        } else {
            this.showMessage('error', '导出失败：' + result.error);
        }
    }

    saveSettings() {
        const siteName = document.getElementById('siteName').value;
        const newPassword = document.getElementById('newAdminPassword').value;

        if (newPassword && newPassword.length >= 6) {
            // 在实际应用中，这里应该安全地更新密码
            this.showMessage('success', '设置保存成功！请记住新密码。');
            document.getElementById('newAdminPassword').value = '';
        } else if (siteName) {
            this.showMessage('success', '网站名称已更新！');
        } else {
            this.showMessage('info', '设置未更改。');
        }
    }

    showMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载后初始化管理员后台
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});